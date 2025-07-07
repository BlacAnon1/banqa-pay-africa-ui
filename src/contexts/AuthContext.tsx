
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
    console.log('Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile when authenticated
          setTimeout(async () => {
            const profileData = await profileService.fetchProfile(session.user.id);
            setProfile(profileData);
            
            // Register device for security monitoring
            const { SecurityService } = await import('@/services/securityService');
            await SecurityService.registerDevice(session.user.id);
            
            // Log security event
            await SecurityService.logSecurityEvent(
              session.user.id,
              'user_login',
              { login_method: 'email' }
            );
          }, 0);
        } else {
          setProfile(null);
          // Clear sensitive data on logout
          const { SecurityService } = await import('@/services/securityService');
          SecurityService.clearSensitiveData();
        }
        
        setLoading(false);
      }
    );

    // Check for initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profileData = await profileService.fetchProfile(session.user.id);
        setProfile(profileData);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (data: SignUpData) => {
    setLoading(true);
    try {
      // Enhanced validation
      const { SecurityService } = await import('@/services/securityService');
      
      if (!SecurityService.validateEmail(data.email)) {
        return { error: { message: 'Please enter a valid email address' } };
      }
      
      const passwordValidation = SecurityService.validatePassword(data.password);
      if (!passwordValidation.isValid) {
        return { error: { message: passwordValidation.errors.join('. ') } };
      }
      
      if (!SecurityService.checkRateLimit('signup')) {
        return { error: { message: 'Too many signup attempts. Please try again later.' } };
      }
      
      // Sanitize inputs
      const sanitizedData = {
        ...data,
        email: SecurityService.sanitizeInput(data.email),
        fullName: SecurityService.sanitizeInput(data.fullName),
        phoneNumber: data.phoneNumber ? SecurityService.sanitizeInput(data.phoneNumber) : undefined,
        countryOfResidence: SecurityService.sanitizeInput(data.countryOfResidence),
      };
      
      const result = await authService.signUp(sanitizedData);
      
      // Record signup attempt
      await SecurityService.recordLoginAttempt(
        sanitizedData.email,
        !result.error,
        result.error?.message
      );
      
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { SecurityService } = await import('@/services/securityService');
      
      // Check rate limiting
      const rateLimitOk = await SecurityService.checkLoginRateLimit(email);
      if (!rateLimitOk) {
        await SecurityService.recordLoginAttempt(email, false, 'Rate limit exceeded');
        return { error: { message: 'Too many login attempts. Please try again later.' } };
      }
      
      // Sanitize inputs
      const sanitizedEmail = SecurityService.sanitizeInput(email);
      
      const result = await authService.signIn(sanitizedEmail, password);
      
      // Record login attempt
      await SecurityService.recordLoginAttempt(
        sanitizedEmail,
        !result.error,
        result.error?.message
      );
      
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    const { SecurityService } = await import('@/services/securityService');
    
    // Log security event
    if (user) {
      await SecurityService.logSecurityEvent(
        user.id,
        'user_logout',
        { logout_method: 'manual' }
      );
    }
    
    SecurityService.clearSensitiveData();
    
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
      
      // Log security event
      const { SecurityService } = await import('@/services/securityService');
      await SecurityService.logSecurityEvent(
        user.id,
        'profile_update',
        { updated_fields: Object.keys(profileData) }
      );
    }
    
    return result;
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await profileService.fetchProfile(user.id);
      setProfile(profileData);
    }
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
