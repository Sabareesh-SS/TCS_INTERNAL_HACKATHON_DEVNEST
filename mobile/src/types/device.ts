export type DeviceType = 'projector' | 'microphone' | 'smart_board' | 'audio_mixer';

export type DeviceStatus = 'operational' | 'faulty' | 'offline' | 'under_maintenance';

export interface Device {
  id: string;
  classroomId: string;
  classroomName?: string;
  deviceType: DeviceType;
  manufacturer: string;
  modelNumber: string;
  assetTag: string;
  serialNumber: string;
  status: DeviceStatus;
  installDate?: string;
  manualUrl?: string;
  quickGuideRef?: string;
  ipAddress?: string;
  macAddress?: string;
  firmwareVersion?: string;
  notes?: string;
}
