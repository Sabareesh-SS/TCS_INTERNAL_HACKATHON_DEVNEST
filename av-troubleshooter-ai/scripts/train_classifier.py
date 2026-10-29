import os
import json
import re
import pandas as pd
import numpy as np
from pathlib import Path
from collections import Counter


def tokenize(text: str) -> list:
    """Tokenize text into lowercase alphanumeric terms."""
    return re.findall(r'\b[a-z0-9_]+\b', str(text).lower())


class SmartAVFaultClassifier:
    """
    Self-contained, reproducible Naive Bayes & Softmax Hybrid Classifier for AV Incidents.
    Trained strictly on the TRAIN partition of av_incidents.csv.
    Zero post-diagnosis or outcome leakage.
    Outputs predicted fault category and calibrated posterior confidence.
    """

    def __init__(self):
        self.vocab = []
        self.classes = []
        self.priors = {}
        self.word_probs = {}
        self.cat_probs = {}
        self.cat_cols = ["device_type", "power_status", "cable_status", "input_source"]
        self.total_words = {}
        self.V = 0

    def fit(self, train_df: pd.DataFrame, feature_cols: list, target_col: str):
        # 1. Build vocabulary strictly from TRAIN symptom texts
        vocab_set = set()
        for s in train_df["symptom"]:
            vocab_set.update(tokenize(s))
        self.vocab = sorted(list(vocab_set))
        self.V = len(self.vocab)

        self.classes = sorted(train_df[target_col].unique())
        n_train = len(train_df)

        # 2. Learn Class Priors P(C_k)
        class_counts = train_df[target_col].value_counts()
        self.priors = {c: float(class_counts.get(c, 0) / n_train) for c in self.classes}

        # 3. Learn Word Likelihoods P(w_j | C_k) with Laplace Smoothing
        word_counts = {c: Counter() for c in self.classes}
        for _, row in train_df.iterrows():
            c = row[target_col]
            for w in tokenize(row["symptom"]):
                word_counts[c][w] += 1

        self.total_words = {c: sum(word_counts[c].values()) for c in self.classes}
        self.word_probs = {
            c: {w: float((word_counts[c][w] + 1.0) / (self.total_words[c] + self.V)) for w in self.vocab}
            for c in self.classes
        }

        # 4. Learn Categorical Feature Likelihoods P(x_col | C_k)
        self.cat_probs = {}
        for col in self.cat_cols:
            self.cat_probs[col] = {}
            distinct_vals = [str(v) for v in train_df[col].unique()]
            n_vals = len(distinct_vals)
            for c in self.classes:
                self.cat_probs[col][c] = {}
                c_rows = train_df[train_df[target_col] == c]
                val_counts = c_rows[col].astype(str).value_counts()
                total_c = len(c_rows)
                for v in distinct_vals:
                    prob = float((val_counts.get(v, 0) + 1.0) / (total_c + n_vals))
                    self.cat_probs[col][c][v] = prob

    def predict_proba(self, record: dict) -> tuple:
        """
        Computes calibrated class probabilities using log-likelihood summation and softmax.
        Returns: (predicted_class, confidence_score, all_probabilities)
        """
        tokens = tokenize(record.get("symptom", ""))
        log_probs = {}

        for c in self.classes:
            lp = np.log(self.priors[c])
            # Text likelihood
            for t in tokens:
                p = self.word_probs[c].get(t, 1.0 / (self.total_words[c] + self.V))
                lp += np.log(p)
            # Categorical likelihoods
            for col in self.cat_cols:
                v = str(record.get(col, ""))
                p = self.cat_probs[col][c].get(v, 0.01)
                lp += np.log(p)
            log_probs[c] = float(lp)

        # Softmax normalization
        max_lp = max(log_probs.values())
        exps = {c: np.exp(lp - max_lp) for c, lp in log_probs.items()}
        total_exp = sum(exps.values())
        probs = {c: float(val / total_exp) for c, val in exps.items()}

        best_class = max(probs.items(), key=lambda x: x[1])[0]
        return best_class, probs[best_class], probs

    def to_dict(self) -> dict:
        return {
            "model_type": "SmartAVFaultClassifier",
            "vocab": self.vocab,
            "classes": self.classes,
            "priors": self.priors,
            "word_probs": self.word_probs,
            "cat_probs": self.cat_probs,
            "cat_cols": self.cat_cols,
            "total_words": self.total_words,
            "V": self.V
        }

    @classmethod
    def from_dict(cls, data: dict):
        model = cls()
        model.vocab = data["vocab"]
        model.classes = data["classes"]
        model.priors = data["priors"]
        model.word_probs = data["word_probs"]
        model.cat_probs = data["cat_probs"]
        model.cat_cols = data["cat_cols"]
        model.total_words = data["total_words"]
        model.V = data["V"]
        return model


def main():
    base_dir = Path(__file__).resolve().parent.parent
    data_dir = os.path.join(base_dir, "data")
    artifacts_dir = os.path.join(base_dir, "app", "ml", "artifacts")
    os.makedirs(artifacts_dir, exist_ok=True)

    incidents_path = os.path.join(data_dir, "av_incidents.csv")
    print(f"Loading incident dataset from: {incidents_path}")
    df = pd.read_csv(incidents_path)
    df.columns = df.columns.str.strip()

    train_df = df[df["dataset_split"] == "TRAIN"].copy()
    val_df = df[df["dataset_split"] == "VALIDATION"].copy()
    test_df = df[df["dataset_split"] == "TEST"].copy()

    print(f"Partitions: TRAIN={len(train_df)}, VALIDATION={len(val_df)}, TEST={len(test_df)}")
    assert len(train_df) == 180, f"Expected 180 TRAIN rows, got {len(train_df)}"
    assert len(val_df) == 60, f"Expected 60 VALIDATION rows, got {len(val_df)}"
    assert len(test_df) == 60, f"Expected 60 TEST rows, got {len(test_df)}"

    feature_cols = ["symptom", "device_type", "power_status", "cable_status", "input_source"]
    target_col = "fault_category"

    # Train model strictly on TRAIN split
    print("\nTraining genuine fault classifier on TRAIN split (zero leakage)...")
    model = SmartAVFaultClassifier()
    model.fit(train_df, feature_cols, target_col)

    # Evaluate on VALIDATION split
    val_preds = [model.predict_proba(row.to_dict())[0] for _, row in val_df.iterrows()]
    val_true = val_df[target_col].tolist()
    val_acc = sum(1 for yt, yp in zip(val_true, val_preds) if yt == yp) / len(val_true)

    # Evaluate on unseen TEST split
    test_results = [model.predict_proba(row.to_dict()) for _, row in test_df.iterrows()]
    test_preds = [res[0] for res in test_results]
    test_confs = [res[1] for res in test_results]
    test_true = test_df[target_col].tolist()

    # Compute macro precision, recall, f1 on TEST
    class_metrics = {}
    for c in model.classes:
        tp = sum(1 for yt, yp in zip(test_true, test_preds) if yt == c and yp == c)
        fp = sum(1 for yt, yp in zip(test_true, test_preds) if yt != c and yp == c)
        fn = sum(1 for yt, yp in zip(test_true, test_preds) if yt == c and yp != c)
        prec = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        rec = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        f1 = 2 * prec * rec / (prec + rec) if (prec + rec) > 0 else 0.0
        class_metrics[c] = (prec, rec, f1)

    test_acc = sum(1 for yt, yp in zip(test_true, test_preds) if yt == yp) / len(test_true)
    prec_macro = float(np.mean([m[0] for m in class_metrics.values()]))
    rec_macro = float(np.mean([m[1] for m in class_metrics.values()]))
    f1_macro = float(np.mean([m[2] for m in class_metrics.values()]))

    print(f"\n--- EVALUATION RESULTS ON UNSEEN TEST SPLIT (N={len(test_df)}) ---")
    print(f"Accuracy:        {test_acc * 100:.2f}% ({sum(1 for yt, yp in zip(test_true, test_preds) if yt == yp)}/{len(test_true)})")
    print(f"Precision Macro: {prec_macro:.4f}")
    print(f"Recall Macro:    {rec_macro:.4f}")
    print(f"F1-Score Macro:  {f1_macro:.4f}")
    print(f"Average Confidence: {np.mean(test_confs) * 100:.2f}%")

    # Compare against fault_prediction_results.csv
    pred_csv_path = os.path.join(data_dir, "fault_prediction_results.csv")
    if os.path.exists(pred_csv_path):
        m4_df = pd.read_csv(pred_csv_path)
        agreement = (m4_df["predicted_fault_category"] == test_preds).mean()
        print(f"Agreement with Member 4 prediction results: {agreement * 100:.2f}%")

    # Save trained model artifact
    model_json_path = os.path.join(artifacts_dir, "fault_classifier.json")
    with open(model_json_path, "w", encoding="utf-8") as f:
        json.dump(model.to_dict(), f, indent=2)
    print(f"\n[OK] Saved trained model weights and architecture to: {model_json_path}")

    # Save evaluation summary
    metadata = {
        "model_name": "SmartAVFaultClassifier (Naive Bayes & Softmax Hybrid)",
        "train_samples": len(train_df),
        "val_samples": len(val_df),
        "test_samples": len(test_df),
        "evaluation_metrics": {
            "validation_accuracy": float(val_acc),
            "test_accuracy": float(test_acc),
            "test_precision_macro": float(prec_macro),
            "test_recall_macro": float(rec_macro),
            "test_f1_macro": float(f1_macro)
        }
    }
    meta_json_path = os.path.join(artifacts_dir, "model_metadata.json")
    with open(meta_json_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f"[OK] Saved model evaluation metadata to: {meta_json_path}")


if __name__ == "__main__":
    main()
