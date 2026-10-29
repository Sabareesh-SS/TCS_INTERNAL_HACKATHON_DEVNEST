import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.schemas.common import DiagnosticStatus, StepResult, ActionId, FaultCategory

client = TestClient(app)


def test_scenario_1_projector_guided_resolution():
    """
    Scenario 1: End-to-end QR scan, symptom submission, multi-step failure and resolution.
    Classroom: AB-105 (CLS002)
    Device: Projector (DEV004, DEMO-P02)
    Symptom: Projector is on but displays No Signal
    """
    # 1. Faculty scans classroom QR
    qr_res = client.get("/api/inventory/scan/QR-CLS-AB105")
    assert qr_res.status_code == 200
    qr_data = qr_res.json()
    assert qr_data["classroom"]["room_no"] == "AB-105"
    projector = next(d for d in qr_data["devices"] if d["device_type"] == "Projector")
    assert projector["device_id"] == "DEV004"

    # 2. Initial Symptom Submission (Step 1)
    incident_id = "INC-E2E-PRJ-01"
    step1_payload = {
        "incident_id": incident_id,
        "device_id": projector["device_id"],
        "device_type": projector["device_type"],
        "model": projector["model"],
        "classroom_id": qr_data["classroom"]["classroom_id"],
        "room_no": qr_data["classroom"]["room_no"],
        "symptom": "Projector is on but displays No Signal",
        "power_status": "ON",
        "input_source": "HDMI1",
        "cable_status": "CONNECTED",
        "step_number": 1
    }
    step1_res = client.post("/api/diagnostics/next-step", json=step1_payload)
    assert step1_res.status_code == 200
    s1_data = step1_res.json()
    assert s1_data["status"] == DiagnosticStatus.IN_PROGRESS.value
    assert s1_data["fault_category"] == FaultCategory.INPUT_SOURCE_MISMATCH.value
    assert s1_data["next_action_id"] == ActionId.VERIFY_INPUT.value
    assert "Epson" in s1_data["manual_reference"]["title"]

    # 3. Faculty tries action, it FAILS -> Advance to Step 2
    step2_payload = {
        **step1_payload,
        "previous_action_id": ActionId.VERIFY_INPUT.value,
        "previous_step_result": StepResult.FAILED.value,
        "step_number": 2
    }
    step2_res = client.post("/api/diagnostics/next-step", json=step2_payload)
    assert step2_res.status_code == 200
    s2_data = step2_res.json()
    assert s2_data["status"] == DiagnosticStatus.IN_PROGRESS.value
    assert s2_data["step_number"] == 2
    assert s2_data["next_action_id"] in [ActionId.CHECK_DISPLAY_MODE.value, ActionId.RESEAT_EXTERNAL_CABLE.value]

    # 4. Faculty adjusts display settings, display appears! -> SUCCESS
    step3_payload = {
        **step1_payload,
        "previous_action_id": s2_data["next_action_id"],
        "previous_step_result": StepResult.SUCCESS.value,
        "step_number": 2
    }
    step3_res = client.post("/api/diagnostics/next-step", json=step3_payload)
    assert step3_res.status_code == 200
    s3_data = step3_res.json()
    assert s3_data["status"] == DiagnosticStatus.RESOLVED.value
    assert s3_data["next_action_id"] == ActionId.SESSION_RESOLVED.value
    assert s3_data["escalation_recommended"] is False

    # 5. Verify live session audit trail
    sess_res = client.get(f"/api/diagnostics/session/{incident_id}")
    assert sess_res.status_code == 200
    sess_data = sess_res.json()
    assert sess_data["status"] == DiagnosticStatus.RESOLVED.value
    assert len(sess_data["step_history"]) >= 2
    assert sess_data["resolved_at"] is not None


def test_scenario_2_microphone_exhaustion_escalation():
    """
    Scenario 2: Device QR scan, repeated step failures exceeding threshold -> Escalation.
    Classroom: CB-301 (CLS003)
    Device: Microphone (DEV008, DEMO-M03)
    Symptom: Wireless microphone audio cuts out intermittently
    """
    # 1. Faculty scans device QR on microphone
    qr_res = client.get("/api/inventory/scan/QR-DEV-AV-CB301-M01")
    assert qr_res.status_code == 200
    dev_info = qr_res.json()["device"]
    cls_info = qr_res.json()["classroom"]
    assert dev_info["device_id"] == "DEV008"
    assert dev_info["device_type"] == "Microphone"

    # 2. Step 1: Initial symptom report
    incident_id = "INC-E2E-MIC-ESCALATE"
    base_payload = {
        "incident_id": incident_id,
        "device_id": dev_info["device_id"],
        "device_type": dev_info["device_type"],
        "model": dev_info["model"],
        "classroom_id": cls_info["classroom_id"],
        "room_no": cls_info["room_no"],
        "symptom": "Wireless microphone audio cuts out intermittently",
        "power_status": "ON",
        "step_number": 1
    }
    res1 = client.post("/api/diagnostics/next-step", json=base_payload)
    assert res1.status_code == 200
    assert res1.json()["fault_category"] == FaultCategory.WIRELESS_SIGNAL.value
    assert res1.json()["next_action_id"] == ActionId.CHECK_RECEIVER_STATUS.value

    # 3. Step 2: Receiver check failed
    res2 = client.post("/api/diagnostics/next-step", json={
        **base_payload,
        "previous_action_id": ActionId.CHECK_RECEIVER_STATUS.value,
        "previous_step_result": StepResult.FAILED.value,
        "step_number": 2
    })
    assert res2.status_code == 200

    # 4. Step 3: Pairing verify failed
    res3 = client.post("/api/diagnostics/next-step", json={
        **base_payload,
        "previous_action_id": ActionId.VERIFY_PAIRING.value,
        "previous_step_result": StepResult.FAILED.value,
        "step_number": 3
    })
    assert res3.status_code == 200

    # 5. Step 4: Step limit reached -> ESCALATION
    res4 = client.post("/api/diagnostics/next-step", json={
        **base_payload,
        "previous_action_id": ActionId.CHECK_MUTE_AUDIO.value,
        "previous_step_result": StepResult.FAILED.value,
        "step_number": 4
    })
    assert res4.status_code == 200
    esc_data = res4.json()
    assert esc_data["status"] == DiagnosticStatus.ESCALATED.value
    assert esc_data["next_action_id"] == ActionId.DISPATCH_TECHNICIAN.value
    assert esc_data["escalation_recommended"] is True

    # 6. Verify synthesized technician summary
    tech_summary = esc_data["technician_summary"]
    assert tech_summary is not None
    assert tech_summary["incident_id"] == incident_id
    assert tech_summary["room_no"] == "CB-301"
    assert len(tech_summary["attempted_steps"]) >= 3
    assert "Shure" in tech_summary["recommended_parts_or_tools"]
    assert len(tech_summary["manual_references"]) > 0

    # 7. Verify Mithun's dashboard sees this escalation in live incident list
    all_incidents = client.get("/api/diagnostics/incidents").json()
    escalated_ticket = next(inc for inc in all_incidents if inc["incident_id"] == incident_id)
    assert escalated_ticket["status"] == DiagnosticStatus.ESCALATED.value
    assert escalated_ticket["technician_summary"] is not None


def test_scenario_3_smartboard_touch_connection():
    """
    Scenario 3: Smart board touch connection fault diagnosis.
    Device: Smart Board (DEV006, DEMO-S02)
    Symptom: Smart board display works but touch does not respond
    """
    qr_res = client.get("/api/inventory/scan/QR-DEV-AV-AB105-S01")
    assert qr_res.status_code == 200
    dev_info = qr_res.json()["device"]

    payload = {
        "incident_id": "INC-E2E-SBD-01",
        "device_id": dev_info["device_id"],
        "device_type": dev_info["device_type"],
        "model": dev_info["model"],
        "symptom": "Smart board display works but touch does not respond",
        "power_status": "ON",
        "step_number": 1
    }
    res = client.post("/api/diagnostics/next-step", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["fault_category"] == FaultCategory.TOUCH_CONNECTION.value
    assert data["next_action_id"] == ActionId.VERIFY_TOUCH_USB.value
    assert "Promethean" in data["manual_reference"]["title"]

    # Resolution
    res_success = client.post("/api/diagnostics/next-step", json={
        **payload,
        "previous_action_id": ActionId.VERIFY_TOUCH_USB.value,
        "previous_step_result": StepResult.SUCCESS.value,
        "step_number": 1
    })
    assert res_success.status_code == 200
    assert res_success.json()["status"] == DiagnosticStatus.RESOLVED.value

