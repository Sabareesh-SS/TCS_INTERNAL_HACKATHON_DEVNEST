import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from app.main import app
from app.schemas.common import DiagnosticStatus, ActionId

client = TestClient(app)


def test_llm_service_exception_recovery():
    """
    Simulates a runtime failure/timeout from external LLM API and confirms
    the Diagnostic Engine recovers gracefully with grounded RAG evidence.
    """
    with patch("app.llm.client.LLMDiagnosticService._call_gemini", side_effect=RuntimeError("Google GenAI API Timeout")):
        payload = {
            "incident_id": "INC-LLM-FAIL",
            "device_id": "DEV004",
            "device_type": "Projector",
            "model": "DEMO-P02",
            "symptom": "Projector is on but displays No Signal",
            "step_number": 1
        }
        response = client.post("/api/diagnostics/next-step", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["incident_id"] == "INC-LLM-FAIL"
        assert data["status"] == DiagnosticStatus.IN_PROGRESS.value
        assert data["next_action_id"] == ActionId.VERIFY_INPUT.value
        assert data["manual_reference"]["title"] is not None


def test_missing_manual_fallback():
    """
    Tests engine behavior when no manual passages are retrieved (unknown device).
    Confirms the engine generates a safe baseline check without hallucinating.
    """
    payload = {
        "incident_id": "INC-UNKNOWN-DEV",
        "device_id": "DEV-UNKNOWN",
        "device_type": "CustomWidget",
        "model": "WIDGET-999",
        "symptom": "strange unknown error code 999",
        "step_number": 1
    }
    response = client.post("/api/diagnostics/next-step", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["incident_id"] == "INC-UNKNOWN-DEV"
    assert data["next_action_id"] == ActionId.CHECK_POWER_STATUS.value

