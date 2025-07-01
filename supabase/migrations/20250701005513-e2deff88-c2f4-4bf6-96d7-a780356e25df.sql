
-- Create bank_accounts table to store user's bank accounts
CREATE TABLE public.bank_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  bank_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create withdrawal_pins table to store encrypted withdrawal PINs
CREATE TABLE public.withdrawal_pins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pin_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create withdrawal_otps table to store email verification codes
CREATE TABLE public.withdrawal_otps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  otp_code TEXT NOT NULL,
  withdrawal_amount NUMERIC NOT NULL,
  bank_account_id UUID NOT NULL REFERENCES public.bank_accounts(id),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create withdrawal_requests table to track withdrawal requests
CREATE TABLE public.withdrawal_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_account_id UUID NOT NULL REFERENCES public.bank_accounts(id),
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  reference_number TEXT NOT NULL,
  otp_verified BOOLEAN DEFAULT false,
  pin_verified BOOLEAN DEFAULT false,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for all tables
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for bank_accounts
CREATE POLICY "Users can view their own bank accounts" 
  ON public.bank_accounts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bank accounts" 
  ON public.bank_accounts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bank accounts" 
  ON public.bank_accounts FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bank accounts" 
  ON public.bank_accounts FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS policies for withdrawal_pins
CREATE POLICY "Users can view their own withdrawal pin" 
  ON public.withdrawal_pins FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own withdrawal pin" 
  ON public.withdrawal_pins FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own withdrawal pin" 
  ON public.withdrawal_pins FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS policies for withdrawal_otps
CREATE POLICY "Users can view their own withdrawal OTPs" 
  ON public.withdrawal_otps FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own withdrawal OTPs" 
  ON public.withdrawal_otps FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own withdrawal OTPs" 
  ON public.withdrawal_otps FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS policies for withdrawal_requests
CREATE POLICY "Users can view their own withdrawal requests" 
  ON public.withdrawal_requests FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own withdrawal requests" 
  ON public.withdrawal_requests FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own withdrawal requests" 
  ON public.withdrawal_requests FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bank_accounts_updated_at 
  BEFORE UPDATE ON public.bank_accounts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_withdrawal_pins_updated_at 
  BEFORE UPDATE ON public.withdrawal_pins 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_withdrawal_requests_updated_at 
  BEFORE UPDATE ON public.withdrawal_requests 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
