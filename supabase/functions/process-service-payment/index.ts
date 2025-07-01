
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

    // Process the service based on type
    let serviceResult
    let providerName = 'Unknown'
    
    if (service_type === 'airtime' || service_type === 'data') {
      // Get Reloadly access token
      const authResponse = await supabaseClient.functions.invoke('reloadly-auth')
      if (!authResponse.data?.success) {
        throw new Error('Failed to authenticate with service provider')
      }

      // Process airtime/data through Reloadly
      const action = service_type === 'airtime' ? 'topup_airtime' : 'topup_data'
      const serviceResponse = await supabaseClient.functions.invoke('reloadly-services', {
        body: {
          action,
          access_token: authResponse.data.access_token,
          operator_id: service_data.operator_id,
          phone_number: service_data.phone_number,
          amount: amount,
          reference: payment_reference,
          country_code: service_data.country_code || 'NG'
        }
      })

      if (!serviceResponse.data?.success) {
        throw new Error(serviceResponse.data?.error || 'Service delivery failed')
      }

      serviceResult = serviceResponse.data.data
      providerName = service_data.operator_name || 'Reloadly'

    } else if (service_type === 'gift_card') {
      // Get Reloadly access token for gift cards
      const authResponse = await supabaseClient.functions.invoke('reloadly-auth')
      if (!authResponse.data?.success) {
        throw new Error('Failed to authenticate with service provider')
      }

      // Process gift card through Reloadly
      const giftCardResponse = await supabaseClient.functions.invoke('reloadly-services', {
        body: {
          action: 'order_gift_card',
          access_token: authResponse.data.access_token,
          product_id: service_data.product_id,
          amount: amount,
          reference: payment_reference,
          recipient_email: service_data.recipient_email,
          country_code: service_data.country_code || 'NG',
          quantity: 1
        }
      })

      if (!giftCardResponse.data?.success) {
        throw new Error(giftCardResponse.data?.error || 'Gift card delivery failed')
      }

      serviceResult = giftCardResponse.data.data
      providerName = service_data.brand_name || 'Gift Card'

    } else if (['electricity', 'water', 'internet', 'tv'].includes(service_type)) {
      // For utility bills, we'll simulate the process for now
      // In a real implementation, you'd integrate with utility providers' APIs
      console.log(`Processing ${service_type} service:`, service_data)
      
      serviceResult = {
        status: 'successful',
        reference: payment_reference,
        message: `${service_type} service processed successfully`
      }
      
      providerName = service_data.provider_name || `${service_type} Provider`
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
      provider_name: providerName,
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
