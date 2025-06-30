
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  country?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // For now, create a mock profile based on user data
        setProfile({
          id: session.user.id,
          full_name: session.user.user_metadata?.full_name || 'User',
          email: session.user.email || '',
          phone: session.user.user_metadata?.phone,
          country: 'Nigeria'
        });
      }
      
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setProfile({
            id: session.user.id,
            full_name: session.user.user_metadata?.full_name || 'User',
            email: session.user.email || '',
            phone: session.user.user_metadata?.phone,
            country: 'Nigeria'
          });
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // For development, let's bypass authentication temporarily
  const mockUser = {
    id: 'demo-user',
    email: 'demo@banqa.com',
    user_metadata: { full_name: 'Demo User' }
  } as User;

  const mockProfile = {
    id: 'demo-user',
    full_name: 'Demo User',
    email: 'demo@banqa.com',
    country: 'Nigeria'
  };

  return (
    <AuthContext.Provider value={{
      user: user || mockUser,
      profile: profile || mockProfile,
      isAuthenticated: true, // Always authenticated for demo
      loading,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
