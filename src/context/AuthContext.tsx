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
    // Return default values instead of throwing during initial render
    return {
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: async () => {},
      register: async () => {},
      googleAuth: async () => {},
      logout: async () => {},
      refreshProfile: async () => {}
    } as AuthContextType;
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
      // Transform Supabase user to include metadata at root level
      const transformedUser = {
        ...supabaseUser,
        first_name: supabaseUser?.user_metadata?.first_name || '',
        last_name: supabaseUser?.user_metadata?.last_name || '',
        full_name: `${supabaseUser?.user_metadata?.first_name || ''} ${supabaseUser?.user_metadata?.last_name || ''}`.trim()
      };
      setUser(transformedUser as any);
      return transformedUser;
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
        const transformedUser = {
          ...session.user,
          first_name: session.user?.user_metadata?.first_name || '',
          last_name: session.user?.user_metadata?.last_name || '',
          full_name: `${session.user?.user_metadata?.first_name || ''} ${session.user?.user_metadata?.last_name || ''}`.trim()
        };
        setUser(transformedUser as any);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await supabaseAuth.signIn(email, password);
      const transformedUser = {
        ...result.user,
        first_name: result.user?.user_metadata?.first_name || '',
        last_name: result.user?.user_metadata?.last_name || '',
        full_name: `${result.user?.user_metadata?.first_name || ''} ${result.user?.user_metadata?.last_name || ''}`.trim()
      };
      setUser(transformedUser as any);
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
        const transformedUser = {
          ...result.user,
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`.trim()
        };
        setUser(transformedUser as any);
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