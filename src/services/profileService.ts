
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';

export const profileService = {
  async fetchProfile(userId: string): Promise<UserProfile | null> {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      console.log('Profile fetched:', data);
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  async updateProfile(userId: string, profileData: Partial<UserProfile>) {
    try {
      const updateData: Record<string, any> = {};
      
      Object.entries(profileData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          updateData[key] = value;
        }
      });
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      return { error };
    } catch (error) {
      return { error };
    }
  }
};
