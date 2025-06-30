
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, AuthContextType, SignUpData } from '@/types/auth';
import { authService } from '@/services/authService';
import { profileService } from '@/services/profileService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch real profile data
        const profileData = await profileService.fetchProfile(session.user.id);
        setProfile(profileData);
      }
      
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(async () => {
            const profileData = await profileService.fetchProfile(session.user.id);
            setProfile(profileData);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (data: SignUpData) => {
    setLoading(true);
    try {
      const result = await authService.signUp(data);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await authService.signIn(email, password);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return { error: new Error('No user logged in') };
    
    const result = await profileService.updateProfile(user.id, profileData);
    
    if (!result.error) {
      // Refresh profile data after update
      const updatedProfile = await profileService.fetchProfile(user.id);
      setProfile(updatedProfile);
    }
    
    return result;
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await profileService.fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  // For development, let's bypass authentication temporarily
  const mockUser = {
    id: 'demo-user',
    email: 'demo@banqa.com',
    app_metadata: {},
    user_metadata: { full_name: 'Demo User' },
    aud: 'authenticated',
    created_at: new Date().toISOString()
  } as User;

  const mockProfile: UserProfile = {
    id: 'demo-user',
    email: 'demo@banqa.com',
    full_name: 'Demo User',
    country_of_residence: 'Nigeria',
    profile_completed: false,
    terms_accepted: true,
    privacy_policy_accepted: true
  };

  return (
    <AuthContext.Provider value={{
      user: user || mockUser,
      session: session,
      profile: profile || mockProfile,
      isAuthenticated: true, // Always authenticated for demo
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile,
      refreshProfile
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
