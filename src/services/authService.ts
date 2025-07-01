
import { supabase } from '@/integrations/supabase/client';
import { SignUpData, UserProfile } from '@/types/auth';

export const authService = {
  async signUp(data: SignUpData) {
    try {
      console.log('Starting signup process with data:', {
        email: data.email,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        countryOfResidence: data.countryOfResidence
      });
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: data.fullName,
            phone_number: data.phoneNumber,
            country_of_residence: data.countryOfResidence,
            date_of_birth: data.dateOfBirth,
            terms_accepted: data.termsAccepted,
            privacy_policy_accepted: data.privacyPolicyAccepted,
            marketing_consent: data.marketingConsent || false
          }
        }
      });

      if (error) {
        console.error('Signup error from Supabase:', error);
        return { error };
      }

      console.log('Signup successful:', authData);
      return { error: null };
    } catch (error) {
      console.error('Signup exception:', error);
      return { error };
    }
  },

  async signIn(email: string, password: string) {
    try {
      console.log('Signing in with email:', email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
      } else {
        console.log('Login successful');
      }

      return { error };
    } catch (error) {
      console.error('Login exception:', error);
      return { error };
    }
  },

  async signOut() {
    try {
      console.log('Signing out');
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }
};
