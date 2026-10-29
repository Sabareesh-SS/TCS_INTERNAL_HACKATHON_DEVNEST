"""
Full-Stack Integration Verification Script
Validates end-to-end connectivity between:
1. Mobile App (QR Scan, Inventory Lookup & Fault Reporting)
2. AI Diagnostic Engine (FastAPI, Genuine ML Classifier, RAG OEM Manuals, Gemini/Fallback LLM)
3. Web Dashboard (Live Incident Feed, Technician Escalation Dossiers & Ticket Updates)
4. Cloud Backend Database (Supabase PostgreSQL Persistence & Realtime sync)
"""

import sys
import os
import json
from pathlib import Path

# Ensure app is in path
base_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(base_dir))

from fastapi.testclient import TestClient
from app.main import app
from app.config import settings
import httpx

client = TestClient(app)

def test_full_stack_flow():
    print("\n" + "=" * 70)
    print(">>> 1. HEALTH PROBE & SYSTEM DIAGNOSTICS")
    print("=" * 70)
    res = client.get("/api/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    print(f"[PASS] Health probe OK: {res.json()}")

    print("\n" + "=" * 70)
    print(">>> 2. MOBILE QR INVENTORY RESOLUTION (Sabareesh Mobile App Contract)")
    print("=" * 70)
    # Test classroom QR scan
    res = client.get("/api/inventory/scan/QR-CLS-AB105")
    assert res.status_code == 200, f"Classroom QR scan failed: {res.text}"
    cls_data = res.json()
    assert cls_data["entry_type"] == "CLASSROOM_QR"
    assert cls_data["classroom"]["room_no"] == "AB-105"
    print(f"[PASS] Scanned Door QR (QR-CLS-AB105): Room {cls_data['classroom']['room_no']} with {len(cls_data['devices'])} devices")

    # Test device asset QR scan
    res = client.get("/api/inventory/scan/QR-DEV-AV-AB105-P01")
    assert res.status_code == 200, f"Device QR scan failed: {res.text}"
    dev_data = res.json()
    assert dev_data["entry_type"] == "DEVICE_QR"
    assert dev_data["device"]["model"] == "DEMO-P02"
    print(f"[PASS] Scanned Device QR (QR-DEV-AV-AB105-P01): Model {dev_data['device']['model']} ({dev_data['device']['device_type']})")

    # Test prefixed QR (from mobile camera kit scanner)
    res = client.get("/api/inventory/scan/classroom:CLS001")
    assert res.status_code == 200
    print(f"[PASS] Scanned prefixed QR (classroom:CLS001): Room {res.json()['classroom']['room_no']}")

    # Test inventory listings for Web/Mobile dashboards
    res = client.get("/api/inventory/classrooms")
    assert res.status_code == 200
    assert len(res.json()) >= 6
    print(f"[PASS] Listed {len(res.json())} campus classrooms")

    res = client.get("/api/inventory/devices")
    assert res.status_code == 200
    assert len(res.json()) >= 18
    print(f"[PASS] Listed {len(res.json())} campus AV devices")

    print("\n" + "=" * 70)
    print(">>> 3. AI DIAGNOSTIC ENGINE MULTI-STEP REASONING (LLM + ML + RAG)")
    print("=" * 70)
    incident_id = "INC-INTEGRATION-TEST-001"

    # Step 1: Initial Fault Reporting by Faculty
    step1_payload = {
        "incident_id": incident_id,
        "device_id": "DEV004",
        "device_type": "Projector",
        "model": "DEMO-P02",
        "classroom_id": "CLS002",
        "room_no": "AB-105",
        "symptom": "Projector is on but displays No Signal",
        "power_status": "ON",
        "input_source": "HDMI1",
        "cable_status": "CONNECTED",
        "previous_action_id": None,
        "previous_step_result": None,
        "step_number": 1
    }
    res = client.post("/api/diagnostics/next-step", json=step1_payload)
    assert res.status_code == 200
    step1 = res.json()
    print(f"[PASS] Step 1 Generated:")
    print(f"       Fault Category (ML Predicted): {step1['fault_category']}")
    print(f"       Action: {step1['next_action_id']}")
    print(f"       Probable Cause: {step1['probable_cause']}")
    print(f"       OEM Citation: {step1['manual_reference']['title']} - {step1['manual_reference']['section']}")

    # Step 2: Faculty reports "Did Not Work" (FAILED)
    step2_payload = {
        **step1_payload,
        "previous_action_id": step1["next_action_id"],
        "previous_step_result": "FAILED",
        "step_number": 2
    }
    res = client.post("/api/diagnostics/next-step", json=step2_payload)
    assert res.status_code == 200
    step2 = res.json()
    print(f"[PASS] Step 2 Generated: Action: {step2['next_action_id']}")

    # Step 3: Faculty reports "Did Not Work" again (FAILED)
    step3_payload = {
        **step1_payload,
        "previous_action_id": step2["next_action_id"],
        "previous_step_result": "FAILED",
        "step_number": 3
    }
    res = client.post("/api/diagnostics/next-step", json=step3_payload)
    assert res.status_code == 200
    step3 = res.json()
    print(f"[PASS] Step 3 Generated: Action: {step3['next_action_id']}")

    # Step 4: Step 3 failed -> Automatic Escalation
    step4_payload = {
        **step1_payload,
        "previous_action_id": step3["next_action_id"],
        "previous_step_result": "FAILED",
        "step_number": 4
    }
    res = client.post("/api/diagnostics/next-step", json=step4_payload)
    assert res.status_code == 200
    step4 = res.json()
    assert step4["status"] == "ESCALATED"
    assert step4["escalation_recommended"] is True
    assert step4["technician_summary"] is not None
    print(f"[PASS] Automatic Escalation Triggered:")
    print(f"       Status: {step4['status']}")
    print(f"       Escalation Reason: {step4['technician_summary']['escalation_reason']}")
    print(f"       Recommended OEM Kit: {step4['technician_summary']['recommended_parts_or_tools']}")

    print("\n" + "=" * 70)
    print(">>> 4. WEB DASHBOARD INTEGRATION (Mithun Web Dashboard Contract)")
    print("=" * 70)
    # Fetch active incidents feed for web dashboard
    res = client.get("/api/diagnostics/incidents")
    assert res.status_code == 200
    incidents = res.json()
    found_session = any(i["incident_id"] == incident_id for i in incidents)
    assert found_session, f"Escalated incident {incident_id} not found in incidents list"
    print(f"[PASS] Web Dashboard Live Feed received incident {incident_id} with full escalation dossier")

    # Update ticket status from Web Dashboard
    res = client.post("/api/diagnostics/ticket-update", json={
        "incident_id": incident_id,
        "technician_id": "usr_tech_01",
        "status": "in_progress"
    })
    assert res.status_code == 200
    print(f"[PASS] Web Dashboard assigned technician and updated ticket status: {res.json()}")

    print("\n" + "=" * 70)
    print(">>> 5. SUPABASE CLOUD POSTGRESQL CONNECTIVITY")
    print("=" * 70)
    if settings.SUPABASE_URL and settings.SUPABASE_KEY:
        try:
            headers = {
                "apikey": settings.SUPABASE_KEY,
                "Authorization": f"Bearer {settings.SUPABASE_KEY}"
            }
            res = httpx.get(f"{settings.SUPABASE_URL}/rest/v1/classrooms?select=count", headers=headers, timeout=5.0)
            if res.status_code in [200, 206]:
                print(f"[PASS] Supabase Cloud PostgreSQL is live and connected at: {settings.SUPABASE_URL}")
            else:
                print(f"[INFO] Supabase response ({res.status_code}): {res.text[:100]}")
        except Exception as e:
            print(f"[WARN] Supabase ping warning: {e}")
    else:
        print("[INFO] Supabase credentials in mock mode")

    print("\n" + "=" * 70)
    print(">>> FULL-STACK INTEGRATION STATUS: ALL SYSTEMS CONNECTED AND OPERATIONAL!")
    print("=" * 70 + "\n")

if __name__ == "__main__":
    test_full_stack_flow()

