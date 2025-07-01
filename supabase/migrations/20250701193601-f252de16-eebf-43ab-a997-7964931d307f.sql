
-- Add banqa_id column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN banqa_id TEXT UNIQUE;

-- Create a function to generate unique Banqa IDs
CREATE OR REPLACE FUNCTION generate_banqa_id()
RETURNS TEXT
LANGUAGE plpgsql
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

-- Update existing users to have Banqa IDs
UPDATE public.profiles 
SET banqa_id = generate_banqa_id() 
WHERE banqa_id IS NULL;

-- Make banqa_id NOT NULL after setting values for existing users
ALTER TABLE public.profiles 
ALTER COLUMN banqa_id SET NOT NULL;

-- Update the handle_new_user function to generate Banqa ID for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    phone_number,
    country_of_residence,
    date_of_birth,
    terms_accepted,
    privacy_policy_accepted,
    marketing_consent,
    banqa_id
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'phone_number', NEW.phone),
    COALESCE(NEW.raw_user_meta_data->>'country_of_residence', 'Unknown'),
    CASE 
      WHEN NEW.raw_user_meta_data->>'date_of_birth' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'date_of_birth')::date
      ELSE NULL
    END,
    COALESCE((NEW.raw_user_meta_data->>'terms_accepted')::boolean, false),
    COALESCE((NEW.raw_user_meta_data->>'privacy_policy_accepted')::boolean, false),
    COALESCE((NEW.raw_user_meta_data->>'marketing_consent')::boolean, false),
    generate_banqa_id()
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to create user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create index for faster Banqa ID lookups
CREATE INDEX idx_profiles_banqa_id ON public.profiles(banqa_id);
