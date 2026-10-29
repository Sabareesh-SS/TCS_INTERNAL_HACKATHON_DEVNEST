export type RoomStatus = 'operational' | 'incident_reported' | 'offline';

export interface Classroom {
  id: string; // e.g. "AB-204"
  name: string;
  building: string;
  floor: number;
  capacity: number;
  status: RoomStatus;
  activeIncidentId?: string;
  totalDevices: number;
  qrIdentifier: string; // URL token for doorway scan
  lastTriageAt?: string;
  notes?: string;
}
