export type DeviceType =
  | 'projector'
  | 'microphone'
  | 'smartboard'
  | 'ptz-camera'
  | 'crestron'
  | 'amplifier'
  | 'switcher';

export type DeviceHealth = 'healthy' | 'degraded' | 'faulty' | 'maintenance';

export interface DeviceManual {
  title: string;
  docUrl: string;
  revision: string;
  relevantPage?: number;
}

export interface Device {
  id: string; // e.g. "AV-P204-01"
  name: string;
  model: string;
  type: DeviceType;
  classroomId: string; // e.g. "AB-204"
  classroomName: string;
  health: DeviceHealth;
  serialNumber: string;
  ipAddress?: string;
  firmwareVersion?: string;
  installDate: string;
  lastInspected: string;
  manual: DeviceManual;
  qrIdentifier: string; // opaque token for QR resolution
}
