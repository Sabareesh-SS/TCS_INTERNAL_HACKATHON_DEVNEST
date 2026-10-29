export type UserRole = 'admin';

export type TechnicianStatus = 'available' | 'on_duty' | 'busy' | 'offline';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  status?: TechnicianStatus;
  specialty?: string;
  phone?: string;
  activeAssignmentsCount?: number;
  totalResolvedCount?: number;
}
