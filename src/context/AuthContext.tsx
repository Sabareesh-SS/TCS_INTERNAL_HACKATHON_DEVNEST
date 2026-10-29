import React, { createContext, useContext, useState } from 'react';
import { User } from '../types/user';
import { authService, ADMIN_USER } from '../services/authService';

interface AuthContextType {
  currentUser: User;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser] = useState<User>(() => authService.getCurrentUser());

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
