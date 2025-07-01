
-- Create a table to store supported currencies and their exchange rates
CREATE TABLE public.currencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  country TEXT NOT NULL,
  exchange_rate_to_base NUMERIC(10, 6) NOT NULL DEFAULT 1.0, -- Rate to NGN (base currency)
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table to store money transfers between users
CREATE TABLE public.money_transfers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  recipient_id UUID NOT NULL REFERENCES auth.users(id),
  sender_currency TEXT NOT NULL DEFAULT 'NGN',
  recipient_currency TEXT NOT NULL DEFAULT 'NGN',
  amount_sent NUMERIC(15, 2) NOT NULL,
  amount_received NUMERIC(15, 2) NOT NULL,
  exchange_rate NUMERIC(10, 6) NOT NULL DEFAULT 1.0,
  transfer_fee NUMERIC(15, 2) NOT NULL DEFAULT 0.0,
  status TEXT NOT NULL DEFAULT 'pending',
  reference_number TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Insert supported African currencies
INSERT INTO public.currencies (code, name, symbol, country, exchange_rate_to_base) VALUES
('NGN', 'Nigerian Naira', '₦', 'Nigeria', 1.0),
('KES', 'Kenyan Shilling', 'KSh', 'Kenya', 0.32),
('TZS', 'Tanzanian Shilling', 'TSh', 'Tanzania', 0.017),
('UGX', 'Ugandan Shilling', 'USh', 'Uganda', 0.011),
('GHS', 'Ghanaian Cedi', '₵', 'Ghana', 6.8),
('ZAR', 'South African Rand', 'R', 'South Africa', 2.3),
('EGP', 'Egyptian Pound', 'E£', 'Egypt', 0.85),
('MAD', 'Moroccan Dirham', 'DH', 'Morocco', 4.2),
('ETB', 'Ethiopian Birr', 'Br', 'Ethiopia', 0.72),
('RWF', 'Rwandan Franc', 'RF', 'Rwanda', 0.038);

-- Enable RLS on new tables
ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.money_transfers ENABLE ROW LEVEL SECURITY;

-- Create policies for currencies (public read access)
CREATE POLICY "Anyone can view active currencies" 
  ON public.currencies 
  FOR SELECT 
  USING (is_active = true);

-- Create policies for money transfers
CREATE POLICY "Users can view their own transfers" 
  ON public.money_transfers 
  FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can create transfers they send" 
  ON public.money_transfers 
  FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own transfers" 
  ON public.money_transfers 
  FOR UPDATE 
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Create indexes for performance
CREATE INDEX idx_money_transfers_sender ON public.money_transfers(sender_id);
CREATE INDEX idx_money_transfers_recipient ON public.money_transfers(recipient_id);
CREATE INDEX idx_money_transfers_status ON public.money_transfers(status);
CREATE INDEX idx_currencies_code ON public.currencies(code);

-- Create function to update exchange rates (for future admin use)
CREATE OR REPLACE FUNCTION update_currency_exchange_rate(currency_code TEXT, new_rate NUMERIC)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.currencies 
  SET exchange_rate_to_base = new_rate, updated_at = now()
  WHERE code = currency_code AND is_active = true;
  
  RETURN FOUND;
END;
$$;
