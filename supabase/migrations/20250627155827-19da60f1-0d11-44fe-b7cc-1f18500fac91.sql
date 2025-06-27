
-- Create enum types for user status and verification levels
CREATE TYPE public.user_status AS ENUM ('pending', 'active', 'suspended', 'deactivated');
CREATE TYPE public.verification_level AS ENUM ('unverified', 'basic', 'enhanced', 'premium');
CREATE TYPE public.kyc_status AS ENUM ('not_started', 'in_progress', 'under_review', 'approved', 'rejected', 'expired');
CREATE TYPE public.document_type AS ENUM ('national_id', 'passport', 'drivers_license', 'utility_bill', 'bank_statement', 'selfie');
CREATE TYPE public.account_type AS ENUM ('savings', 'current', 'crypto_wallet');
CREATE TYPE public.card_type AS ENUM ('virtual_debit', 'physical_debit', 'virtual_credit', 'physical_credit');
CREATE TYPE public.card_status AS ENUM ('pending', 'active', 'blocked', 'expired', 'cancelled');

-- Create profiles table that extends auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  nationality TEXT,
  country_of_residence TEXT NOT NULL,
  state_province TEXT,
  city TEXT,
  address_line_1 TEXT,
  address_line_2 TEXT,
  postal_code TEXT,
  occupation TEXT,
  employer TEXT,
  monthly_income DECIMAL(15,2),
  source_of_funds TEXT,
  user_status public.user_status DEFAULT 'pending',
  verification_level public.verification_level DEFAULT 'unverified',
  profile_completed BOOLEAN DEFAULT FALSE,
  terms_accepted BOOLEAN DEFAULT FALSE,
  privacy_policy_accepted BOOLEAN DEFAULT FALSE,
  marketing_consent BOOLEAN DEFAULT FALSE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create KYC documents table
CREATE TABLE public.kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  document_type public.document_type NOT NULL,
  document_number TEXT,
  document_url TEXT NOT NULL,
  verification_status public.kyc_status DEFAULT 'not_started',
  verification_notes TEXT,
  expiry_date DATE,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, document_type)
);

-- Create KYC verification table
CREATE TABLE public.kyc_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  overall_status public.kyc_status DEFAULT 'not_started',
  identity_verified BOOLEAN DEFAULT FALSE,
  address_verified BOOLEAN DEFAULT FALSE,
  income_verified BOOLEAN DEFAULT FALSE,
  risk_assessment_score INTEGER CHECK (risk_assessment_score >= 0 AND risk_assessment_score <= 100),
  verification_tier INTEGER DEFAULT 1 CHECK (verification_tier >= 1 AND verification_tier <= 3),
  last_review_date TIMESTAMP WITH TIME ZONE,
  next_review_date TIMESTAMP WITH TIME ZONE,
  reviewer_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create virtual accounts table
CREATE TABLE public.virtual_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  account_number TEXT NOT NULL UNIQUE,
  account_name TEXT NOT NULL,
  account_type public.account_type NOT NULL,
  bank_name TEXT NOT NULL,
  bank_code TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  balance DECIMAL(15,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cards table
CREATE TABLE public.cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  card_number TEXT NOT NULL UNIQUE,
  card_type public.card_type NOT NULL,
  card_status public.card_status DEFAULT 'pending',
  masked_pan TEXT NOT NULL,
  expiry_month INTEGER NOT NULL CHECK (expiry_month >= 1 AND expiry_month <= 12),
  expiry_year INTEGER NOT NULL,
  cvv_encrypted TEXT,
  spending_limit DECIMAL(15,2) DEFAULT 100000.00,
  daily_limit DECIMAL(15,2) DEFAULT 50000.00,
  monthly_limit DECIMAL(15,2) DEFAULT 500000.00,
  is_contactless BOOLEAN DEFAULT TRUE,
  is_international BOOLEAN DEFAULT FALSE,
  pin_set BOOLEAN DEFAULT FALSE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create crypto wallets table
CREATE TABLE public.crypto_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  wallet_address TEXT NOT NULL UNIQUE,
  wallet_type TEXT NOT NULL, -- 'bitcoin', 'ethereum', 'binance_smart_chain', etc.
  private_key_encrypted TEXT NOT NULL,
  public_key TEXT NOT NULL,
  balance DECIMAL(18,8) DEFAULT 0.00000000,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, wallet_type)
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  transaction_type TEXT NOT NULL, -- 'bill_payment', 'wallet_funding', 'card_transaction', 'crypto_topup', etc.
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'cancelled'
  reference_number TEXT NOT NULL UNIQUE,
  external_reference TEXT,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.virtual_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for KYC documents
CREATE POLICY "Users can view their own KYC documents" ON public.kyc_documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own KYC documents" ON public.kyc_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own KYC documents" ON public.kyc_documents
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for KYC verification
CREATE POLICY "Users can view their own KYC verification" ON public.kyc_verification
  FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policies for virtual accounts
CREATE POLICY "Users can view their own virtual accounts" ON public.virtual_accounts
  FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policies for cards
CREATE POLICY "Users can view their own cards" ON public.cards
  FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policies for crypto wallets
CREATE POLICY "Users can view their own crypto wallets" ON public.crypto_wallets
  FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policies for transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone_number)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.phone
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kyc_documents_updated_at BEFORE UPDATE ON public.kyc_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kyc_verification_updated_at BEFORE UPDATE ON public.kyc_verification
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_virtual_accounts_updated_at BEFORE UPDATE ON public.virtual_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON public.cards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crypto_wallets_updated_at BEFORE UPDATE ON public.crypto_wallets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
