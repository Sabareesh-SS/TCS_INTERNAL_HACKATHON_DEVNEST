import pytest
from app.ml.ml_adapter import MLModelAdapter
from app.schemas.common import FaultCategory


def test_ml_adapter_loads_trained_artifact():
    adapter = MLModelAdapter()
    assert adapter.model is not None, "MLModelAdapter should load the trained SmartAVFaultClassifier artifact"
    assert len(adapter.model.classes) == 12, "Model must cover all 12 standardized fault categories"
    assert len(adapter.model.vocab) > 0, "Model must have learned vocabulary from TRAIN split"


@pytest.mark.anyio
async def test_ml_predict_input_source_mismatch():
    adapter = MLModelAdapter()
    category = await adapter.predict_fault_category({
        "device_type": "Projector",
        "symptom": "Projector is on but displays No Signal",
        "power_status": "ON",
        "cable_status": "CONNECTED",
        "input_source": "HDMI1"
    })
    assert category == FaultCategory.INPUT_SOURCE_MISMATCH.value


@pytest.mark.anyio
async def test_ml_predict_overheating():
    adapter = MLModelAdapter()
    category = await adapter.predict_fault_category({
        "device_type": "Projector",
        "symptom": "Projector shows an overheating warning",
        "power_status": "ON",
        "cable_status": "CONNECTED",
        "input_source": "HDMI2"
    })
    assert category == FaultCategory.OVERHEATING.value


@pytest.mark.anyio
async def test_ml_predict_audio_mute():
    adapter = MLModelAdapter()
    category = await adapter.predict_fault_category({
        "device_type": "Microphone",
        "symptom": "Microphone is on but no sound is heard",
        "power_status": "ON",
        "cable_status": "UNKNOWN",
        "input_source": "N/A"
    })
    assert category == FaultCategory.AUDIO_CONFIGURATION.value


@pytest.mark.anyio
async def test_ml_predict_touch_connection():
    adapter = MLModelAdapter()
    category = await adapter.predict_fault_category({
        "device_type": "Smart Board",
        "symptom": "Smart board display works but touch does not respond",
        "power_status": "ON",
        "cable_status": "CONNECTED",
        "input_source": "HDMI1"
    })
    assert category == FaultCategory.TOUCH_CONNECTION.value
