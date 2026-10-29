import json
import logging
from typing import Optional, List, Dict, Any
from app.config import settings
from app.schemas.diagnostic import DiagnosticRequest, DiagnosticResponse, ManualReference, TechnicianSummary
from app.schemas.common import DiagnosticStatus, StepResult, ActionId, FaultCategory
from app.llm.prompts import DIAGNOSTIC_SYSTEM_PROMPT, build_diagnostic_prompt

logger = logging.getLogger(__name__)


class LLMDiagnosticService:
    """
    LLM Diagnostic Engine grounded in RAG Manual Passages.
    Uses Google GenAI SDK (gemini-2.0-flash) with structured JSON output,
    with automatic offline fallback to verified RAG evidence when API key is unavailable.
    """

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model = settings.LLM_MODEL or "gemini-2.0-flash"
        self._genai_client = None

        if self.api_key:
            try:
                from google import genai
                self._genai_client = genai.Client(api_key=self.api_key)
                logger.info("Initialized Google GenAI Client with model: %s", self.model)
            except Exception as e:
                logger.warning("Failed to initialize Google GenAI client: %s", e)

    def generate_diagnostic_step(
        self,
        request: DiagnosticRequest,
        retrieved_passages: List[Dict[str, Any]],
        ml_predicted_fault: Optional[str] = None
    ) -> DiagnosticResponse:
        """
        Generates evidence-grounded next diagnostic step.
        """
        # If API key is present and client initialized, call Gemini
        if self._genai_client and self.api_key:
            try:
                return self._call_gemini(request, retrieved_passages, ml_predicted_fault)
            except Exception as e:
                logger.error("Gemini API call failed (%s). Falling back to RAG rule engine.", e)

        # Fallback to deterministic RAG-grounded selection
        return self._fallback_rag_decision(request, retrieved_passages)

    def _call_gemini(
        self,
        request: DiagnosticRequest,
        retrieved_passages: List[Dict[str, Any]],
        ml_predicted_fault: Optional[str]
    ) -> DiagnosticResponse:
        from google.genai import types

        prompt = build_diagnostic_prompt(
            device_type=request.device_type or "Projector",
            manufacturer=request.manufacturer or "Epson",
            model=request.model or "EB-E01",
            symptom=request.symptom,
            power_status=request.power_status or "ON",
            input_source=request.input_source or "HDMI1",
            cable_status=request.cable_status or "CONNECTED",
            step_number=request.step_number or 1,
            previous_action_id=request.previous_action_id,
            previous_step_result=request.previous_step_result,
            retrieved_passages=retrieved_passages,
            ml_predicted_fault=ml_predicted_fault
        )

        response = self._genai_client.models.generate_content(
            model=self.model,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=DIAGNOSTIC_SYSTEM_PROMPT,
                response_mime_type="application/json",
                response_schema=DiagnosticResponse,
                temperature=0.1  # Low temperature for deterministic, factual adherence
            )
        )

        # Parse structured output
        raw_text = response.text
        data = json.loads(raw_text)
        data["incident_id"] = request.incident_id
        return DiagnosticResponse(**data)

    def _fallback_rag_decision(
        self,
        request: DiagnosticRequest,
        retrieved_passages: List[Dict[str, Any]]
    ) -> DiagnosticResponse:
        """
        Deterministic, zero-latency grounding directly from verified OEM knowledge base.
        """
        step = request.step_number or 1

        # Find best candidate matching current step or next available step
        matched_excerpt = None
        for p in retrieved_passages:
            if p["step_number"] == step:
                matched_excerpt = p
                break
        
        if not matched_excerpt and retrieved_passages:
            matched_excerpt = retrieved_passages[0]

        if matched_excerpt:
            return DiagnosticResponse(
                incident_id=request.incident_id,
                status=DiagnosticStatus.IN_PROGRESS,
                fault_category=matched_excerpt["issue_category"],
                probable_cause=matched_excerpt["probable_cause"],
                next_action_id=matched_excerpt["action_id"],
                step_number=step,
                instruction=matched_excerpt["instruction"],
                expected_result=matched_excerpt["expected_result"],
                manual_reference=ManualReference(
                    title=matched_excerpt["manual_reference"]["title"],
                    section=matched_excerpt["manual_reference"]["section"],
                    page=None,
                    source_url=matched_excerpt["manual_reference"]["source_url"]
                ),
                escalation_recommended=False,
                technician_summary=None
            )

        # Default fallback if no passages matched
        return DiagnosticResponse(
            incident_id=request.incident_id,
            status=DiagnosticStatus.IN_PROGRESS,
            fault_category=FaultCategory.UNKNOWN_FAULT.value,
            probable_cause="Unknown hardware or signal condition.",
            next_action_id=ActionId.CHECK_POWER_STATUS.value,
            step_number=step,
            instruction="Verify that device power LED is illuminated and power cable is firmly attached.",
            expected_result="Power status LED turns green or steady blue.",
            manual_reference=ManualReference(
                title=f"{request.manufacturer or 'AV'} Equipment Manual",
                section="General Troubleshooting",
                page=1,
                source_url=None
            ),
            escalation_recommended=False,
            technician_summary=None
        )

