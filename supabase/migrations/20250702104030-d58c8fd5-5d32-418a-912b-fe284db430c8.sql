
-- Create loan providers table
CREATE TABLE public.loan_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  api_endpoint TEXT,
  api_key_required BOOLEAN DEFAULT true,
  min_loan_amount NUMERIC(10,2) DEFAULT 5000.00,
  max_loan_amount NUMERIC(12,2) DEFAULT 5000000.00,
  min_interest_rate NUMERIC(5,2) DEFAULT 5.00,
  max_interest_rate NUMERIC(5,2) DEFAULT 35.00,
  min_tenure_months INTEGER DEFAULT 1,
  max_tenure_months INTEGER DEFAULT 24,
  countries_supported JSONB DEFAULT '["NG"]'::jsonb,
  kyc_requirements JSONB DEFAULT '["national_id", "bank_statement", "proof_of_income"]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create credit scores table
CREATE TABLE public.credit_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 300 AND score <= 850),
  grade VARCHAR(2) NOT NULL CHECK (grade IN ('A+', 'A', 'B+', 'B', 'C+', 'C', 'D')),
  factors JSONB DEFAULT '{}'::jsonb,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '90 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create loan applications table
CREATE TABLE public.loan_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.loan_providers(id),
  amount NUMERIC(12,2) NOT NULL,
  tenure_months INTEGER NOT NULL,
  interest_rate NUMERIC(5,2) NOT NULL,
  monthly_payment NUMERIC(10,2) NOT NULL,
  purpose TEXT NOT NULL,
  employment_status VARCHAR(50) NOT NULL,
  monthly_income NUMERIC(12,2) NOT NULL,
  application_data JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'disbursed', 'cancelled')),
  provider_reference TEXT,
  approval_date TIMESTAMP WITH TIME ZONE,
  disbursement_date TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create loans table for active loans
CREATE TABLE public.loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.loan_applications(id),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.loan_providers(id),
  principal_amount NUMERIC(12,2) NOT NULL,
  outstanding_balance NUMERIC(12,2) NOT NULL,
  interest_rate NUMERIC(5,2) NOT NULL,
  monthly_payment NUMERIC(10,2) NOT NULL,
  tenure_months INTEGER NOT NULL,
  payments_made INTEGER DEFAULT 0,
  next_payment_date DATE NOT NULL,
  loan_start_date DATE NOT NULL,
  loan_end_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'defaulted', 'restructured')),
  provider_loan_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create loan payments table
CREATE TABLE public.loan_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID REFERENCES public.loans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  payment_date DATE DEFAULT CURRENT_DATE,
  payment_method VARCHAR(50) DEFAULT 'wallet',
  reference_number TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.loan_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for loan_providers (public read)
CREATE POLICY "Anyone can view active loan providers" ON public.loan_providers
  FOR SELECT USING (is_active = true);

-- RLS Policies for credit_scores
CREATE POLICY "Users can view their own credit score" ON public.credit_scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credit score" ON public.credit_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own credit score" ON public.credit_scores
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for loan_applications
CREATE POLICY "Users can view their own loan applications" ON public.loan_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own loan applications" ON public.loan_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own loan applications" ON public.loan_applications
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for loans
CREATE POLICY "Users can view their own loans" ON public.loans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert loans" ON public.loans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update loans" ON public.loans
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for loan_payments
CREATE POLICY "Users can view their own loan payments" ON public.loan_payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create loan payments" ON public.loan_payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert default loan providers
INSERT INTO public.loan_providers (name, min_loan_amount, max_loan_amount, min_interest_rate, max_interest_rate, min_tenure_months, max_tenure_months, countries_supported) VALUES
('Migo', 10000.00, 1000000.00, 8.5, 25.0, 3, 12, '["NG"]'::jsonb),
('Carbon', 1500.00, 1000000.00, 5.0, 15.0, 3, 24, '["NG"]'::jsonb),
('CredPal', 5000.00, 500000.00, 3.5, 12.0, 1, 12, '["NG"]'::jsonb),
('OnePipe', 50000.00, 5000000.00, 12.0, 30.0, 6, 24, '["NG", "KE", "GH"]'::jsonb),
('Bloc', 20000.00, 2000000.00, 7.0, 18.0, 3, 18, '["NG"]'::jsonb),
('EaseMoni', 2000.00, 200000.00, 4.0, 20.0, 1, 6, '["NG"]'::jsonb),
('Lemfi', 100000.00, 10000000.00, 15.0, 35.0, 12, 24, '["NG", "KE", "GH", "ZA", "EG"]'::jsonb);

-- Create function to calculate credit score
CREATE OR REPLACE FUNCTION public.calculate_credit_score(user_id_param UUID)
RETURNS TABLE(score INTEGER, grade VARCHAR(2))
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_data RECORD;
  transaction_count INTEGER;
  avg_monthly_income NUMERIC;
  kyc_level TEXT;
  calculated_score INTEGER;
  calculated_grade VARCHAR(2);
BEGIN
  -- Get user profile data
  SELECT * INTO profile_data 
  FROM public.profiles 
  WHERE id = user_id_param;
  
  -- Calculate base score from profile completeness
  calculated_score := 300; -- Base score
  
  -- Profile completion factors (up to 200 points)
  IF profile_data.full_name IS NOT NULL THEN calculated_score := calculated_score + 20; END IF;
  IF profile_data.phone_number IS NOT NULL THEN calculated_score := calculated_score + 30; END IF;
  IF profile_data.date_of_birth IS NOT NULL THEN calculated_score := calculated_score + 25; END IF;
  IF profile_data.address_line_1 IS NOT NULL THEN calculated_score := calculated_score + 25; END IF;
  IF profile_data.occupation IS NOT NULL THEN calculated_score := calculated_score + 30; END IF;
  IF profile_data.employer IS NOT NULL THEN calculated_score := calculated_score + 25; END IF;
  IF profile_data.monthly_income IS NOT NULL AND profile_data.monthly_income > 0 THEN calculated_score := calculated_score + 45; END IF;
  
  -- KYC verification level (up to 150 points)
  kyc_level := COALESCE(profile_data.verification_level::text, 'unverified');
  CASE kyc_level
    WHEN 'basic' THEN calculated_score := calculated_score + 50;
    WHEN 'enhanced' THEN calculated_score := calculated_score + 100;
    WHEN 'premium' THEN calculated_score := calculated_score + 150;
    ELSE calculated_score := calculated_score + 0;
  END CASE;
  
  -- Transaction history (up to 200 points)
  SELECT COUNT(*) INTO transaction_count 
  FROM public.transactions 
  WHERE user_id = user_id_param AND status = 'completed';
  
  IF transaction_count > 50 THEN calculated_score := calculated_score + 200;
  ELSIF transaction_count > 25 THEN calculated_score := calculated_score + 150;
  ELSIF transaction_count > 10 THEN calculated_score := calculated_score + 100;
  ELSIF transaction_count > 5 THEN calculated_score := calculated_score + 50;
  END IF;
  
  -- Cap the score at 850
  IF calculated_score > 850 THEN calculated_score := 850; END IF;
  
  -- Determine grade
  IF calculated_score >= 750 THEN calculated_grade := 'A+';
  ELSIF calculated_score >= 700 THEN calculated_grade := 'A';
  ELSIF calculated_score >= 650 THEN calculated_grade := 'B+';
  ELSIF calculated_score >= 600 THEN calculated_grade := 'B';
  ELSIF calculated_score >= 550 THEN calculated_grade := 'C+';
  ELSIF calculated_score >= 500 THEN calculated_grade := 'C';
  ELSE calculated_grade := 'D';
  END IF;
  
  RETURN QUERY SELECT calculated_score, calculated_grade;
END;
$$;

-- Create trigger to update timestamps
CREATE TRIGGER update_loan_providers_updated_at 
  BEFORE UPDATE ON public.loan_providers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_loan_applications_updated_at 
  BEFORE UPDATE ON public.loan_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_loans_updated_at 
  BEFORE UPDATE ON public.loans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
