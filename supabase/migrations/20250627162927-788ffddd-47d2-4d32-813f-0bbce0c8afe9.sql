
-- Create custom types (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE service_type AS ENUM ('electricity', 'water', 'internet', 'cable_tv', 'mobile_airtime', 'mobile_data', 'insurance', 'school_fees');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method_type AS ENUM ('card', 'mobile_money', 'bank_transfer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('transaction', 'payment', 'system', 'promotional');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add user_role to existing profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_role TEXT DEFAULT 'user';

-- Create wallets table
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00 NOT NULL,
    currency TEXT DEFAULT 'NGN' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, currency)
);

-- Update existing transactions table to match our schema
ALTER TABLE public.transactions 
    ADD COLUMN IF NOT EXISTS service_type TEXT,
    ADD COLUMN IF NOT EXISTS provider_name TEXT,
    ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_type TEXT NOT NULL,
    country TEXT NOT NULL,
    provider_name TEXT NOT NULL,
    api_endpoint TEXT,
    input_fields JSONB DEFAULT '[]' NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(service_type, country, provider_name)
);

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    provider_name TEXT NOT NULL,
    last4 TEXT,
    is_default BOOLEAN DEFAULT false NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'open' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    type TEXT NOT NULL,
    read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create receipts table
CREATE TABLE IF NOT EXISTS public.receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE CASCADE NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for wallets
DROP POLICY IF EXISTS "Users can view their own wallets" ON public.wallets;
CREATE POLICY "Users can view their own wallets" ON public.wallets
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own wallets" ON public.wallets;
CREATE POLICY "Users can update their own wallets" ON public.wallets
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert wallets" ON public.wallets;
CREATE POLICY "System can insert wallets" ON public.wallets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for services (public read)
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;
CREATE POLICY "Anyone can view active services" ON public.services
    FOR SELECT USING (is_active = true);

-- Create RLS policies for payment methods
DROP POLICY IF EXISTS "Users can manage their own payment methods" ON public.payment_methods;
CREATE POLICY "Users can manage their own payment methods" ON public.payment_methods
    FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for support tickets
DROP POLICY IF EXISTS "Users can manage their own support tickets" ON public.support_tickets;
CREATE POLICY "Users can manage their own support tickets" ON public.support_tickets
    FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "System can insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for receipts
DROP POLICY IF EXISTS "Users can view receipts for their transactions" ON public.receipts;
CREATE POLICY "Users can view receipts for their transactions" ON public.receipts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.transactions 
            WHERE transactions.id = receipts.transaction_id 
            AND transactions.user_id = auth.uid()
        )
    );

-- Create storage buckets (only if they don't exist)
INSERT INTO storage.buckets (id, name, public) 
SELECT 'receipts', 'receipts', false
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'receipts');

INSERT INTO storage.buckets (id, name, public) 
SELECT 'kyc_docs', 'kyc_docs', false
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'kyc_docs');

-- Storage policies for receipts
DROP POLICY IF EXISTS "Users can upload receipts" ON storage.objects;
CREATE POLICY "Users can upload receipts" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can view their receipts" ON storage.objects;
CREATE POLICY "Users can view their receipts" ON storage.objects
    FOR SELECT USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for KYC docs
DROP POLICY IF EXISTS "Users can upload KYC docs" ON storage.objects;
CREATE POLICY "Users can upload KYC docs" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'kyc_docs' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can view their KYC docs" ON storage.objects;
CREATE POLICY "Users can view their KYC docs" ON storage.objects
    FOR SELECT USING (bucket_id = 'kyc_docs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enable realtime for specific tables
ALTER TABLE public.transactions REPLICA IDENTITY FULL;
ALTER TABLE public.wallets REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Add tables to realtime publication
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.wallets;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create triggers for updated_at timestamps
DROP TRIGGER IF EXISTS update_wallets_updated_at ON public.wallets;
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON public.wallets
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_methods_updated_at ON public.payment_methods;
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON public.payment_methods
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_support_tickets_updated_at ON public.support_tickets;
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON public.support_tickets
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create wallet for new users
CREATE OR REPLACE FUNCTION public.create_user_wallet()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.wallets (user_id, balance, currency)
    VALUES (NEW.id, 0.00, 'NGN')
    ON CONFLICT (user_id, currency) DO NOTHING;
    RETURN NEW;
END;
$$;

-- Trigger to create wallet when profile is created
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
    AFTER INSERT ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.create_user_wallet();

-- Insert sample services (only if they don't exist)
INSERT INTO public.services (service_type, country, provider_name, input_fields, is_active) 
SELECT * FROM (VALUES
    ('electricity', 'Nigeria', 'EEDC', '[{"name": "meter_number", "type": "text", "label": "Meter Number", "required": true}]'::jsonb, true),
    ('electricity', 'Nigeria', 'AEDC', '[{"name": "meter_number", "type": "text", "label": "Meter Number", "required": true}]'::jsonb, true),
    ('water', 'Nigeria', 'Lagos Water Corporation', '[{"name": "account_number", "type": "text", "label": "Account Number", "required": true}]'::jsonb, true),
    ('internet', 'Nigeria', 'MTN', '[{"name": "phone_number", "type": "tel", "label": "Phone Number", "required": true}]'::jsonb, true),
    ('cable_tv', 'Nigeria', 'DSTV', '[{"name": "smartcard_number", "type": "text", "label": "Smartcard Number", "required": true}]'::jsonb, true)
) AS v(service_type, country, provider_name, input_fields, is_active)
WHERE NOT EXISTS (
    SELECT 1 FROM public.services s 
    WHERE s.service_type = v.service_type 
    AND s.country = v.country 
    AND s.provider_name = v.provider_name
);
