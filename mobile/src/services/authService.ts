import { UserProfile, UserRole } from '../types/auth';
import { supabase, isLiveBackendAvailable } from './supabaseClient';
import { MOCK_FACULTY_USER, MOCK_TECHNICIAN_USER } from './mockData';

class AuthService {
  private currentUser: UserProfile | null = MOCK_FACULTY_USER; // Default to faculty on init for prototype
  private listeners: ((user: UserProfile | null) => void)[] = [];

  public subscribe(listener: (user: UserProfile | null) => void) {
    this.listeners.push(listener);
    listener(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.currentUser));
  }

  /**
   * Authenticate user with email and password.
   * If live Supabase is connected, queries Supabase auth and profiles table.
   * Otherwise falls back to mock user database.
   */
  public async login(email: string, _pass: string): Promise<UserProfile> {
    const cleanEmail = email.trim().toLowerCase();

    if (isLiveBackendAvailable && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: _pass,
      });

      if (error || !data.user) {
        throw new Error(error?.message || 'Authentication failed');
      }

      // Query profiles table for dynamic role determination
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        throw new Error('User profile record not found in system.');
      }

      const userProfile: UserProfile = {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        role: profile.role as UserRole,
        phone: profile.phone,
        department: profile.department,
        staffId: profile.staff_id,
        createdAt: profile.created_at,
      };

      this.currentUser = userProfile;
      this.notify();
      return userProfile;
    }

    // Prototype / Mock Mode
    if (cleanEmail.includes('tech') || cleanEmail.includes('alex')) {
      this.currentUser = { ...MOCK_TECHNICIAN_USER, email: cleanEmail };
    } else {
      this.currentUser = { ...MOCK_FACULTY_USER, email: cleanEmail || MOCK_FACULTY_USER.email };
    }

    this.notify();
    return this.currentUser;
  }

  public async logout(): Promise<void> {
    if (isLiveBackendAvailable && supabase) {
      await supabase.auth.signOut();
    }
    this.currentUser = null;
    this.notify();
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  /**
   * Quick role-switching helper for testing and evaluation
   */
  public switchRole(role: UserRole): UserProfile {
    if (role === 'technician') {
      this.currentUser = { ...MOCK_TECHNICIAN_USER };
    } else {
      this.currentUser = { ...MOCK_FACULTY_USER };
    }
    this.notify();
    return this.currentUser;
  }
}

export const authService = new AuthService();
