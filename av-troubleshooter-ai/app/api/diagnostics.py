from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any, List, Optional
from app.schemas.diagnostic import DiagnosticRequest, DiagnosticResponse, TechnicianSummary
from app.core.state_machine import DiagnosticController
from app.ml.ml_adapter import MLModelAdapter
from app.db.supabase_client import SupabaseClient

router = APIRouter(prefix="/api/diagnostics", tags=["Diagnostics Engine"])

controller = DiagnosticController()
ml_adapter = MLModelAdapter()
supabase = SupabaseClient()


@router.post("/next-step", response_model=DiagnosticResponse)
@router.post("/step-result", response_model=DiagnosticResponse)
async def get_next_diagnostic_step(request: DiagnosticRequest) -> DiagnosticResponse:
    """
    RAG-grounded Diagnostic Engine endpoint.
    Processes current telemetry and step result, coordinates with LLM & OEM manual RAG,
    maintains multi-step incident history, and triggers escalation with technician summary.
    """
    try:
        # 1. Obtain prior fault category prediction from genuine ML model
        ml_predicted_fault = await ml_adapter.predict_fault_category({
            "room_no": request.room_no,
            "device_id": request.device_id,
            "device_type": request.device_type,
            "symptom": request.symptom,
            "power_status": request.power_status,
            "input_source": request.input_source,
            "cable_status": request.cable_status
        })

        # 2. Process step through state machine controller
        response = controller.process_step(request, ml_predicted_fault=ml_predicted_fault)

        # 3. Log step and escalation asynchronously
        await supabase.log_step(request.incident_id, {
            "incident_id": request.incident_id,
            "classroom_id": request.classroom_id,
            "room_no": request.room_no,
            "step_number": response.step_number,
            "action_id": response.next_action_id,
            "status": response.status.value,
            "escalation_recommended": response.escalation_recommended
        })

        if response.escalation_recommended and response.technician_summary:
            await supabase.record_escalation(response.technician_summary.model_dump())

        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Diagnostic reasoning error: {str(e)}"
        )


@router.get("/session/{incident_id}")
async def get_incident_session_history(incident_id: str):
    """
    Returns live diagnostic session telemetry and history for Mithun's Web Dashboard.
    """
    if incident_id not in controller._sessions:
        raise HTTPException(status_code=404, detail="Incident session not found")
    
    session = controller._sessions[incident_id]
    return {
        "incident_id": session.incident_id,
        "classroom_id": session.classroom_id,
        "room_no": session.room_no,
        "device_id": session.device_id,
        "symptom": session.symptom,
        "status": session.status.value,
        "step_history": session.step_history,
        "technician_summary": session.technician_summary,
        "created_at": session.created_at,
        "resolved_at": session.resolved_at,
        "escalated_at": session.escalated_at
    }


@router.get("/incidents")
async def list_all_active_incidents():
    """
    Returns all active and escalated incidents with technician summaries for Mithun's Web Dashboard.
    """
    return controller.list_all_sessions()
