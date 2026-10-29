import { Incident } from './incident';

export type TicketStatus =
  | 'unassigned'
  | 'assigned'
  | 'in_progress'
  | 'awaiting_parts'
  | 'resolved'
  | 'unable_to_resolve';

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export interface RepairChecklistItem {
  id: string;
  label: string;
  isCompleted: boolean;
  notes?: string;
}

export interface Ticket {
  id: string;
  incidentId: string;
  incident: Incident;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  priority: TicketPriority;
  status: TicketStatus;
  checklist: RepairChecklistItem[];
  rootCause?: string;
  workPerformed?: string;
  partsRequired?: string;
  technicianNotes?: string;
  photoUris?: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}
