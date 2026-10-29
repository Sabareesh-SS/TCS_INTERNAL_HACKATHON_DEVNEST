import { useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types/auth';
import { authService } from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = authService.subscribe(currentUser => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const loggedInUser = await authService.login(email, pass);
      return loggedInUser;
    } catch (err: any) {
      setError(err?.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = (role: UserRole) => {
    return authService.switchRole(role);
  };

  return {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    switchRole,
  };
}
