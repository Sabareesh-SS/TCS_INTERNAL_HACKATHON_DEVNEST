import { DeviceType } from './device';

export type IncidentStatus =
  | 'unassigned'
  | 'in_progress'
  | 'awaiting_verification'
  | 'resolved'
  | 'unable_to_resolve';

export type IncidentPriority = 'critical' | 'high' | 'medium' | 'low';

export interface DiagnosticEvidence {
  deviceModel: string;
  inputSource: string;
  reportedCableState: string;
  edidHandshake: string;
  hdcpStatus: string;
  powerLedState: string;
}

export interface ManualReference {
  manualTitle: string;
  section: string;
  pageNumber: number;
  snippet: string;
  docUrl?: string;
}

export interface AIDiagnosticSummary {
  confidenceScore: number; // 0 - 100
  probableCauseHypothesis: string;
  isHypothesisVerified: boolean;
  manualReference: ManualReference;
  recommendedNextAction: string;
  lastStepAttempted: string;
  attemptResult: string;
  evidence: DiagnosticEvidence;
}

export interface RepairRecord {
  acceptedAt?: string;
  startedAt?: string;
  resolvedAt?: string;
  rootCause?: string;
  repairNotes?: string;
  partsRequired?: string[];
  technicianRemarks?: string;
  resolvedByTechnician?: string;
}

export interface Incident {
  id: string; // e.g. "INC-001"
  status: IncidentStatus;
  priority: IncidentPriority;
  classroomId: string;
  classroomName: string;
  deviceId: string;
  deviceName: string;
  deviceType: DeviceType;
  deviceModel: string;
  reportedBy: string;
  reportedAt: string;
  updatedAt: string;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  reportedSymptom: string;
  aiDiagnostic: AIDiagnosticSummary;
  repairRecord?: RepairRecord;
}
