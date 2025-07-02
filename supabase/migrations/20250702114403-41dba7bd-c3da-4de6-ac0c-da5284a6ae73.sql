
-- Fix the calculate_credit_score function to set a secure search_path
CREATE OR REPLACE FUNCTION public.calculate_credit_score(user_id_param uuid)
RETURNS TABLE(score integer, grade character varying)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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
