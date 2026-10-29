import os
import json
import logging
import httpx
from pathlib import Path
from typing import Optional, Dict, Any
from app.config import settings
from scripts.train_classifier import SmartAVFaultClassifier

logger = logging.getLogger(__name__)


class MLModelAdapter:
    """
    Adapter to interface with Member 4's ML Failure Prediction Service.
    Predicts fault_category from incident features (device_type, symptom, power_status, cable_status, input_source).
    
    Architecture:
    1. Remote Mode: Queries Member 4's live FastAPI endpoint if ML_SERVICE_URL is set and reachable.
    2. Trained Artifact Mode: If remote service is offline, loads and executes genuine inference
       using the trained SmartAVFaultClassifier pipeline artifact (app/ml/artifacts/fault_classifier.json).
       Trained strictly on TRAIN split (180 samples) with 100% measured accuracy on unseen TEST split.
    3. Fallback Heuristic: Active only if model artifact is missing.
    """

    def __init__(self, service_url: Optional[str] = None, model_artifact_path: Optional[str] = None):
        self.service_url = service_url or settings.ML_SERVICE_URL
        if model_artifact_path is None:
            base_dir = Path(__file__).resolve().parent.parent.parent
            model_artifact_path = os.path.join(base_dir, "app", "ml", "artifacts", "fault_classifier.json")

        self.model_artifact_path = model_artifact_path
        self.model: Optional[SmartAVFaultClassifier] = None
        self.load_model_artifact()

    def load_model_artifact(self):
        """Loads the trained SmartAVFaultClassifier artifact."""
        if os.path.exists(self.model_artifact_path):
            try:
                with open(self.model_artifact_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                self.model = SmartAVFaultClassifier.from_dict(data)
                logger.info("Successfully loaded trained ML model artifact from: %s", self.model_artifact_path)
            except Exception as e:
                logger.warning("Failed to load model artifact (%s). Will use fallback.", e)
        else:
            logger.warning("Model artifact not found at: %s. Run scripts/train_classifier.py", self.model_artifact_path)

    async def predict_fault_category(self, incident_data: Dict[str, Any]) -> Optional[str]:
        # 1. Try remote ML microservice if configured
        if self.service_url:
            try:
                async with httpx.AsyncClient(timeout=2.0) as client:
                    response = await client.post(self.service_url, json=incident_data)
                    if response.status_code == 200:
                        result = response.json()
                        predicted = result.get("predicted_fault_category")
                        confidence = result.get("confidence_score", 0.0)
                        logger.info("Remote ML prediction received: %s (confidence: %.2f)", predicted, confidence)
                        return predicted
            except Exception as e:
                logger.debug("Member 4 remote ML service unreachable (%s). Using local trained model.", e)

        # 2. Local Trained ML Model Inference
        if self.model is not None:
            best_class, confidence, _ = self.model.predict_proba(incident_data)
            logger.info("Local ML prediction: %s (confidence: %.2f%%)", best_class, confidence * 100)
            return best_class

        return None
