
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
    const clientId = Deno.env.get('RELOADLY_CLIENT_ID')
    const clientSecret = Deno.env.get('RELOADLY_CLIENT_SECRET')

    if (!clientId || !clientSecret) {
      throw new Error('Reloadly credentials not configured')
    }

    console.log('Getting Reloadly access token...')

    const authResponse = await fetch('https://auth.reloadly.com/oauth/token', {
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

    if (!authResponse.ok) {
      const errorText = await authResponse.text()
      console.error('Reloadly auth error:', errorText)
      throw new Error(`Authentication failed: ${authResponse.status}`)
    }

    const authData = await authResponse.json()
    console.log('Reloadly auth successful')

    return new Response(
      JSON.stringify({
        success: true,
        access_token: authData.access_token,
        expires_in: authData.expires_in
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Reloadly auth error:', error)
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
