
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

    const { user_id, amount, currency = 'NGN', transaction_type, reference, metadata } = await req.json()

    if (!user_id || !amount || !transaction_type) {
      throw new Error('Missing required fields: user_id, amount, transaction_type')
    }

    // Get current wallet balance
    const { data: wallet, error: walletError } = await supabaseClient
      .from('wallets')
      .select('*')
      .eq('user_id', user_id)
      .eq('currency', currency)
      .single()

    if (walletError || !wallet) {
      throw new Error('Wallet not found')
    }

    const newBalance = wallet.balance + amount

    // Update wallet balance
    const { error: updateError } = await supabaseClient
      .from('wallets')
      .update({ balance: newBalance })
      .eq('user_id', user_id)
      .eq('currency', currency)

    if (updateError) {
      throw new Error('Failed to update wallet balance')
    }

    // Create transaction record
    const { error: transactionError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id,
        transaction_type,
        amount,
        status: 'completed',
        currency,
        reference_number: reference || `SYNC${Date.now()}`,
        description: `Wallet ${amount > 0 ? 'credit' : 'debit'} via ${transaction_type}`,
        metadata: metadata || {}
      })

    if (transactionError) {
      console.error('Failed to create transaction record:', transactionError)
    }

    // Send notification
    const { error: notificationError } = await supabaseClient
      .from('notifications')
      .insert({
        user_id,
        title: amount > 0 ? 'Wallet Credited' : 'Wallet Debited',
        body: `Your wallet has been ${amount > 0 ? 'credited' : 'debited'} with ${currency} ${Math.abs(amount)}. New balance: ${currency} ${newBalance}`,
        type: 'transaction'
      })

    if (notificationError) {
      console.error('Failed to send notification:', notificationError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        new_balance: newBalance,
        currency,
        message: 'Wallet synchronized successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Sync wallet error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
