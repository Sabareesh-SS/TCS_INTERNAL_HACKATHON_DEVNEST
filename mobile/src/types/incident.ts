import { DeviceType } from './device';
import { DiagnosticStep } from './diagnostic';

export type IncidentStatus =
  | 'reported'
  | 'in_troubleshooting'
  | 'resolved_by_faculty'
  | 'escalated_to_technician'
  | 'closed';

export interface Incident {
  id: string;
  classroomId: string;
  classroomName: string;
  deviceId: string;
  deviceName: string;
  deviceType: DeviceType;
  reportedBy: string;
  reportedByName: string;
  symptomCategory: string;
  symptomDescription: string;
  initialCheckPower: boolean;
  initialCheckCable: boolean;
  status: IncidentStatus;
  diagnosticSteps: DiagnosticStep[];
  ticketId?: string;
  createdAt: string;
  resolvedAt?: string;
}
