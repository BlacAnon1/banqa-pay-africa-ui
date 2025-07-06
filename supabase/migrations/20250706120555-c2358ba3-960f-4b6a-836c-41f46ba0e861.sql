
-- Create table for user insights and analytics
CREATE TABLE public.user_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  service_type TEXT NOT NULL,
  month_year TEXT NOT NULL, -- format: 'YYYY-MM'
  amount_spent NUMERIC NOT NULL DEFAULT 0,
  usage_units NUMERIC,
  usage_type TEXT, -- 'kwh', 'liters', 'gb', etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for bill forecasts
CREATE TABLE public.bill_forecasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  service_type TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  predicted_amount NUMERIC NOT NULL,
  confidence_score INTEGER NOT NULL DEFAULT 50, -- 0-100
  due_date DATE NOT NULL,
  factors JSONB DEFAULT '{}', -- factors affecting the prediction
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for multi-country wallets
CREATE TABLE public.multi_country_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  currency_symbol TEXT NOT NULL,
  balance NUMERIC NOT NULL DEFAULT 0.00,
  is_default BOOLEAN DEFAULT false,
  exchange_rate NUMERIC NOT NULL DEFAULT 1.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, country_code)
);

-- Create table for virtual cards (BanqaCard)
CREATE TABLE public.virtual_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  card_name TEXT NOT NULL,
  card_number_encrypted TEXT NOT NULL,
  masked_card_number TEXT NOT NULL, -- last 4 digits visible
  expiry_month INTEGER NOT NULL,
  expiry_year INTEGER NOT NULL,
  cvv_encrypted TEXT NOT NULL,
  balance NUMERIC NOT NULL DEFAULT 0.00,
  spending_limit NUMERIC NOT NULL DEFAULT 100000.00,
  daily_limit NUMERIC NOT NULL DEFAULT 50000.00,
  monthly_limit NUMERIC NOT NULL DEFAULT 500000.00,
  is_active BOOLEAN DEFAULT true,
  auto_topup_enabled BOOLEAN DEFAULT false,
  auto_topup_threshold NUMERIC DEFAULT 5000.00,
  auto_topup_amount NUMERIC DEFAULT 20000.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for rewards system
CREATE TABLE public.user_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  total_points INTEGER NOT NULL DEFAULT 0,
  lifetime_points INTEGER NOT NULL DEFAULT 0,
  redeemed_points INTEGER NOT NULL DEFAULT 0,
  current_tier TEXT NOT NULL DEFAULT 'Bronze',
  tier_progress INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create table for reward transactions
CREATE TABLE public.reward_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  transaction_type TEXT NOT NULL, -- 'earned' or 'redeemed'
  points INTEGER NOT NULL,
  description TEXT NOT NULL,
  reference_transaction_id UUID, -- links to main transaction if applicable
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for available rewards
CREATE TABLE public.reward_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  cost_points INTEGER NOT NULL,
  category TEXT NOT NULL, -- 'airtime', 'bills', 'donations', 'vouchers'
  value_amount NUMERIC, -- actual monetary value
  is_active BOOLEAN DEFAULT true,
  country_restrictions JSONB DEFAULT '[]', -- array of country codes
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for bill sharing
CREATE TABLE public.bill_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES auth.users NOT NULL,
  transaction_id UUID REFERENCES transactions(id),
  total_amount NUMERIC NOT NULL,
  bill_description TEXT NOT NULL,
  due_date DATE,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for bill share participants
CREATE TABLE public.bill_share_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bill_share_id UUID REFERENCES bill_shares(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users,
  banqa_id TEXT, -- for inviting users not yet registered
  email TEXT, -- for inviting users not yet registered
  phone_number TEXT, -- for inviting users not yet registered
  assigned_amount NUMERIC NOT NULL,
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'overdue'
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.user_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.multi_country_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.virtual_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_share_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_insights
CREATE POLICY "Users can view their own insights" ON public.user_insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own insights" ON public.user_insights FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own insights" ON public.user_insights FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for bill_forecasts
CREATE POLICY "Users can view their own forecasts" ON public.bill_forecasts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage forecasts" ON public.bill_forecasts FOR ALL USING (true);

-- RLS Policies for multi_country_wallets
CREATE POLICY "Users can view their own wallets" ON public.multi_country_wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own wallets" ON public.multi_country_wallets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own wallets" ON public.multi_country_wallets FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for virtual_cards
CREATE POLICY "Users can view their own cards" ON public.virtual_cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own cards" ON public.virtual_cards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own cards" ON public.virtual_cards FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_rewards
CREATE POLICY "Users can view their own rewards" ON public.user_rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own rewards" ON public.user_rewards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own rewards" ON public.user_rewards FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for reward_transactions
CREATE POLICY "Users can view their own reward transactions" ON public.reward_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert reward transactions" ON public.reward_transactions FOR INSERT WITH CHECK (true);

-- RLS Policies for reward_items
CREATE POLICY "Anyone can view active rewards" ON public.reward_items FOR SELECT USING (is_active = true);

-- RLS Policies for bill_shares
CREATE POLICY "Users can view bill shares they created or participate in" ON public.bill_shares FOR SELECT USING (
  auth.uid() = creator_id OR 
  EXISTS (SELECT 1 FROM bill_share_participants WHERE bill_share_id = id AND user_id = auth.uid())
);
CREATE POLICY "Users can create bill shares" ON public.bill_shares FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can update their own bill shares" ON public.bill_shares FOR UPDATE USING (auth.uid() = creator_id);

-- RLS Policies for bill_share_participants
CREATE POLICY "Users can view their own participations" ON public.bill_share_participants FOR SELECT USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM bill_shares WHERE id = bill_share_id AND creator_id = auth.uid())
);
CREATE POLICY "Users can insert participants to their bill shares" ON public.bill_share_participants FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM bill_shares WHERE id = bill_share_id AND creator_id = auth.uid())
);
CREATE POLICY "Users can update their own participations" ON public.bill_share_participants FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_insights_user_month ON public.user_insights(user_id, month_year);
CREATE INDEX idx_bill_forecasts_user_service ON public.bill_forecasts(user_id, service_type);
CREATE INDEX idx_multi_country_wallets_user ON public.multi_country_wallets(user_id);
CREATE INDEX idx_virtual_cards_user ON public.virtual_cards(user_id);
CREATE INDEX idx_reward_transactions_user ON public.reward_transactions(user_id);
CREATE INDEX idx_bill_shares_creator ON public.bill_shares(creator_id);
CREATE INDEX idx_bill_share_participants_user ON public.bill_share_participants(user_id);

-- Insert some default reward items
INSERT INTO public.reward_items (name, description, cost_points, category, value_amount) VALUES
('Airtime ₦500', 'Mobile airtime for any network', 250, 'airtime', 500),
('Airtime ₦1000', 'Mobile airtime for any network', 450, 'airtime', 1000),
('Airtime ₦2000', 'Mobile airtime for any network', 850, 'airtime', 2000),
('5% Bill Discount', 'Discount on your next utility bill', 800, 'bills', NULL),
('10% Bill Discount', 'Discount on your next utility bill', 1500, 'bills', NULL),
('15% Bill Discount', 'Discount on your next utility bill', 2200, 'bills', NULL),
('Education Donation ₦2000', 'Donate to children''s education programs', 1000, 'donations', 2000),
('Healthcare Donation ₦5000', 'Support community healthcare initiatives', 2500, 'donations', 5000),
('Environmental Donation ₦3000', 'Support environmental conservation projects', 1500, 'donations', 3000);

-- Create function to calculate reward points for transactions
CREATE OR REPLACE FUNCTION public.calculate_reward_points(amount NUMERIC, transaction_type TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Base rate: 1 point per ₦100 spent
  -- Bonus rates for different transaction types
  CASE transaction_type
    WHEN 'electricity' THEN RETURN FLOOR(amount / 100) * 2; -- 2x points for electricity
    WHEN 'water' THEN RETURN FLOOR(amount / 100) * 2; -- 2x points for water
    WHEN 'internet' THEN RETURN FLOOR(amount / 100) * 1.5; -- 1.5x points for internet
    WHEN 'tv' THEN RETURN FLOOR(amount / 100) * 1.5; -- 1.5x points for TV
    ELSE RETURN FLOOR(amount / 100); -- 1x points for others
  END CASE;
END;
$$;

-- Create function to update user reward tier
CREATE OR REPLACE FUNCTION public.update_user_tier(user_id_param UUID)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  current_points INTEGER;
  new_tier TEXT;
BEGIN
  -- Get current total points
  SELECT total_points INTO current_points 
  FROM public.user_rewards 
  WHERE user_id = user_id_param;
  
  -- Determine new tier based on points
  IF current_points >= 10000 THEN
    new_tier := 'Platinum';
  ELSIF current_points >= 4000 THEN
    new_tier := 'Gold';
  ELSIF current_points >= 1000 THEN
    new_tier := 'Silver';
  ELSE
    new_tier := 'Bronze';
  END IF;
  
  -- Update user tier
  UPDATE public.user_rewards 
  SET current_tier = new_tier,
      updated_at = now()
  WHERE user_id = user_id_param;
  
  RETURN new_tier;
END;
$$;
