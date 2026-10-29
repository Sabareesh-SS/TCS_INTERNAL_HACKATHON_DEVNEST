import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.schemas.common import DiagnosticStatus, StepResult, ActionId, FaultCategory

client = TestClient(app)


def test_initial_diagnostic_step():
    payload = {
        "incident_id": "INC-TEST-001",
        "device_id": "DEV004",
        "device_type": "Projector",
        "manufacturer": "DemoBrand",
        "model": "DEMO-P02",
        "symptom": "Projector is on but displays No Signal",
        "power_status": "ON",
        "input_source": "HDMI1",
        "cable_status": "CONNECTED",
        "previous_action_id": None,
        "previous_step_result": None,
        "step_number": 1
    }
    response = client.post("/api/diagnostics/next-step", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["incident_id"] == "INC-TEST-001"
    assert data["status"] == DiagnosticStatus.IN_PROGRESS.value
    assert data["next_action_id"] == ActionId.VERIFY_INPUT.value
    assert data["fault_category"] == FaultCategory.INPUT_SOURCE_MISMATCH.value
    assert data["step_number"] == 1
    assert "manual_reference" in data
    assert data["escalation_recommended"] is False


def test_second_diagnostic_step():
    payload = {
        "incident_id": "INC-TEST-001",
        "device_id": "DEV004",
        "device_type": "Projector",
        "model": "DEMO-P02",
        "symptom": "Projector is on but displays No Signal",
        "power_status": "ON",
        "input_source": "HDMI1",
        "cable_status": "CONNECTED",
        "previous_action_id": ActionId.VERIFY_INPUT.value,
        "previous_step_result": StepResult.FAILED.value,
        "step_number": 2
    }
    response = client.post("/api/diagnostics/next-step", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == DiagnosticStatus.IN_PROGRESS.value
    assert data["step_number"] == 2
    assert data["next_action_id"] in [ActionId.CHECK_DISPLAY_MODE.value, ActionId.RESEAT_EXTERNAL_CABLE.value]


def test_resolution_step():
    payload = {
        "incident_id": "INC-TEST-001",
        "device_id": "DEV004",
        "device_type": "Projector",
        "model": "DEMO-P02",
        "symptom": "Projector is on but displays No Signal",
        "previous_action_id": ActionId.CHECK_DISPLAY_MODE.value,
        "previous_step_result": StepResult.SUCCESS.value,
        "step_number": 2
    }
    response = client.post("/api/diagnostics/next-step", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == DiagnosticStatus.RESOLVED.value
    assert data["next_action_id"] == ActionId.SESSION_RESOLVED.value
    assert data["escalation_recommended"] is False


def test_escalation_step():
    payload = {
        "incident_id": "INC-TEST-ESCALATE",
        "device_id": "DEV004",
        "device_type": "Projector",
        "model": "DEMO-P02",
        "classroom_id": "CLS002",
        "room_no": "AB-105",
        "symptom": "Projector is on but displays No Signal",
        "previous_action_id": ActionId.RESEAT_EXTERNAL_CABLE.value,
        "previous_step_result": StepResult.FAILED.value,
        "step_number": 4
    }
    response = client.post("/api/diagnostics/next-step", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == DiagnosticStatus.ESCALATED.value
    assert data["next_action_id"] == ActionId.DISPATCH_TECHNICIAN.value
    assert data["escalation_recommended"] is True
    assert data["technician_summary"] is not None
    assert "manual_references" in data["technician_summary"]


def test_session_history_endpoint():
    response = client.get("/api/diagnostics/session/INC-TEST-001")
    assert response.status_code == 200
    data = response.json()
    assert data["incident_id"] == "INC-TEST-001"
    assert data["device_id"] == "DEV004"
    assert "step_history" in data
    assert len(data["step_history"]) > 0
