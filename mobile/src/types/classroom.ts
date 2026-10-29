export type ClassroomStatus = 'active' | 'maintenance' | 'offline';

export interface Classroom {
  id: string;
  roomNumber: string;
  building: string;
  floor: string;
  capacity?: number;
  status: ClassroomStatus;
  qrCodePayload: string;
  deviceCount?: number;
}
