
import React, { createContext, useContext } from 'react';
import { AuthContextType, SignUpData, UserProfile } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { authService } from '@/services/authService';
import { profileService } from '@/services/profileService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, profile, loading, setLoading, refreshProfile } = useAuthState();

  const signUp = async (data: SignUpData) => {
    return await authService.signUp(data);
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      return await authService.signIn(email, password);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await authService.signOut();
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return { error: 'No authenticated user' };

    const result = await profileService.updateProfile(user.id, profileData);
    
    if (!result.error) {
      await refreshProfile();
    }

    return result;
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      isAuthenticated: !!user,
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
