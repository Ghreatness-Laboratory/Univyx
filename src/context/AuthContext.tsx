import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/api';
import apiService from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<any>;
  googleAuth: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!localStorage.getItem('access_token');

  const refreshProfile = async () => {
    try {
      const response = await apiService.getProfile();
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      // Clear tokens if profile fetch fails
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      throw error;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          await refreshProfile();
        } catch (error) {
          console.error('Auth initialization failed:', error);
          // Tokens are already cleared in refreshProfile
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login({ email, password });
      console.log('Login response:', response.data);
      
      // Handle the actual API response format
      if (response.data.access && response.data.refresh) {
        // Direct token format
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
      } else if (response.data.tokens?.access && response.data.tokens?.refresh) {
        // Nested tokens format
        localStorage.setItem('access_token', response.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.tokens.refresh);
      } else if (response.data.data?.tokens?.access && response.data.data?.tokens?.refresh) {
        // Double nested format
        localStorage.setItem('access_token', response.data.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.data.tokens.refresh);
      } else {
        console.error('Unexpected response format:', response.data);
        throw new Error('Invalid response format: missing tokens');
      }
      
      // Fetch user profile after successful login
      const userData = await refreshProfile();
      console.log('Login successful, user data:', userData);
    } catch (error: any) {
      console.error('Login error:', error);
      // Clear any partial state
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      throw error;
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      const response = await apiService.register({
        first_name: firstName,
        last_name: lastName,
        email,
        password
      });
      
      // Auto-login after successful registration
      await login(email, password);
      
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const googleAuth = async (token: string) => {
    try {
      const response = await apiService.googleAuth({ token });
      const { data } = response.data;
      
      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);
      
      setUser(data.user);
    } catch (error) {
      console.error('Google auth error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    googleAuth,
    logout,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};