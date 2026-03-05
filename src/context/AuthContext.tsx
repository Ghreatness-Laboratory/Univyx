import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/api';
import { supabase } from '../lib/supabase';
import supabaseAuth from '../services/supabase-auth';

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

  const isAuthenticated = !!user;

  const refreshProfile = async () => {
    try {
      const supabaseUser = await supabaseAuth.getUser();
      setUser(supabaseUser as any);
      return supabaseUser;
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      setUser(null);
      throw error;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const session = await supabaseAuth.getSession();
        if (session) {
          await refreshProfile();
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      }
      setIsLoading(false);
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user as any);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await supabaseAuth.signIn(email, password);
      setUser(result.user as any);
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      const result = await supabaseAuth.signUp(email, password, {
        first_name: firstName,
        last_name: lastName
      });
      
      if (result.user) {
        setUser(result.user as any);
      }
      
      return result;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const googleAuth = async (token: string) => {
    try {
      const result = await supabaseAuth.signInWithGoogle();
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('Google auth error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabaseAuth.signOut();
      setUser(null);
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