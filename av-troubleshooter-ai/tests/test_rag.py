import pytest
from app.rag.retriever import KnowledgeRetriever
from app.schemas.common import ActionId, FaultCategory


def test_retrieval_projector_no_display():
    retriever = KnowledgeRetriever()
    results = retriever.retrieve(
        symptom="Projector is on but displays No Signal",
        device_type="Projector",
        model="DEMO-P02",
        step_number=1,
        top_k=3
    )

    assert len(results) > 0
    top = results[0]
    assert top["device_type"] == "Projector"
    assert top["action_id"] in [ActionId.VERIFY_INPUT.value, ActionId.CHECK_DISPLAY_MODE.value]
    assert top["issue_category"] == FaultCategory.INPUT_SOURCE_MISMATCH.value
    assert "manual_reference" in top
    assert top["verified"] is True
    assert "Epson" in top["benchmark_reference"]
    assert top["relevance_score"] > 0


def test_retrieval_microphone_no_sound():
    retriever = KnowledgeRetriever()
    results = retriever.retrieve(
        symptom="Microphone is on but no sound is heard",
        device_type="Microphone",
        model="DEMO-M02",
        step_number=1,
        top_k=2
    )

    assert len(results) > 0
    top = results[0]
    assert top["device_type"] == "Microphone"
    assert top["action_id"] == ActionId.CHECK_MUTE_AUDIO.value
    assert "manual_reference" in top
    assert "Shure" in top["benchmark_reference"]


def test_retrieval_smartboard_touch_unresponsive():
    retriever = KnowledgeRetriever()
    results = retriever.retrieve(
        symptom="Smart board display works but touch does not respond",
        device_type="Smart Board",
        model="DEMO-S02",
        step_number=1,
        top_k=2
    )

    assert len(results) > 0
    top = results[0]
    assert top["device_type"] == "Smart Board"
    assert top["action_id"] == ActionId.VERIFY_TOUCH_USB.value
    assert "TOUCH" in top["issue_category"]
    assert "Promethean" in top["benchmark_reference"]


def test_negative_retrieval_unknown_device_type():
    """Negative Test: Confirms retriever returns empty list for unsupported device types."""
    retriever = KnowledgeRetriever()
    results = retriever.retrieve(
        symptom="Coffee maker is leaking water",
        device_type="CoffeeMaker",
        model="BREW-01",
        step_number=1,
        top_k=3
    )
    # Must NOT hallucinate an AV manual
    assert results == []


def test_negative_retrieval_ungrounded_symptom():
    """Negative Test: Confirms retriever returns empty list for totally ungrounded symptom."""
    retriever = KnowledgeRetriever()
    results = retriever.retrieve(
        symptom="quantum flux capacitor oscillation frequency decay",
        device_type="Projector",
        model="DEMO-P01",
        step_number=1,
        top_k=3
    )
    assert results == []
