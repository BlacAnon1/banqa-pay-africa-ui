
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { action, user_id, pin, amount, bank_account_id, otp_code } = await req.json()

    console.log('Withdrawal request:', { action, user_id, amount, bank_account_id })

    // Get user profile for email
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('email, full_name')
      .eq('id', user_id)
      .single()

    if (profileError || !profile) {
      throw new Error('User profile not found')
    }

    if (action === 'verify_pin') {
      // Verify withdrawal PIN
      const { data: pinData, error: pinError } = await supabaseClient
        .from('withdrawal_pins')
        .select('pin_hash')
        .eq('user_id', user_id)
        .single()

      if (pinError || !pinData) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Withdrawal PIN not set. Please create a PIN first.' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        })
      }

      // In a real app, you'd use proper password hashing like bcrypt
      // For this demo, we're using simple string comparison
      if (pinData.pin_hash !== pin) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Invalid withdrawal PIN' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        })
      }

      // Generate OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

      // Store OTP
      const { error: otpError } = await supabaseClient
        .from('withdrawal_otps')
        .insert({
          user_id,
          otp_code: otpCode,
          withdrawal_amount: amount,
          bank_account_id,
          expires_at: expiresAt.toISOString()
        })

      if (otpError) {
        throw new Error('Failed to generate OTP')
      }

      // Send OTP via email
      try {
        await resend.emails.send({
          from: "Banqa <onboarding@resend.dev>",
          to: [profile.email],
          subject: "Withdrawal Verification Code",
          html: `
            <h2>Withdrawal Verification</h2>
            <p>Hello ${profile.full_name},</p>
            <p>You requested to withdraw ₦${Number(amount).toLocaleString()} from your Banqa wallet.</p>
            <p>Your verification code is: <strong>${otpCode}</strong></p>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this withdrawal, please contact support immediately.</p>
            <p>Best regards,<br>Banqa Team</p>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send OTP email:', emailError)
        // Continue anyway, OTP is stored in database
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'OTP sent to your email address' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })

    } else if (action === 'verify_otp_and_withdraw') {
      // Verify OTP and process withdrawal
      const { data: otpData, error: otpError } = await supabaseClient
        .from('withdrawal_otps')
        .select('*')
        .eq('user_id', user_id)
        .eq('otp_code', otp_code)
        .eq('withdrawal_amount', amount)
        .eq('bank_account_id', bank_account_id)
        .eq('is_used', false)
        .gte('expires_at', new Date().toISOString())
        .single()

      if (otpError || !otpData) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Invalid or expired OTP code' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        })
      }

      // Mark OTP as used
      await supabaseClient
        .from('withdrawal_otps')
        .update({ is_used: true })
        .eq('id', otpData.id)

      // Get user wallet
      const { data: wallet, error: walletError } = await supabaseClient
        .from('wallets')
        .select('balance')
        .eq('user_id', user_id)
        .eq('currency', 'NGN')
        .single()

      if (walletError || !wallet) {
        throw new Error('Wallet not found')
      }

      if (wallet.balance < amount) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Insufficient wallet balance' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        })
      }

      // Create withdrawal request
      const referenceNumber = `WD${Date.now()}`
      const { data: withdrawalRequest, error: withdrawalError } = await supabaseClient
        .from('withdrawal_requests')
        .insert({
          user_id,
          bank_account_id,
          amount,
          reference_number: referenceNumber,
          status: 'processing',
          otp_verified: true,
          pin_verified: true
        })
        .select()
        .single()

      if (withdrawalError) {
        throw new Error('Failed to create withdrawal request')
      }

      // Deduct from wallet
      const newBalance = wallet.balance - amount
      await supabaseClient
        .from('wallets')
        .update({ balance: newBalance })
        .eq('user_id', user_id)
        .eq('currency', 'NGN')

      // Create transaction record
      await supabaseClient
        .from('transactions')
        .insert({
          user_id,
          transaction_type: 'debit',
          amount: amount,
          currency: 'NGN',
          status: 'completed',
          reference_number: referenceNumber,
          description: `Withdrawal to bank account`,
          service_type: 'wallet_withdrawal'
        })

      // Send confirmation email
      try {
        await resend.emails.send({
          from: "Banqa <onboarding@resend.dev>",
          to: [profile.email],
          subject: "Withdrawal Request Processed",
          html: `
            <h2>Withdrawal Processed</h2>
            <p>Hello ${profile.full_name},</p>
            <p>Your withdrawal request has been processed successfully.</p>
            <p><strong>Amount:</strong> ₦${Number(amount).toLocaleString()}</p>
            <p><strong>Reference:</strong> ${referenceNumber}</p>
            <p>The funds will be credited to your bank account within 24 hours.</p>
            <p>Best regards,<br>Banqa Team</p>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError)
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Withdrawal processed successfully',
        reference_number: referenceNumber
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Invalid action' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })

  } catch (error) {
    console.error('Withdrawal processing error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
