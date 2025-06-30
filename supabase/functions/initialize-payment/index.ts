
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header provided')
      throw new Error('No authorization header')
    }

    console.log('Authorization header present, getting user...')

    // Get user from token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      console.error('User authentication error:', userError)
      throw new Error('Invalid user token')
    }

    console.log('User authenticated:', user.id)

    // Get user profile with better error handling and retry logic
    let profile = null;
    let profileError = null;

    // Try multiple approaches to get the profile
    const profileQueries = [
      // First try: direct query
      () => supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle(),
      
      // Second try: with service role client if first fails
      () => {
        const serviceClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        )
        return serviceClient
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()
      }
    ]

    for (const queryFn of profileQueries) {
      const result = await queryFn()
      if (!result.error && result.data) {
        profile = result.data
        break
      } else {
        profileError = result.error
        console.log('Profile query attempt failed:', result.error)
      }
    }

    console.log('Final profile query result:', { profile, profileError })

    if (!profile) {
      console.error('No profile found for user:', user.id)
      console.error('Profile error details:', profileError)
      
      // Try to create a basic profile if it doesn't exist
      const { error: createError } = await supabaseClient
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.email || 'User',
          country_of_residence: 'Nigeria',
          terms_accepted: true,
          privacy_policy_accepted: true,
          marketing_consent: false
        })

      if (createError) {
        console.error('Failed to create profile:', createError)
        throw new Error('Profile not found and could not be created. Please complete your profile setup.')
      }

      // Retry getting the profile after creation
      const { data: newProfile, error: newProfileError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (newProfileError || !newProfile) {
        console.error('Failed to retrieve newly created profile:', newProfileError)
        throw new Error('Profile creation failed. Please try again.')
      }

      profile = newProfile
      console.log('Created and retrieved new profile:', profile)
    }

    const { amount } = await req.json()

    if (!amount || amount < 100) {
      throw new Error('Invalid amount. Minimum amount is ₦100')
    }

    const reference = `BQ_${Date.now()}_${user.id.substr(0, 8)}`
    
    const paymentData = {
      public_key: Deno.env.get('FLUTTERWAVE_PUBLIC_KEY'),
      tx_ref: reference,
      amount: amount,
      currency: 'NGN',
      payment_options: 'card, banktransfer, ussd',
      customer: {
        email: profile.email,
        name: profile.full_name || 'Banqa User',
        phone_number: profile.phone_number || undefined,
      },
      customizations: {
        title: 'Banqa Wallet Top-up',
        description: `Add ₦${amount.toLocaleString()} to your Banqa wallet`,
        logo: 'https://banqa.app/favicon.ico',
      },
    }

    console.log('Payment data prepared:', { 
      reference, 
      amount, 
      user_id: user.id,
      customer_email: profile.email,
      public_key_exists: !!Deno.env.get('FLUTTERWAVE_PUBLIC_KEY')
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        paymentData,
        reference 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )

  } catch (error) {
    console.error('Payment initialization error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
