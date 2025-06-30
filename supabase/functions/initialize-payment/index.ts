
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
      throw new Error('No authorization header')
    }

    // Get user from token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      console.error('User error:', userError)
      throw new Error('Invalid user token')
    }

    console.log('User authenticated:', user.id)

    // Get user profile with better error handling
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    console.log('Profile query result:', { profile, profileError })

    if (profileError) {
      console.error('Profile query error:', profileError)
      throw new Error(`Profile query failed: ${profileError.message}`)
    }

    if (!profile) {
      console.error('No profile found for user:', user.id)
      throw new Error('Profile not found. Please complete your profile setup.')
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
