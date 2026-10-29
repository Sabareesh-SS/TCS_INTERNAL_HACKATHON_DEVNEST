import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.schemas.common import DiagnosticStatus, StepResult, ActionId

client = TestClient(app)


def test_concurrent_independent_incidents():
    """
    Verifies that two faculty members in different classrooms can troubleshoot
    simultaneously without session state corruption or cross-talk.
    """
    # Room 1: Projector issue in AB-105
    inc1_step1 = {
        "incident_id": "INC-CONC-001",
        "device_id": "DEV004",
        "device_type": "Projector",
        "classroom_id": "CLS002",
        "room_no": "AB-105",
        "symptom": "Projector is on but displays No Signal",
        "step_number": 1
    }

    # Room 2: Microphone issue in CB-301
    inc2_step1 = {
        "incident_id": "INC-CONC-002",
        "device_id": "DEV008",
        "device_type": "Microphone",
        "classroom_id": "CLS003",
        "room_no": "CB-301",
        "symptom": "Microphone is on but no sound is heard",
        "step_number": 1
    }

    # Submit Step 1 for both incidents
    res1 = client.post("/api/diagnostics/next-step", json=inc1_step1)
    res2 = client.post("/api/diagnostics/next-step", json=inc2_step1)

    assert res1.status_code == 200
    assert res2.status_code == 200
    assert res1.json()["incident_id"] == "INC-CONC-001"
    assert res2.json()["incident_id"] == "INC-CONC-002"
    assert res1.json()["next_action_id"] == ActionId.VERIFY_INPUT.value
    assert res2.json()["next_action_id"] == ActionId.CHECK_MUTE_AUDIO.value

    # Advance Incident 1 to Step 2 (Result: FAILED)
    inc1_step2 = {
        **inc1_step1,
        "previous_action_id": ActionId.VERIFY_INPUT.value,
        "previous_step_result": StepResult.FAILED.value,
        "step_number": 2
    }
    res1_step2 = client.post("/api/diagnostics/next-step", json=inc1_step2)
    assert res1_step2.status_code == 200
    assert res1_step2.json()["step_number"] == 2

    # Resolve Incident 2 immediately (Result: SUCCESS)
    inc2_resolve = {
        **inc2_step1,
        "previous_action_id": ActionId.CHECK_MUTE_AUDIO.value,
        "previous_step_result": StepResult.SUCCESS.value,
        "step_number": 1
    }
    res2_resolve = client.post("/api/diagnostics/next-step", json=inc2_resolve)
    assert res2_resolve.status_code == 200
    assert res2_resolve.json()["status"] == DiagnosticStatus.RESOLVED.value

    # Verify sessions remain completely isolated
    sess1 = client.get("/api/diagnostics/session/INC-CONC-001").json()
    sess2 = client.get("/api/diagnostics/session/INC-CONC-002").json()

    assert sess1["status"] == DiagnosticStatus.IN_PROGRESS.value
    assert sess1["classroom_id"] == "CLS002"
    assert sess1["room_no"] == "AB-105"
    assert len(sess1["step_history"]) == 1

    assert sess2["status"] == DiagnosticStatus.RESOLVED.value
    assert sess2["classroom_id"] == "CLS003"
    assert sess2["room_no"] == "CB-301"

    # Verify technician dashboard incidents endpoint lists both
    all_incidents = client.get("/api/diagnostics/incidents").json()
    incident_ids = [inc["incident_id"] for inc in all_incidents]
    assert "INC-CONC-001" in incident_ids
    assert "INC-CONC-002" in incident_ids

