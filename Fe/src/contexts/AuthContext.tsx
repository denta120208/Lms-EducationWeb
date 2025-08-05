import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, tokenManager, userManager } from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  subject?: string; // Optional for teacher
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isTeacher: boolean;
  login: (email: string, password: string) => Promise<void>;
  teacherLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTeacher, setIsTeacher] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        if (tokenManager.isAuthenticated()) {
          const userData = userManager.getUser();
          if (userData) {
            setUser(userData);
            setIsTeacher(tokenManager.isTeacher());
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Clear invalid tokens
        authAPI.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authAPI.login({ email, password });
      setUser(response.student);
      setIsTeacher(false);
    } catch (error: any) {
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const teacherLogin = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authAPI.teacherLogin({ email, password });
      setUser(response.teacher);
      setIsTeacher(true);
    } catch (error: any) {
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setIsTeacher(false);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && tokenManager.isAuthenticated(),
    isTeacher,
    isLoading,
    login,
    teacherLogin,
    logout,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};