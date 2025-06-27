
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

    const { service_type, provider_name, customer_data } = await req.json()

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

    // Validate customer data against service requirements
    const inputFields = service.input_fields || []
    const validationResult = validateCustomerData(inputFields, customer_data)

    if (!validationResult.valid) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: validationResult.error,
          missing_fields: validationResult.missing_fields
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Simulate verification with service provider
    const verificationResult = await simulateServiceVerification(service, customer_data)

    return new Response(
      JSON.stringify({
        valid: verificationResult.valid,
        customer_info: verificationResult.customer_info,
        amount_due: verificationResult.amount_due,
        message: verificationResult.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Verify service input error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

function validateCustomerData(inputFields: any[], customerData: any) {
  const missing_fields = []
  
  for (const field of inputFields) {
    if (field.required && (!customerData[field.name] || customerData[field.name].trim() === '')) {
      missing_fields.push(field.name)
    }
  }

  if (missing_fields.length > 0) {
    return {
      valid: false,
      error: 'Missing required fields',
      missing_fields
    }
  }

  return { valid: true }
}

async function simulateServiceVerification(service: any, customerData: any) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Simulate verification result (95% success rate)
  const valid = Math.random() > 0.05
  
  if (!valid) {
    return {
      valid: false,
      message: 'Customer information not found or invalid'
    }
  }

  // Generate mock customer info
  const customerInfo = {
    name: 'John Doe',
    address: '123 Main Street, Lagos',
    account_status: 'Active'
  }

  const amountDue = Math.floor(Math.random() * 50000) + 1000 // Random amount between 1000 and 51000

  return {
    valid: true,
    customer_info: customerInfo,
    amount_due: amountDue,
    message: 'Customer information verified successfully'
  }
}
