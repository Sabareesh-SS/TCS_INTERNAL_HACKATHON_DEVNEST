from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from app.schemas.common import DiagnosticStatus, StepResult


class ManualReference(BaseModel):
    title: str = Field(..., description="Official OEM manual title")
    section: str = Field(..., description="Troubleshooting section or header")
    page: Optional[int] = Field(None, description="Page number in manual")
    source_url: Optional[str] = Field(None, description="Direct URL or reference link to official manual")


class StepLog(BaseModel):
    step_number: int
    action_id: str
    result: str
    timestamp: Optional[str] = None


class TechnicianSummary(BaseModel):
    incident_id: str
    classroom_id: Optional[str] = None
    room_no: Optional[str] = None
    device_id: str
    device_type: str
    model: str
    symptom: str
    attempted_steps: List[Dict[str, Any]] = Field(default_factory=list)
    escalation_reason: str
    recommended_parts_or_tools: Optional[str] = None
    manual_references: List[ManualReference] = Field(default_factory=list)


class DiagnosticRequest(BaseModel):
    incident_id: str = Field(..., examples=["INC001"], description="Unique incident identifier")
    device_id: str = Field(..., examples=["DEV001"], description="Asset or device inventory identifier")
    device_type: Optional[str] = Field(None, examples=["Projector"], description="Projector, Microphone, or Smart Board")
    manufacturer: Optional[str] = Field(None, examples=["Epson"])
    model: Optional[str] = Field(None, examples=["DEMO-P01"], description="Campus hardware model or asset model")
    classroom_id: Optional[str] = Field(None, examples=["CR101"])
    room_no: Optional[str] = Field(None, examples=["LH-302"])
    symptom: str = Field(..., examples=["Projector is on but no display"], description="Reported problem or symptom")
    power_status: Optional[str] = Field("ON", examples=["ON"], description="ON, OFF, STANDBY, FLASHING_WARNING, etc.")
    input_source: Optional[str] = Field("HDMI1", examples=["HDMI1"], description="Selected input port/source")
    cable_status: Optional[str] = Field("CONNECTED", examples=["CONNECTED"], description="CONNECTED, DISCONNECTED, LOOSE")
    previous_action_id: Optional[str] = Field(None, examples=[None], description="Last action taken by user")
    previous_step_result: Optional[str] = Field(None, examples=[None], description="Result of last action: SUCCESS, FAILED, CANNOT_PERFORM")
    step_number: Optional[int] = Field(1, examples=[1], description="Sequential diagnostic step count")


class DiagnosticResponse(BaseModel):
    incident_id: str
    status: DiagnosticStatus = DiagnosticStatus.IN_PROGRESS
    fault_category: str = Field(..., examples=["INPUT_SOURCE_MISMATCH"])
    probable_cause: str = Field(..., examples=["Possible incorrect input selection on projector"])
    next_action_id: str = Field(..., examples=["VERIFY_INPUT_SOURCE"])
    step_number: int = Field(1, examples=[1])
    instruction: str = Field(..., examples=["Check whether the selected input matches the connected source."])
    expected_result: str = Field(..., examples=["The laptop display appears on the projector."])
    manual_reference: ManualReference
    escalation_recommended: bool = False
    technician_summary: Optional[TechnicianSummary] = None


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "av-troubleshooter-ai"
    version: str = "1.0.0"
    timestamp: str
