
-- Fix the update_currency_exchange_rate function to set a secure search_path
CREATE OR REPLACE FUNCTION public.update_currency_exchange_rate(currency_code text, new_rate numeric)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.currencies 
  SET exchange_rate_to_base = new_rate, updated_at = now()
  WHERE code = currency_code AND is_active = true;
  
  RETURN FOUND;
END;
$$;
