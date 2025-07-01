
import { User, Session } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

export type UserStatus = Database['public']['Enums']['user_status'];
export type VerificationLevel = Database['public']['Enums']['verification_level'];

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
  country_of_residence: string;
  state_province?: string;
  city?: string;
  address_line_1?: string;
  address_line_2?: string;
  postal_code?: string;
  occupation?: string;
  employer?: string;
  monthly_income?: number;
  source_of_funds?: string;
  user_status?: UserStatus;
  verification_level?: VerificationLevel;
  profile_completed?: boolean;
  terms_accepted?: boolean;
  privacy_policy_accepted?: boolean;
  marketing_consent?: boolean;
  two_factor_enabled?: boolean;
  avatar_url?: string;
  user_role?: string;
  banqa_id?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  signUp: (data: SignUpData) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
}

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  countryOfResidence: string;
  dateOfBirth?: string;
  termsAccepted: boolean;
  privacyPolicyAccepted: boolean;
  marketingConsent?: boolean;
}
