
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
    const { action, access_token, country_code = 'NG', ...params } = await req.json()

    if (!access_token) {
      throw new Error('Access token required')
    }

    console.log('Reloadly services request:', { action, country_code, params })

    let apiUrl = ''
    let requestOptions: RequestInit = {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      }
    }

    switch (action) {
      case 'get_operators':
        // Get airtime operators for country
        apiUrl = `https://topups.reloadly.com/operators/countries/${country_code}`
        requestOptions.method = 'GET'
        break

      case 'get_data_operators':
        // Get data operators for country
        apiUrl = `https://topups.reloadly.com/operators/countries/${country_code}?includeData=true`
        requestOptions.method = 'GET'
        break

      case 'get_operator_by_phone':
        // Auto-detect operator by phone number
        apiUrl = `https://topups.reloadly.com/operators/auto-detect/phone/${params.phone_number}/countries/${country_code}`
        requestOptions.method = 'GET'
        break

      case 'topup_airtime':
        // Send airtime topup
        apiUrl = 'https://topups.reloadly.com/topups'
        requestOptions.method = 'POST'
        requestOptions.body = JSON.stringify({
          operatorId: params.operator_id,
          amount: params.amount,
          useLocalAmount: false,
          customIdentifier: params.reference,
          recipientPhone: {
            countryCode: params.country_code || 'NG',
            number: params.phone_number
          }
        })
        break

      case 'topup_data':
        // Send data bundle
        apiUrl = 'https://topups.reloadly.com/topups'
        requestOptions.method = 'POST'
        requestOptions.body = JSON.stringify({
          operatorId: params.operator_id,
          amount: params.amount,
          useLocalAmount: false,
          customIdentifier: params.reference,
          recipientPhone: {
            countryCode: params.country_code || 'NG',
            number: params.phone_number
          }
        })
        break

      case 'get_gift_card_products':
        // Get gift card products for country
        apiUrl = `https://giftcards.reloadly.com/products?countryCode=${country_code}&page=1&size=200`
        requestOptions.method = 'GET'
        requestOptions.headers = {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        }
        break

      case 'order_gift_card':
        // Order a gift card
        apiUrl = 'https://giftcards.reloadly.com/orders'
        requestOptions.method = 'POST'
        requestOptions.body = JSON.stringify({
          productId: params.product_id,
          countryCode: params.country_code || 'NG',
          quantity: params.quantity || 1,
          unitPrice: params.amount,
          customIdentifier: params.reference,
          recipientEmail: params.recipient_email
        })
        requestOptions.headers = {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        }
        break

      default:
        throw new Error(`Unknown action: ${action}`)
    }

    console.log('Making Reloadly API request to:', apiUrl)

    const response = await fetch(apiUrl, requestOptions)
    const responseText = await response.text()

    console.log('Reloadly API response status:', response.status)
    console.log('Reloadly API response:', responseText)

    if (!response.ok) {
      throw new Error(`Reloadly API error: ${response.status} - ${responseText}`)
    }

    const data = JSON.parse(responseText)

    return new Response(
      JSON.stringify({
        success: true,
        data
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Reloadly services error:', error)
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
