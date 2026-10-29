import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_scan_classroom_qr():
    # Scan classroom QR for AB-105
    response = client.get("/api/inventory/scan/QR-CLS-AB105")
    assert response.status_code == 200
    data = response.json()
    assert data["entry_type"] == "CLASSROOM_QR"
    assert data["classroom"]["room_no"] == "AB-105"
    assert data["classroom"]["building"] == "Academic Block A"
    assert len(data["devices"]) == 3
    # Check that projector, microphone, and smartboard exist
    device_types = [d["device_type"] for d in data["devices"]]
    assert "Projector" in device_types
    assert "Microphone" in device_types
    assert "Smart Board" in device_types


def test_scan_device_qr():
    # Scan device QR for Projector in AB-204
    response = client.get("/api/inventory/scan/QR-DEV-AV-AB204-P01")
    assert response.status_code == 200
    data = response.json()
    assert data["entry_type"] == "DEVICE_QR"
    assert data["device"]["device_id"] == "DEV001"
    assert data["device"]["device_type"] == "Projector"
    assert data["device"]["model"] == "DEMO-P01"
    assert data["classroom"]["room_no"] == "AB-204"


def test_scan_invalid_qr():
    response = client.get("/api/inventory/scan/NON_EXISTENT_QR")
    assert response.status_code == 404

