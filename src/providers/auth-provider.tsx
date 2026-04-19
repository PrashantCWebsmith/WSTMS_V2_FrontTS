import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AuthUserModel, LoginModel, AuthResponseModel } from '@/features/auth/types/auth.types';
import { login as authLogin, logout as authLogout } from '../features/auth/services/auth-api.service';

interface AuthContextType {
  user: AuthUserModel | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginModel) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateUser: (newData: Partial<AuthUserModel>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUserModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser) as AuthUserModel;
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('sessionId');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginModel) => {
    try {
      // Use explicit variable name and forced casting to clear IDE errors
      const loginResponse: any = await authLogin(credentials);
      const authData = loginResponse as AuthResponseModel;

      if (authData && authData.token) {
        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', JSON.stringify(authData));
        
        if (authData.sessionId) {
          localStorage.setItem('sessionId', authData.sessionId);
        }

        setUser(authData);
        return { success: true };
      }
      
      return { success: false, message: 'Invalid response from server' };
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      return { success: false, message };
    }
  };

  const logout = useCallback(async () => {
    try {
      await authLogout();
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('sessionId');
      setUser(null);
    }
  }, []);

  const updateUser = (newData: Partial<AuthUserModel>) => {
    if (user) {
      const updatedUser = { ...user, ...newData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
