
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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { reference, service_type, service_data } = await req.json()

    console.log('Processing service delivery:', { reference, service_type, service_data })

    let result = {}

    switch (service_type) {
      case 'airtime':
        result = await processAirtimeService(supabaseClient, reference, service_data)
        break
      
      case 'data':
        result = await processDataService(supabaseClient, reference, service_data)
        break
      
      case 'electricity':
        result = await processElectricityService(supabaseClient, reference, service_data)
        break
      
      case 'water':
        result = await processWaterService(supabaseClient, reference, service_data)
        break
      
      case 'internet':
        result = await processInternetService(supabaseClient, reference, service_data)
        break
      
      case 'tv':
        result = await processTVService(supabaseClient, reference, service_data)
        break
      
      case 'gift_card':
        result = await processGiftCardService(supabaseClient, reference, service_data)
        break
      
      default:
        throw new Error(`Unsupported service type: ${service_type}`)
    }

    return new Response(
      JSON.stringify({ success: true, result }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Service processing error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

async function processAirtimeService(supabase: any, reference: string, serviceData: any) {
  console.log('Processing airtime service with Reloadly...')
  
  // Call Reloadly API for airtime
  const reloadlyResult = await callReloadlyService({
    action: 'topup_airtime',
    operator_id: serviceData.operator_id,
    phone_number: serviceData.phone_number,
    amount: serviceData.amount || 1000, // Default amount if not provided
    reference,
    country_code: serviceData.country_code || 'NG'
  })
  
  return reloadlyResult
}

async function processDataService(supabase: any, reference: string, serviceData: any) {
  console.log('Processing data service with Reloadly...')
  
  // Call Reloadly API for data
  const reloadlyResult = await callReloadlyService({
    action: 'topup_data',
    operator_id: serviceData.operator_id,
    phone_number: serviceData.phone_number,
    amount: serviceData.amount || 1000, // Default amount if not provided
    reference,
    country_code: serviceData.country_code || 'NG'
  })
  
  return reloadlyResult
}

async function processElectricityService(supabase: any, reference: string, serviceData: any) {
  console.log('Processing electricity service...')
  
  // In a real implementation, you would integrate with electricity providers' APIs
  // For now, we'll simulate the process
  await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
  
  return {
    success: true,
    message: `Electricity bill payment of ₦${serviceData.amount || 5000} processed for meter ${serviceData.meter_number}`,
    provider: serviceData.provider_name,
    reference
  }
}

async function processWaterService(supabase: any, reference: string, serviceData: any) {
  console.log('Processing water service...')
  
  // In a real implementation, you would integrate with water providers' APIs
  await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
  
  return {
    success: true,
    message: `Water bill payment of ₦${serviceData.amount || 3000} processed for account ${serviceData.account_number}`,
    provider: serviceData.provider_name,
    reference
  }
}

async function processInternetService(supabase: any, reference: string, serviceData: any) {
  console.log('Processing internet service...')
  
  // In a real implementation, you would integrate with ISP APIs
  await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
  
  return {
    success: true,
    message: `Internet subscription activated for device ${serviceData.device_id}`,
    provider: serviceData.provider_name,
    plan: serviceData.plan,
    reference
  }
}

async function processTVService(supabase: any, reference: string, serviceData: any) {
  console.log('Processing TV service...')
  
  // In a real implementation, you would integrate with TV providers' APIs
  await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
  
  return {
    success: true,
    message: `TV subscription activated for smart card ${serviceData.smart_card_number}`,
    provider: serviceData.provider_name,
    package: serviceData.package,
    reference
  }
}

async function processGiftCardService(supabase: any, reference: string, serviceData: any) {
  console.log('Processing gift card service with Reloadly...')
  
  // Call Reloadly Gift Card API
  const reloadlyResult = await callReloadlyGiftCardService({
    product_id: serviceData.product_id,
    recipient_email: serviceData.recipient_email,
    amount: serviceData.amount,
    reference,
    country_code: serviceData.country_code || 'NG'
  })
  
  return reloadlyResult
}

async function callReloadlyService(params: any) {
  const clientId = Deno.env.get('RELOADLY_CLIENT_ID')
  const clientSecret = Deno.env.get('RELOADLY_CLIENT_SECRET')
  
  if (!clientId || !clientSecret) {
    throw new Error('Reloadly credentials not configured')
  }

  // Get access token
  const tokenResponse = await fetch('https://auth.reloadly.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
      audience: 'https://topups.reloadly.com'
    })
  })

  if (!tokenResponse.ok) {
    throw new Error('Failed to get Reloadly access token')
  }

  const tokenData = await tokenResponse.json()
  const accessToken = tokenData.access_token

  // Make the actual topup request
  const topupResponse = await fetch('https://topups.reloadly.com/topups', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      operatorId: params.operator_id,
      amount: params.amount,
      useLocalAmount: true,
      customIdentifier: params.reference,
      recipientPhone: {
        countryCode: params.country_code,
        number: params.phone_number
      }
    })
  })
  
  if (!topupResponse.ok) {
    const errorData = await topupResponse.json()
    throw new Error(`Service delivery failed: ${errorData.message || 'Unknown error'}`)
  }
  
  return await topupResponse.json()
}

async function callReloadlyGiftCardService(params: any) {
  const clientId = Deno.env.get('RELOADLY_CLIENT_ID')
  const clientSecret = Deno.env.get('RELOADLY_CLIENT_SECRET')
  
  if (!clientId || !clientSecret) {
    throw new Error('Reloadly credentials not configured')
  }

  // Get gift card access token
  const tokenResponse = await fetch('https://auth.reloadly.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
      audience: 'https://giftcards.reloadly.com'
    })
  })

  if (!tokenResponse.ok) {
    throw new Error('Failed to get gift card access token')
  }

  const tokenData = await tokenResponse.json()
  const accessToken = tokenData.access_token

  // Order gift card
  const orderResponse = await fetch('https://giftcards.reloadly.com/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      productId: params.product_id,
      unitPrice: params.amount,
      quantity: 1,
      customIdentifier: params.reference,
      recipientEmail: params.recipient_email
    })
  })
  
  if (!orderResponse.ok) {
    const errorData = await orderResponse.json()
    throw new Error(`Gift card order failed: ${errorData.message || 'Unknown error'}`)
  }
  
  return await orderResponse.json()
}
