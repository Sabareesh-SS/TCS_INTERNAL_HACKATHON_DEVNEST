export type UserRole = 'faculty' | 'technician' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  department?: string;
  staffId?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthSession {
  user: UserProfile;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: UserProfile | null;
  role: UserRole | null;
  error: string | null;
}
