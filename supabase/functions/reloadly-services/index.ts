
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, ...params } = await req.json()
    
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

    let result = {}

    switch (action) {
      case 'get_operators':
        const operatorsResponse = await fetch(`https://topups.reloadly.com/operators/countries/${params.country_code}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!operatorsResponse.ok) {
          throw new Error('Failed to fetch operators')
        }
        
        const operators = await operatorsResponse.json()
        result = { operators }
        break

      case 'detect_operator':
        const detectResponse = await fetch(`https://topups.reloadly.com/operators/auto-detect/phone/${params.phone_number}/countries/NG`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!detectResponse.ok) {
          throw new Error('Failed to detect operator')
        }
        
        const operator = await detectResponse.json()
        result = { operator }
        break

      case 'topup_airtime':
        const airtimeResponse = await fetch('https://topups.reloadly.com/topups', {
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
        
        if (!airtimeResponse.ok) {
          const errorData = await airtimeResponse.json()
          throw new Error(`Airtime topup failed: ${errorData.message || 'Unknown error'}`)
        }
        
        result = await airtimeResponse.json()
        break

      case 'topup_data':
        // For data bundles, we use the same endpoint but with data-specific operators
        const dataResponse = await fetch('https://topups.reloadly.com/topups', {
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
        
        if (!dataResponse.ok) {
          const errorData = await dataResponse.json()
          throw new Error(`Data bundle failed: ${errorData.message || 'Unknown error'}`)
        }
        
        result = await dataResponse.json()
        break

      case 'get_gift_card_products':
        // Get gift card access token (different audience)
        const giftTokenResponse = await fetch('https://auth.reloadly.com/oauth/token', {
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

        if (!giftTokenResponse.ok) {
          throw new Error('Failed to get gift card access token')
        }

        const giftTokenData = await giftTokenResponse.json()
        const giftAccessToken = giftTokenData.access_token

        const productsResponse = await fetch(`https://giftcards.reloadly.com/products?countryCode=${params.country_code}&size=100`, {
          headers: {
            'Authorization': `Bearer ${giftAccessToken}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch gift card products')
        }
        
        result = await productsResponse.json()
        break

      default:
        throw new Error(`Unknown action: ${action}`)
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Reloadly service error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
