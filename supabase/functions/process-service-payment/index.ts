
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { 
      amount, 
      service_type, 
      service_data, 
      payment_reference,
      user_id 
    } = await req.json()

    console.log('Processing service payment:', { 
      amount, 
      service_type, 
      payment_reference, 
      user_id 
    })

    if (!amount || !service_type || !payment_reference || !user_id) {
      throw new Error('Missing required fields')
    }

    // Verify payment with Flutterwave (you'd implement this based on your payment flow)
    // For now, we'll assume payment is verified

    // Process the service based on type
    let serviceResult
    
    if (service_type === 'airtime') {
      // Get Reloadly access token
      const authResponse = await supabaseClient.functions.invoke('reloadly-auth')
      if (!authResponse.data?.success) {
        throw new Error('Failed to authenticate with service provider')
      }

      // Process airtime through Reloadly
      const airtimeResponse = await supabaseClient.functions.invoke('reloadly-services', {
        body: {
          action: 'topup_airtime',
          access_token: authResponse.data.access_token,
          operator_id: service_data.operator_id,
          phone_number: service_data.phone_number,
          amount: amount,
          reference: payment_reference,
          country_code: 'NG'
        }
      })

      if (!airtimeResponse.data?.success) {
        throw new Error(airtimeResponse.data?.error || 'Service delivery failed')
      }

      serviceResult = airtimeResponse.data.data
    }

    // Create transaction record
    const transactionData = {
      user_id,
      transaction_type: 'purchase',
      amount: amount,
      status: 'completed',
      currency: 'NGN',
      reference_number: payment_reference,
      description: `Direct ${service_type} purchase`,
      service_type: service_type,
      provider_name: 'Reloadly',
      metadata: {
        payment_method: 'flutterwave_direct',
        service_data,
        service_result: serviceResult
      }
    }

    const { data: transaction, error: transactionError } = await supabaseClient
      .from('transactions')
      .insert(transactionData)
      .select()
      .single()

    if (transactionError) {
      console.error('Failed to create transaction record:', transactionError)
    }

    // Send notification
    try {
      await supabaseClient
        .from('notifications')
        .insert({
          user_id,
          title: `${service_type.charAt(0).toUpperCase() + service_type.slice(1)} Purchase Successful`,
          body: `Your ${service_type} purchase of ₦${amount} has been completed successfully.`,
          type: 'transaction',
          metadata: {
            transaction_id: transaction?.id,
            service_type,
            amount
          }
        })
    } catch (notificationError) {
      console.error('Failed to send notification:', notificationError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        transaction_id: transaction?.id,
        service_result: serviceResult,
        message: 'Service delivered successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Service payment processing error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
