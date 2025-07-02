
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
      sender_id, 
      recipient_id, 
      amount, 
      sender_currency = 'NGN',
      recipient_currency = 'NGN',
      description 
    } = await req.json()

    console.log('Processing cross-border money transfer:', { 
      sender_id, recipient_id, amount, sender_currency, recipient_currency 
    })

    if (!sender_id || !recipient_id || !amount) {
      throw new Error('Missing required fields: sender_id, recipient_id, amount')
    }

    // Get sender's wallet
    const { data: senderWallet, error: senderWalletError } = await supabaseClient
      .from('wallets')
      .select('*')
      .eq('user_id', sender_id)
      .eq('currency', sender_currency)
      .single()

    if (senderWalletError) {
      throw new Error(`Sender wallet not found: ${senderWalletError.message}`)
    }

    // Get exchange rates for cross-border transfers
    const { data: senderCurrency, error: senderCurrencyError } = await supabaseClient
      .from('currencies')
      .select('*')
      .eq('code', sender_currency)
      .single()

    const { data: recipientCurrency, error: recipientCurrencyError } = await supabaseClient
      .from('currencies')
      .select('*')
      .eq('code', recipient_currency)
      .single()

    if (senderCurrencyError || recipientCurrencyError) {
      throw new Error('Invalid currency codes for cross-border transfer')
    }

    // Calculate conversion for cross-border transfer
    const exchangeRate = recipientCurrency.exchange_rate_to_base / senderCurrency.exchange_rate_to_base
    const transferFee = amount * 0.01 // 1% fee (competitive with traditional bureau de change)
    const totalDeduction = amount + transferFee
    const convertedAmount = amount * exchangeRate

    console.log('Cross-border transfer calculations:', {
      exchangeRate,
      transferFee,
      totalDeduction,
      convertedAmount,
      senderBalance: senderWallet.balance,
      route: `${senderCurrency.country} -> ${recipientCurrency.country}`
    })

    // Check if sender has sufficient balance
    if (senderWallet.balance < totalDeduction) {
      throw new Error('Insufficient balance for cross-border transfer')
    }

    // Get or create recipient wallet in their preferred currency
    let { data: recipientWallet, error: recipientWalletError } = await supabaseClient
      .from('wallets')
      .select('*')
      .eq('user_id', recipient_id)
      .eq('currency', recipient_currency)
      .single()

    if (recipientWalletError && recipientWalletError.code === 'PGRST116') {
      // Create recipient wallet if it doesn't exist
      console.log('Creating multi-currency wallet for recipient:', recipient_id, recipient_currency)
      const { data: newWallet, error: createError } = await supabaseClient
        .from('wallets')
        .insert({ 
          user_id: recipient_id, 
          balance: 0, 
          currency: recipient_currency 
        })
        .select()
        .single()

      if (createError) {
        throw new Error(`Failed to create recipient wallet: ${createError.message}`)
      }

      recipientWallet = newWallet
    } else if (recipientWalletError) {
      throw new Error(`Recipient wallet error: ${recipientWalletError.message}`)
    }

    const referenceNumber = `CBT${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    const isCrossBorder = sender_currency !== recipient_currency

    // Create transfer record with cross-border details
    const { data: transfer, error: transferError } = await supabaseClient
      .from('money_transfers')
      .insert({
        sender_id,
        recipient_id,
        sender_currency,
        recipient_currency,
        amount_sent: amount,
        amount_received: convertedAmount,
        exchange_rate: exchangeRate,
        transfer_fee: transferFee,
        status: 'completed',
        reference_number: referenceNumber,
        description: description || (isCrossBorder ? 
          `Cross-border transfer from ${senderCurrency.country} to ${recipientCurrency.country}` : 
          'Money transfer'),
        processed_at: new Date().toISOString()
      })
      .select()
      .single()

    if (transferError) {
      throw new Error(`Failed to create transfer record: ${transferError.message}`)
    }

    // Update sender wallet (deduct amount + fee)
    const { error: senderUpdateError } = await supabaseClient
      .from('wallets')
      .update({ 
        balance: senderWallet.balance - totalDeduction,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', sender_id)
      .eq('currency', sender_currency)

    if (senderUpdateError) {
      throw new Error(`Failed to update sender wallet: ${senderUpdateError.message}`)
    }

    // Update recipient wallet (add converted amount)
    const { error: recipientUpdateError } = await supabaseClient
      .from('wallets')
      .update({ 
        balance: recipientWallet.balance + convertedAmount,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', recipient_id)
      .eq('currency', recipient_currency)

    if (recipientUpdateError) {
      throw new Error(`Failed to update recipient wallet: ${recipientUpdateError.message}`)
    }

    // Create enhanced transaction records for both parties
    const transactions = [
      {
        user_id: sender_id,
        transaction_type: isCrossBorder ? 'cross_border_transfer_sent' : 'money_transfer_sent',
        amount: -totalDeduction,
        status: 'completed',
        currency: sender_currency,
        reference_number: referenceNumber,
        description: isCrossBorder ? 
          `Cross-border transfer to ${recipientCurrency.country} (Rate: ${exchangeRate.toFixed(4)})` :
          `Money transfer to recipient`,
        service_type: 'money_transfer',
        provider_name: 'Banqa Cross-Border',
        metadata: {
          transfer_id: transfer.id,
          recipient_id,
          original_amount: amount,
          transfer_fee: transferFee,
          recipient_currency,
          converted_amount: convertedAmount,
          exchange_rate: exchangeRate,
          is_cross_border: isCrossBorder,
          sender_country: senderCurrency.country,
          recipient_country: recipientCurrency.country
        }
      },
      {
        user_id: recipient_id,
        transaction_type: isCrossBorder ? 'cross_border_transfer_received' : 'money_transfer_received',
        amount: convertedAmount,
        status: 'completed',
        currency: recipient_currency,
        reference_number: referenceNumber,
        description: isCrossBorder ?
          `Cross-border transfer from ${senderCurrency.country} (Rate: ${exchangeRate.toFixed(4)})` :
          `Money transfer from sender`,
        service_type: 'money_transfer',
        provider_name: 'Banqa Cross-Border',
        metadata: {
          transfer_id: transfer.id,
          sender_id,
          original_amount: amount,
          sender_currency,
          exchange_rate: exchangeRate,
          is_cross_border: isCrossBorder,
          sender_country: senderCurrency.country,
          recipient_country: recipientCurrency.country
        }
      }
    ]

    const { error: transactionError } = await supabaseClient
      .from('transactions')
      .insert(transactions)

    if (transactionError) {
      console.error('Failed to create transaction records:', transactionError)
    }

    // Send enhanced notifications for cross-border transfers
    try {
      const notificationMessages = isCrossBorder ? [
        {
          user_id: sender_id,
          title: '🌍 Cross-Border Transfer Successful',
          body: `You sent ${sender_currency} ${amount} to ${recipientCurrency.country}. Recipient received ${recipient_currency} ${convertedAmount.toFixed(2)}. Total deducted: ${sender_currency} ${totalDeduction.toFixed(2)}`,
          type: 'cross_border_transfer'
        },
        {
          user_id: recipient_id,
          title: '🌍 International Funds Received',
          body: `You received ${recipient_currency} ${convertedAmount.toFixed(2)} from ${senderCurrency.country} via Banqa's borderless finance network`,
          type: 'cross_border_transfer'
        }
      ] : [
        {
          user_id: sender_id,
          title: 'Money Sent Successfully',
          body: `You sent ${sender_currency} ${amount} to recipient. Total deducted: ${sender_currency} ${totalDeduction.toFixed(2)}`,
          type: 'money_transfer'
        },
        {
          user_id: recipient_id,
          title: 'Money Received',
          body: `You received ${recipient_currency} ${convertedAmount.toFixed(2)} from sender`,
          type: 'money_transfer'
        }
      ]

      await supabaseClient
        .from('notifications')
        .insert(notificationMessages)
    } catch (notificationError) {
      console.error('Failed to send notifications:', notificationError)
    }

    console.log('Cross-border money transfer completed successfully:', {
      isCrossBorder,
      route: `${senderCurrency.country} -> ${recipientCurrency.country}`,
      exchangeRate,
      savings: `Saved ~${(amount * 0.05).toFixed(2)} vs traditional bureau de change`
    })

    return new Response(
      JSON.stringify({
        success: true,
        transfer_id: transfer.id,
        reference_number: referenceNumber,
        amount_sent: amount,
        amount_received: convertedAmount,
        exchange_rate: exchangeRate,
        transfer_fee: transferFee,
        is_cross_border: isCrossBorder,
        sender_country: senderCurrency.country,
        recipient_country: recipientCurrency.country,
        message: isCrossBorder ? 
          `Cross-border transfer completed successfully from ${senderCurrency.country} to ${recipientCurrency.country}` :
          'Money transfer completed successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Cross-border money transfer error:', error)
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
