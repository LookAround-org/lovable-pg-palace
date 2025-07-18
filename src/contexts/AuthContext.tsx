
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        console.log('User metadata:', session?.user?.user_metadata);
        console.log('App metadata:', session?.user?.app_metadata);
        setSession(session);
        setUser(session?.user ? transformSupabaseUser(session.user) : null);
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      console.log('Initial user metadata:', session?.user?.user_metadata);
      console.log('Initial app metadata:', session?.user?.app_metadata);
      setSession(session);
      setUser(session?.user ? transformSupabaseUser(session.user) : null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const transformSupabaseUser = (supabaseUser: SupabaseUser): User => {
    // Use user_metadata which contains the signup data
    const metadata = supabaseUser.user_metadata || {};
    
    console.log('Transforming user with metadata:', metadata);
    
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: metadata.full_name || metadata.name || supabaseUser.email?.split('@')[0] || 'User',
      phone: metadata.phone || metadata.phone_number || undefined,
      avatar: metadata.avatar_url,
    };
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw new Error(error.message);
      }

      console.log('Login successful:', data.user?.email);
      console.log('Login user metadata:', data.user?.user_metadata);
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, phone?: string) => {
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      // Create the metadata object with all user information
      const userMetadata = {
        full_name: name,
        name: name,
        ...(phone && { 
          phone: phone, 
          phone_number: phone 
        })
      };

      console.log('Signing up with metadata:', userMetadata);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userMetadata,
        },
      });
      
      if (error) {
        throw new Error(error.message);
      }

      console.log('Signup successful:', data.user?.email);
      console.log('Signup user metadata:', data.user?.user_metadata);
      
      // If phone number was provided, also try to update the auth user's phone field
      if (phone && data.user) {
        console.log('Attempting to update phone field...');
        try {
          const { error: updateError } = await supabase.auth.updateUser({
            phone: phone
          });
          
          if (updateError) {
            console.log('Phone update error (this is expected if SMS auth is not enabled):', updateError);
          } else {
            console.log('Phone field updated successfully');
          }
        } catch (updateErr) {
          console.log('Phone update failed (this is expected if SMS auth is not enabled):', updateErr);
        }
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log('Logging out user');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
