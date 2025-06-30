
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

    console.log('Sync wallet request:', { user_id, amount, currency, transaction_type, reference, metadata })

    if (!user_id || !amount || !transaction_type) {
      throw new Error('Missing required fields: user_id, amount, transaction_type')
    }

    // Get or create wallet for the user
    let { data: wallet, error: walletError } = await supabaseClient
      .from('wallets')
      .select('*')
      .eq('user_id', user_id)
      .eq('currency', currency)
      .single()

    if (walletError && walletError.code === 'PGRST116') {
      // Wallet doesn't exist, create it
      console.log('Creating new wallet for user:', user_id)
      const { data: newWallet, error: createError } = await supabaseClient
        .from('wallets')
        .insert({ user_id, balance: 0, currency })
        .select()
        .single()

      if (createError) {
        throw new Error(`Failed to create wallet: ${createError.message}`)
      }

      wallet = newWallet
    } else if (walletError) {
      throw new Error(`Failed to fetch wallet: ${walletError.message}`)
    }

    const currentBalance = wallet.balance || 0
    const newBalance = currentBalance + amount

    console.log(`Updating wallet balance from ${currentBalance} to ${newBalance}`)

    // Update wallet balance
    const { error: updateError } = await supabaseClient
      .from('wallets')
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq('user_id', user_id)
      .eq('currency', currency)

    if (updateError) {
      throw new Error(`Failed to update wallet balance: ${updateError.message}`)
    }

    // Create transaction record
    const transactionData = {
      user_id,
      transaction_type,
      amount: Math.abs(amount),
      status: 'completed',
      currency,
      reference_number: reference || `SYNC${Date.now()}`,
      description: `Wallet ${amount > 0 ? 'credit' : 'debit'} via ${transaction_type}`,
      service_type: transaction_type === 'credit' ? 'wallet_topup' : 'wallet_debit',
      provider_name: 'Flutterwave',
      metadata: metadata || {}
    }

    console.log('Creating transaction record:', transactionData)

    const { data: transaction, error: transactionError } = await supabaseClient
      .from('transactions')
      .insert(transactionData)
      .select()
      .single()

    if (transactionError) {
      console.error('Failed to create transaction record:', transactionError)
      // Don't fail the whole operation if transaction creation fails
    } else {
      console.log('Transaction record created:', transaction.id)
    }

    // Send notification
    try {
      await supabaseClient
        .from('notifications')
        .insert({
          user_id,
          title: amount > 0 ? 'Wallet Credited' : 'Wallet Debited',
          body: `Your wallet has been ${amount > 0 ? 'credited' : 'debited'} with ${currency} ${Math.abs(amount)}. New balance: ${currency} ${newBalance}`,
          type: 'transaction',
          metadata: {
            transaction_id: transaction?.id,
            amount,
            new_balance: newBalance
          }
        })
      
      console.log('Notification sent successfully')
    } catch (notificationError) {
      console.error('Failed to send notification:', notificationError)
    }

    console.log('Wallet sync completed successfully')

    return new Response(
      JSON.stringify({
        success: true,
        new_balance: newBalance,
        previous_balance: currentBalance,
        currency,
        transaction_id: transaction?.id,
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
