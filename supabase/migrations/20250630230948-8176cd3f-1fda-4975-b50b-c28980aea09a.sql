
-- First, let's check if there are any profiles in the table
SELECT COUNT(*) as profile_count FROM public.profiles;

-- Then let's see what user IDs exist in auth but not in profiles
SELECT au.id, au.email, au.created_at
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- Create a profile for any users that don't have one
INSERT INTO public.profiles (
  id, 
  email, 
  full_name, 
  phone_number,
  country_of_residence,
  terms_accepted,
  privacy_policy_accepted,
  marketing_consent
)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email),
  COALESCE(au.raw_user_meta_data->>'phone_number', au.phone),
  COALESCE(au.raw_user_meta_data->>'country_of_residence', 'Unknown'),
  COALESCE((au.raw_user_meta_data->>'terms_accepted')::boolean, false),
  COALESCE((au.raw_user_meta_data->>'privacy_policy_accepted')::boolean, false),
  COALESCE((au.raw_user_meta_data->>'marketing_consent')::boolean, false)
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- Also ensure the user has a wallet
INSERT INTO public.wallets (user_id, balance, currency)
SELECT au.id, 0.00, 'NGN'
FROM auth.users au
LEFT JOIN public.wallets w ON au.id = w.user_id AND w.currency = 'NGN'
WHERE w.user_id IS NULL
ON CONFLICT (user_id, currency) DO NOTHING;
