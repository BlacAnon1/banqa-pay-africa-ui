
-- Add enhanced security tables and fields
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  risk_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add two-factor authentication table
CREATE TABLE IF NOT EXISTS public.user_2fa_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  secret_key TEXT NOT NULL,
  backup_codes TEXT[],
  enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Add login attempts tracking
CREATE TABLE IF NOT EXISTS public.login_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  ip_address INET,
  success BOOLEAN DEFAULT false,
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add bank account verification statuses and additional fields
ALTER TABLE public.bank_accounts 
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS verification_method TEXT,
ADD COLUMN IF NOT EXISTS verification_data JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS verification_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_verification_attempt TIMESTAMP WITH TIME ZONE;

-- Add bank verification tokens table for micro-deposits verification
CREATE TABLE IF NOT EXISTS public.bank_verification_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bank_account_id UUID NOT NULL REFERENCES public.bank_accounts(id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL DEFAULT 'micro_deposit',
  token_data JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add session management table
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL,
  device_info JSONB DEFAULT '{}',
  ip_address INET,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add device fingerprinting table
CREATE TABLE IF NOT EXISTS public.user_devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_fingerprint TEXT NOT NULL,
  device_name TEXT,
  device_type TEXT,
  browser_info JSONB DEFAULT '{}',
  is_trusted BOOLEAN DEFAULT false,
  first_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, device_fingerprint)
);

-- Enable RLS on all new tables
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_2fa_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;

-- RLS policies for security_events
CREATE POLICY "Users can view their own security events" 
  ON public.security_events FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert security events" 
  ON public.security_events FOR INSERT 
  WITH CHECK (true);

-- RLS policies for user_2fa_settings
CREATE POLICY "Users can manage their own 2FA settings" 
  ON public.user_2fa_settings FOR ALL 
  USING (auth.uid() = user_id);

-- RLS policies for login_attempts (read-only for users)
CREATE POLICY "Users can view their own login attempts" 
  ON public.login_attempts FOR SELECT 
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "System can insert login attempts" 
  ON public.login_attempts FOR INSERT 
  WITH CHECK (true);

-- RLS policies for bank_verification_tokens
CREATE POLICY "Users can view their own bank verification tokens" 
  ON public.bank_verification_tokens FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.bank_accounts 
    WHERE id = bank_verification_tokens.bank_account_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own bank verification tokens" 
  ON public.bank_verification_tokens FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.bank_accounts 
    WHERE id = bank_verification_tokens.bank_account_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "System can manage bank verification tokens" 
  ON public.bank_verification_tokens FOR INSERT 
  WITH CHECK (true);

-- RLS policies for user_sessions
CREATE POLICY "Users can view their own sessions" 
  ON public.user_sessions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" 
  ON public.user_sessions FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage sessions" 
  ON public.user_sessions FOR INSERT 
  WITH CHECK (true);

-- RLS policies for user_devices
CREATE POLICY "Users can manage their own devices" 
  ON public.user_devices FOR ALL 
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON public.security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON public.login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON public.login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_bank_verification_tokens_account_id ON public.bank_verification_tokens(bank_account_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_devices_user_id ON public.user_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_user_devices_fingerprint ON public.user_devices(device_fingerprint);

-- Create updated_at triggers
CREATE TRIGGER update_user_2fa_settings_updated_at 
  BEFORE UPDATE ON public.user_2fa_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bank_verification_tokens_updated_at 
  BEFORE UPDATE ON public.bank_verification_tokens 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create security functions
CREATE OR REPLACE FUNCTION public.log_security_event(
  _user_id UUID,
  _event_type TEXT,
  _event_data JSONB DEFAULT '{}',
  _ip_address INET DEFAULT NULL,
  _user_agent TEXT DEFAULT NULL,
  _risk_score INTEGER DEFAULT 0
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.security_events (
    user_id, event_type, event_data, ip_address, user_agent, risk_score
  ) VALUES (
    _user_id, _event_type, _event_data, _ip_address, _user_agent, _risk_score
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- Function to check login attempts and implement rate limiting
CREATE OR REPLACE FUNCTION public.check_login_rate_limit(
  _email TEXT,
  _ip_address INET DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  failed_attempts INTEGER;
  last_attempt TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Check failed attempts in the last 15 minutes
  SELECT COUNT(*), MAX(created_at)
  INTO failed_attempts, last_attempt
  FROM public.login_attempts
  WHERE email = _email 
    AND success = false
    AND created_at > now() - INTERVAL '15 minutes';
  
  -- If more than 5 failed attempts, block for 15 minutes
  IF failed_attempts >= 5 THEN
    RETURN false;
  END IF;
  
  -- Additional IP-based rate limiting if IP provided
  IF _ip_address IS NOT NULL THEN
    SELECT COUNT(*)
    INTO failed_attempts
    FROM public.login_attempts
    WHERE ip_address = _ip_address 
      AND success = false
      AND created_at > now() - INTERVAL '5 minutes';
    
    -- Block IP after 10 failed attempts in 5 minutes
    IF failed_attempts >= 10 THEN
      RETURN false;
    END IF;
  END IF;
  
  RETURN true;
END;
$$;

-- Function to record login attempt
CREATE OR REPLACE FUNCTION public.record_login_attempt(
  _email TEXT,
  _ip_address INET DEFAULT NULL,
  _success BOOLEAN DEFAULT false,
  _failure_reason TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.login_attempts (
    email, ip_address, success, failure_reason
  ) VALUES (
    _email, _ip_address, _success, _failure_reason
  );
END;
$$;
