import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from app.schemas.diagnostic import (
    DiagnosticRequest,
    DiagnosticResponse,
    ManualReference,
    TechnicianSummary
)
from app.schemas.common import DiagnosticStatus, StepResult, ActionId, FaultCategory
from app.rag.retriever import KnowledgeRetriever
from app.llm.client import LLMDiagnosticService

logger = logging.getLogger(__name__)


class DiagnosticSession:
    """Represents an active multi-step troubleshooting session for an incident."""
    def __init__(self, incident_id: str, device_id: str, symptom: str, classroom_id: Optional[str] = None, room_no: Optional[str] = None):
        self.incident_id = incident_id
        self.device_id = device_id
        self.symptom = symptom
        self.classroom_id = classroom_id
        self.room_no = room_no
        self.status = DiagnosticStatus.IN_PROGRESS
        self.step_history: List[Dict[str, Any]] = []
        self.technician_summary: Optional[Dict[str, Any]] = None
        self.created_at = datetime.now(timezone.utc).isoformat()
        self.resolved_at: Optional[str] = None
        self.escalated_at: Optional[str] = None

    def add_step(self, step_number: int, action_id: str, result: str):
        self.step_history.append({
            "step_number": step_number,
            "action_id": action_id,
            "result": result,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })


class DiagnosticController:
    """
    State machine controller for guided AV troubleshooting.
    Coordinates between:
    - Faculty user step feedback
    - RAG Knowledge Base retrieval with OEM benchmark grounding
    - LLM structured reasoning
    - Escalation rules and technician evidence synthesis
    """

    def __init__(
        self,
        retriever: Optional[KnowledgeRetriever] = None,
        llm_service: Optional[LLMDiagnosticService] = None
    ):
        self.retriever = retriever or KnowledgeRetriever()
        self.llm_service = llm_service or LLMDiagnosticService()
        self._sessions: Dict[str, DiagnosticSession] = {}

    def get_or_create_session(self, request: DiagnosticRequest) -> DiagnosticSession:
        if request.incident_id not in self._sessions:
            self._sessions[request.incident_id] = DiagnosticSession(
                incident_id=request.incident_id,
                device_id=request.device_id,
                symptom=request.symptom,
                classroom_id=request.classroom_id,
                room_no=request.room_no
            )
        session = self._sessions[request.incident_id]
        if request.classroom_id and not session.classroom_id:
            session.classroom_id = request.classroom_id
        if request.room_no and not session.room_no:
            session.room_no = request.room_no
        return session

    def list_all_sessions(self) -> List[Dict[str, Any]]:
        """Returns all recorded incident sessions for technician dashboard telemetry."""
        result = []
        for session in self._sessions.values():
            result.append({
                "incident_id": session.incident_id,
                "classroom_id": session.classroom_id,
                "room_no": session.room_no,
                "device_id": session.device_id,
                "symptom": session.symptom,
                "status": session.status.value,
                "step_count": len(session.step_history),
                "step_history": session.step_history,
                "technician_summary": session.technician_summary,
                "created_at": session.created_at,
                "resolved_at": session.resolved_at,
                "escalated_at": session.escalated_at
            })
        return result

    def process_step(
        self,
        request: DiagnosticRequest,
        ml_predicted_fault: Optional[str] = None
    ) -> DiagnosticResponse:
        session = self.get_or_create_session(request)

        # Record previous action result if provided
        if request.previous_action_id and request.previous_step_result:
            session.add_step(
                step_number=(request.step_number or 1) - 1,
                action_id=request.previous_action_id,
                result=request.previous_step_result
            )

        # 1. Check for Resolution (User reported SUCCESS)
        if request.previous_step_result == StepResult.SUCCESS.value:
            session.status = DiagnosticStatus.RESOLVED
            session.resolved_at = datetime.now(timezone.utc).isoformat()
            resolved_category = ml_predicted_fault or FaultCategory.INPUT_SOURCE_MISMATCH.value
            return DiagnosticResponse(
                incident_id=request.incident_id,
                status=DiagnosticStatus.RESOLVED,
                fault_category=resolved_category,
                probable_cause="Issue resolved successfully by user action.",
                next_action_id=ActionId.SESSION_RESOLVED.value,
                step_number=request.step_number or 1,
                instruction="Troubleshooting complete. The AV equipment is operational and ready for classroom use.",
                expected_result="Display and audio are functioning normally.",
                manual_reference=ManualReference(
                    title=f"Verified OEM Procedure ({request.device_type})",
                    section="Troubleshooting Complete - Operational",
                    page=None,
                    source_url="https://files.support.epson.com/docid/cpd5/cpd59263.pdf"
                ),
                escalation_recommended=False,
                technician_summary=None
            )

        # 2. Check for Escalation Condition
        current_step = request.step_number or 1
        failed_count = sum(1 for s in session.step_history if s["result"] in [StepResult.FAILED.value, StepResult.CANNOT_PERFORM.value])
        
        is_critical_hardware = (
            request.power_status == "FLASHING_WARNING" or
            "overheat" in request.symptom.lower() or
            "burned" in request.symptom.lower() or
            "lamp warning" in request.symptom.lower()
        ) and current_step >= 2

        if current_step >= 4 or failed_count >= 3 or is_critical_hardware:
            session.status = DiagnosticStatus.ESCALATED
            session.escalated_at = datetime.now(timezone.utc).isoformat()

            # Retrieve OEM benchmark reference for cited parts
            benchmark = self.retriever.resolve_benchmark_model(request.model, request.device_type)
            oem_label = benchmark["benchmark_label"] if benchmark else f"{request.manufacturer} {request.model}"

            tech_summary = TechnicianSummary(
                incident_id=request.incident_id,
                classroom_id=session.classroom_id or "CR-ROOM",
                room_no=session.room_no or "Classroom",
                device_id=request.device_id,
                device_type=request.device_type or "Projector",
                model=request.model or "DEMO-P01",
                symptom=request.symptom,
                attempted_steps=session.step_history,
                escalation_reason=f"Exceeded maximum automated diagnostic steps ({failed_count} failures). Physical hardware inspection or component replacement required.",
                recommended_parts_or_tools=f"Reference OEM Kit: {oem_label}. Suggested tools: Signal tester, replacement patch cables, digital multimeter.",
                manual_references=[
                    ManualReference(
                        title=f"{oem_label} Maintenance Guide",
                        section="Service Escalation and Part Replacement",
                        page=98,
                        source_url="https://files.support.epson.com/docid/cpd5/cpd59263.pdf"
                    )
                ]
            )

            session.technician_summary = tech_summary.model_dump()

            escalated_category = ml_predicted_fault or (
                FaultCategory.OVERHEATING.value if "overheat" in request.symptom.lower()
                else FaultCategory.CABLE_CONNECTION.value
            )

            return DiagnosticResponse(
                incident_id=request.incident_id,
                status=DiagnosticStatus.ESCALATED,
                fault_category=escalated_category,
                probable_cause="Standard user troubleshooting steps failed. Physical hardware intervention required by campus IT.",
                next_action_id=ActionId.DISPATCH_TECHNICIAN.value,
                step_number=current_step,
                instruction="Guided troubleshooting is exhausted. An on-duty AV technician has been dispatched with hardware diagnostic tools.",
                expected_result="Campus AV technician arrives with replacement equipment.",
                manual_reference=ManualReference(
                    title=f"{oem_label} Manual",
                    section="Escalation & Technical Support",
                    page=91,
                    source_url="https://files.support.epson.com/docid/cpd5/cpd59263.pdf"
                ),
                escalation_recommended=True,
                technician_summary=tech_summary
            )

        # 3. Retrieve relevant RAG evidence
        retrieved_passages = self.retriever.retrieve(
            symptom=request.symptom,
            device_type=request.device_type,
            model=request.model,
            step_number=current_step,
            previous_action_id=request.previous_action_id,
            top_k=3
        )

        # 4. Generate next step via LLM (with RAG grounding)
        response = self.llm_service.generate_diagnostic_step(
            request=request,
            retrieved_passages=retrieved_passages,
            ml_predicted_fault=ml_predicted_fault
        )

        return response
