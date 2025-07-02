
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LoanProvider {
  id: string;
  name: string;
  api_endpoint?: string;
  api_key_required: boolean;
}

interface LoanApplication {
  id: string;
  user_id: string;
  provider_id: string;
  amount: number;
  tenure_months: number;
  interest_rate: number;
  purpose: string;
  employment_status: string;
  monthly_income: number;
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

    const { application_id } = await req.json()

    if (!application_id) {
      throw new Error('Missing application_id')
    }

    console.log(`Processing loan application: ${application_id}`)

    // Get loan application details
    const { data: application, error: appError } = await supabaseClient
      .from('loan_applications')
      .select(`
        *,
        loan_providers (
          id,
          name,
          api_endpoint,
          api_key_required
        )
      `)
      .eq('id', application_id)
      .single()

    if (appError || !application) {
      console.error('Loan application not found:', appError)
      throw new Error('Loan application not found')
    }

    const provider = application.loan_providers as LoanProvider
    let integrationResult = null

    // Check if provider has real API integration
    if (provider.api_endpoint && provider.api_key_required) {
      console.log(`Processing with real provider API: ${provider.name}`)
      
      // Get the API key from Supabase secrets using the provider name
      const apiKeyName = `${provider.name.toUpperCase().replace(/\s+/g, '_')}_API_KEY`
      const apiKey = Deno.env.get(apiKeyName)
      
      if (!apiKey) {
        console.error(`API key not found for provider: ${provider.name}. Expected secret: ${apiKeyName}`)
        // Fall back to simulation if API key is missing
        integrationResult = { error: 'API key not configured', fallback: true }
      } else {
        try {
          console.log(`Making API call to: ${provider.api_endpoint}`)
          
          const providerResponse = await fetch(provider.api_endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
              'X-API-Key': apiKey, // Some providers use this header instead
            },
            body: JSON.stringify({
              applicant_id: application.user_id,
              loan_amount: application.amount,
              tenure_months: application.tenure_months,
              purpose: application.purpose,
              employment_status: application.employment_status,
              monthly_income: application.monthly_income,
              interest_rate: application.interest_rate,
              // Add additional fields that might be required by real providers
              application_reference: application_id,
              callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/loan_callback`
            })
          })

          if (providerResponse.ok) {
            integrationResult = await providerResponse.json()
            console.log('Provider API response:', integrationResult)
          } else {
            const errorText = await providerResponse.text()
            console.error(`Provider API error: ${providerResponse.status} - ${errorText}`)
            integrationResult = { error: 'Provider API unavailable', fallback: true }
          }
        } catch (apiError) {
          console.error('Provider integration error:', apiError)
          integrationResult = { error: 'Integration failed', fallback: true }
        }
      }
    }

    // Determine application status based on integration result
    let newStatus = 'pending'
    let providerReference = null
    let rejectionReason = null

    if (integrationResult && !integrationResult.fallback) {
      // Handle real provider response
      if (integrationResult.approved || integrationResult.status === 'approved') {
        newStatus = 'approved'
        providerReference = integrationResult.reference_id || integrationResult.loan_id
      } else if (integrationResult.rejected || integrationResult.status === 'rejected') {
        newStatus = 'rejected'
        rejectionReason = integrationResult.reason || integrationResult.rejection_reason || 'Application did not meet provider criteria'
      } else if (integrationResult.status === 'pending') {
        newStatus = 'pending'
        providerReference = integrationResult.reference_id || integrationResult.application_id
      }
    } else {
      // Fallback to simulation for providers without real-time integration
      console.log(`Using simulation for provider: ${provider.name}`)
      
      const creditworthiness = calculateCreditworthiness(application)
      console.log(`Calculated creditworthiness score: ${creditworthiness}`)
      
      if (creditworthiness >= 70) {
        newStatus = 'approved'
        providerReference = `SIM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      } else if (creditworthiness >= 40) {
        newStatus = 'pending' // Needs manual review
      } else {
        newStatus = 'rejected'
        rejectionReason = 'Insufficient creditworthiness for automated approval'
      }
    }

    console.log(`Updating application status to: ${newStatus}`)

    // Update application status
    const { error: updateError } = await supabaseClient
      .from('loan_applications')
      .update({
        status: newStatus,
        provider_reference: providerReference,
        rejection_reason: rejectionReason,
        updated_at: new Date().toISOString()
      })
      .eq('id', application_id)

    if (updateError) {
      console.error('Failed to update application status:', updateError)
      throw new Error('Failed to update application status')
    }

    // Send notification to user
    const notificationTitle = newStatus === 'approved' 
      ? 'Loan Application Approved!' 
      : newStatus === 'rejected' 
      ? 'Loan Application Update' 
      : 'Loan Application Under Review'

    const notificationBody = newStatus === 'approved'
      ? `Great news! Your loan application for ₦${application.amount.toLocaleString()} has been approved by ${provider.name}.`
      : newStatus === 'rejected'
      ? `Your loan application with ${provider.name} requires additional documentation. Please check your loan history for details.`
      : `Your loan application with ${provider.name} is being reviewed. We'll notify you of any updates.`

    await supabaseClient.functions.invoke('send_notification', {
      body: {
        user_id: application.user_id,
        title: notificationTitle,
        body: notificationBody,
        type: 'loan',
        metadata: {
          application_id: application_id,
          status: newStatus,
          provider_name: provider.name
        }
      }
    })

    console.log(`Notification sent for application: ${application_id}`)

    return new Response(
      JSON.stringify({
        success: true,
        application_id: application_id,
        status: newStatus,
        provider_reference: providerReference,
        integration_used: !!provider.api_endpoint,
        creditworthiness_score: integrationResult?.fallback ? calculateCreditworthiness(application) : null
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Process loan application error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

function calculateCreditworthiness(application: any): number {
  let score = 0
  
  // Income-to-loan ratio (40 points max)
  const incomeRatio = (application.monthly_income * 12) / application.amount
  if (incomeRatio >= 3) score += 40
  else if (incomeRatio >= 2) score += 30
  else if (incomeRatio >= 1.5) score += 20
  else if (incomeRatio >= 1) score += 10
  
  // Employment status (30 points max)
  switch (application.employment_status) {
    case 'employed': score += 30; break
    case 'business_owner': score += 25; break
    case 'self_employed': score += 20; break
    case 'student': score += 10; break
    default: score += 0
  }
  
  // Loan purpose (20 points max)
  switch (application.purpose) {
    case 'business': score += 20; break
    case 'education': score += 18; break
    case 'home_improvement': score += 15; break
    case 'medical': score += 12; break
    case 'debt_consolidation': score += 10; break
    case 'personal': score += 8; break
    default: score += 0
  }
  
  // Loan amount vs tenure (10 points max)
  const monthlyPayment = application.amount / application.tenure_months
  const paymentToIncomeRatio = monthlyPayment / application.monthly_income
  if (paymentToIncomeRatio <= 0.3) score += 10
  else if (paymentToIncomeRatio <= 0.4) score += 7
  else if (paymentToIncomeRatio <= 0.5) score += 4
  
  return Math.min(score, 100)
}
