import os
import re
import pandas as pd
from typing import List, Dict, Any, Optional
from pathlib import Path


# Explicit, documented mapping between campus demo device identifiers and reference OEM benchmark equipment
DEMO_TO_OEM_BENCHMARK = {
    "DEMO-P": {
        "device_type": "Projector",
        "oem_manufacturer": "Epson",
        "oem_model": "EB-E01",
        "benchmark_label": "Epson EB-E01 / EB-X06 3LCD Projector (Campus Benchmark Reference)"
    },
    "DEMO-M": {
        "device_type": "Microphone",
        "oem_manufacturer": "Shure",
        "oem_model": "BLX24/PG58",
        "benchmark_label": "Shure BLX24 / PG58 Wireless System (Campus Benchmark Reference)"
    },
    "DEMO-S": {
        "device_type": "Smart Board",
        "oem_manufacturer": "Promethean",
        "oem_model": "ActivPanel 9",
        "benchmark_label": "Promethean ActivPanel 9 Interactive Display (Campus Benchmark Reference)"
    }
}


class KnowledgeRetriever:
    """
    RAG Retrieval Service for AV Device Troubleshooting.
    Retrieves evidence-grounded manual sections and diagnostic actions based on:
    - device_type (Projector, Microphone, Smart Board)
    - model (e.g. DEMO-P01..DEMO-P06, EB-E01, DEMO-M01..DEMO-M06, BLX24/PG58, DEMO-S01..DEMO-S06, ActivPanel 9)
    - symptom keywords & telemetry (power_status, cable_status, input_source)
    - current step number or previous action
    
    Integrity Rules:
    - Never hallucinates OEM documentation for fictional demo equipment; explicitly bridges to benchmark OEM models.
    - Returns an empty list [] when no verified manual exists for the device type or symptom (Negative Retrieval Guarantee).
    """

    def __init__(self, kb_path: Optional[str] = None):
        if kb_path is None:
            base_dir = Path(__file__).resolve().parent.parent.parent
            kb_path = os.path.join(base_dir, "data", "troubleshooting_knowledge_base.csv")
        
        self.kb_path = kb_path
        self.df: pd.DataFrame = pd.DataFrame()
        self.load_knowledge_base()

    def load_knowledge_base(self):
        """Load and index troubleshooting knowledge base records."""
        if not os.path.exists(self.kb_path):
            raise FileNotFoundError(f"Knowledge base file not found at: {self.kb_path}")
        
        self.df = pd.read_csv(self.kb_path)
        self.df = self.df.fillna("")
        self.df.columns = self.df.columns.str.strip()

    def _tokenize(self, text: str) -> set:
        """Tokenize text into lowercase alphanumeric keywords."""
        return set(re.findall(r'\b[a-z0-9_]+\b', text.lower()))

    def resolve_benchmark_model(self, model_query: Optional[str], device_type: Optional[str] = None) -> Optional[Dict[str, str]]:
        """Maps a demo asset tag or generic model query to the authoritative OEM benchmark."""
        if not model_query:
            if device_type:
                dt = device_type.lower()
                if "projector" in dt:
                    return DEMO_TO_OEM_BENCHMARK["DEMO-P"]
                elif "mic" in dt:
                    return DEMO_TO_OEM_BENCHMARK["DEMO-M"]
                elif "board" in dt or "display" in dt:
                    return DEMO_TO_OEM_BENCHMARK["DEMO-S"]
            return None

        mq = model_query.upper()
        for prefix, oem_info in DEMO_TO_OEM_BENCHMARK.items():
            if mq.startswith(prefix):
                return oem_info

        # Check if query is already an OEM model
        if "EB-E01" in mq or "EPSON" in mq:
            return DEMO_TO_OEM_BENCHMARK["DEMO-P"]
        if "BLX" in mq or "SHURE" in mq:
            return DEMO_TO_OEM_BENCHMARK["DEMO-M"]
        if "ACTIVPANEL" in mq or "PROMETHEAN" in mq:
            return DEMO_TO_OEM_BENCHMARK["DEMO-S"]

        return None

    def retrieve(
        self,
        symptom: str,
        device_type: Optional[str] = None,
        model: Optional[str] = None,
        step_number: Optional[int] = 1,
        previous_action_id: Optional[str] = None,
        top_k: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Retrieve top-k relevant troubleshooting passages with full source metadata.
        Returns [] if no relevant manual evidence exists.
        """
        if self.df.empty:
            return []

        benchmark = self.resolve_benchmark_model(model, device_type)
        candidates = self.df.copy()

        # 1. Filter by device_type if provided
        target_device_type = benchmark["device_type"] if benchmark else device_type
        if target_device_type:
            device_match = candidates["device_type"].str.lower() == target_device_type.lower()
            if not device_match.any():
                # Negative retrieval: No manuals exist for this device type
                return []
            candidates = candidates[device_match]

        # 2. Score model match
        def score_model(row_model: str) -> float:
            if not benchmark:
                return 0.0
            if row_model.lower() == benchmark["oem_model"].lower():
                return 5.0
            return 0.0

        candidates["model_score"] = candidates["model"].apply(score_model)

        # 3. Match step_number / sequence
        target_step = step_number or 1
        candidates["seq_score"] = (candidates["step_number"] == target_step).astype(int) * 3.0

        # 4. Keyword & Symptom Similarity Scoring (BM25-style overlap)
        query_tokens = self._tokenize(symptom)
        if not query_tokens:
            return []

        def score_row(row):
            searchable_text = f"{row['symptom_keywords']} {row['probable_cause']} {row['issue_category']} {row['instruction']} {row['action_id']}"
            row_tokens = self._tokenize(searchable_text)
            overlap = query_tokens.intersection(row_tokens)
            if not overlap:
                return 0.0  # Zero overlap
            score = len(overlap) * 2.5
            score += row["model_score"] + row["seq_score"]
            return score

        candidates["relevance_score"] = candidates.apply(score_row, axis=1)

        # Filter out candidates with zero lexical relevance to the symptom
        valid_candidates = candidates[candidates["relevance_score"] > 0]
        if valid_candidates.empty:
            # Negative retrieval: symptom has zero grounding in manual
            return []

        ranked = valid_candidates.sort_values(by=["relevance_score", "step_number"], ascending=[False, True]).head(top_k)

        results = []
        for _, row in ranked.iterrows():
            benchmark_note = benchmark["benchmark_label"] if benchmark else f"{row['manufacturer']} {row['model']}"
            results.append({
                "knowledge_id": row["knowledge_id"],
                "device_type": row["device_type"],
                "manufacturer": row["manufacturer"],
                "model": row["model"],
                "benchmark_reference": benchmark_note,
                "issue_category": row["issue_category"],
                "probable_cause": row["probable_cause"],
                "step_number": int(row["step_number"]),
                "action_id": row["action_id"],
                "instruction": row["instruction"],
                "expected_result": row["expected_result"],
                "failure_next_step": row["failure_next_step"],
                "escalation_condition": row["escalation_condition"],
                "manual_reference": {
                    "title": row["manual_title"],
                    "section": row["manual_section_page"],
                    "source_url": row["manual_url"]
                },
                "verified": str(row["verified"]).upper() == "TRUE",
                "relevance_score": float(row["relevance_score"])
            })

        return results
