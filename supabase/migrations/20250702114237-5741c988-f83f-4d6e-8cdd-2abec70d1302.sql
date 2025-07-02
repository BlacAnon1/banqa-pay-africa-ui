
-- Fix the generate_banqa_id function to set a secure search_path
CREATE OR REPLACE FUNCTION public.generate_banqa_id()
RETURNS text
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
DECLARE
    new_id TEXT;
    counter INTEGER := 0;
BEGIN
    LOOP
        -- Generate a 8-digit Banqa ID starting with 'BQ'
        new_id := 'BQ' || LPAD((1000000 + floor(random() * 9000000)::int)::text, 8, '0');
        
        -- Check if this ID already exists
        IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE banqa_id = new_id) THEN
            RETURN new_id;
        END IF;
        
        counter := counter + 1;
        -- Safety check to prevent infinite loop
        IF counter > 100 THEN
            RAISE EXCEPTION 'Unable to generate unique Banqa ID after 100 attempts';
        END IF;
    END LOOP;
END;
$$;
