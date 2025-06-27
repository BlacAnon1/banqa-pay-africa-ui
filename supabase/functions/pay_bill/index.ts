
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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    const { service_type, provider_name, amount, customer_data, reference_id } = await req.json()

    // Validate user has sufficient wallet balance
    const { data: wallet, error: walletError } = await supabaseClient
      .from('wallets')
      .select('balance')
      .eq('user_id', user.id)
      .eq('currency', 'NGN')
      .single()

    if (walletError || !wallet) {
      throw new Error('Wallet not found')
    }

    if (wallet.balance < amount) {
      throw new Error('Insufficient wallet balance')
    }

    // Get service configuration
    const { data: service, error: serviceError } = await supabaseClient
      .from('services')
      .select('*')
      .eq('service_type', service_type)
      .eq('provider_name', provider_name)
      .eq('is_active', true)
      .single()

    if (serviceError || !service) {
      throw new Error('Service not available')
    }

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: user.id,
        transaction_type: 'bill_payment',
        service_type,
        amount,
        status: 'pending',
        provider_name,
        reference_number: reference_id,
        description: `${service_type} bill payment to ${provider_name}`,
        metadata: {
          customer_data,
          service_config: service
        }
      })
      .select()
      .single()

    if (transactionError) {
      throw new Error('Failed to create transaction')
    }

    // Simulate API call to payment provider
    // In a real implementation, you would call the actual provider API
    const paymentResult = await simulatePaymentProvider(service, customer_data, amount)

    let finalStatus = 'completed'
    if (!paymentResult.success) {
      finalStatus = 'failed'
    }

    // Update transaction status
    const { error: updateError } = await supabaseClient
      .from('transactions')
      .update({ 
        status: finalStatus,
        metadata: {
          ...transaction.metadata,
          payment_result: paymentResult
        }
      })
      .eq('id', transaction.id)

    if (updateError) {
      console.error('Failed to update transaction:', updateError)
    }

    // Update wallet balance if payment successful
    if (finalStatus === 'completed') {
      const { error: walletUpdateError } = await supabaseClient
        .from('wallets')
        .update({ balance: wallet.balance - amount })
        .eq('user_id', user.id)
        .eq('currency', 'NGN')

      if (walletUpdateError) {
        console.error('Failed to update wallet:', walletUpdateError)
      }

      // Send notification
      await supabaseClient
        .from('notifications')
        .insert({
          user_id: user.id,
          title: 'Payment Successful',
          body: `Your ${service_type} bill payment of ₦${amount} to ${provider_name} was successful.`,
          type: 'transaction'
        })
    } else {
      await supabaseClient
        .from('notifications')
        .insert({
          user_id: user.id,
          title: 'Payment Failed',
          body: `Your ${service_type} bill payment of ₦${amount} to ${provider_name} failed. ${paymentResult.error || ''}`,
          type: 'transaction'
        })
    }

    return new Response(
      JSON.stringify({
        success: finalStatus === 'completed',
        transaction_id: transaction.id,
        status: finalStatus,
        message: paymentResult.message || (finalStatus === 'completed' ? 'Payment successful' : 'Payment failed')
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Pay bill error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

async function simulatePaymentProvider(service: any, customerData: any, amount: number) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Simulate success/failure (90% success rate)
  const success = Math.random() > 0.1
  
  return {
    success,
    message: success ? 'Payment processed successfully' : 'Payment failed',
    error: success ? null : 'Provider service unavailable',
    reference: success ? `PAY${Date.now()}` : null
  }
}
