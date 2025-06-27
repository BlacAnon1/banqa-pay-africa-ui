
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

    const { user_id, title, body, type = 'system', metadata } = await req.json()

    if (!user_id || !title || !body) {
      throw new Error('Missing required fields: user_id, title, body')
    }

    // Create notification
    const { data: notification, error: notificationError } = await supabaseClient
      .from('notifications')
      .insert({
        user_id,
        title,
        body,
        type,
        read: false
      })
      .select()
      .single()

    if (notificationError) {
      throw new Error('Failed to create notification')
    }

    // Send real-time notification via Supabase Realtime
    // The notification will be automatically sent to subscribed clients
    // due to our realtime setup on the notifications table

    return new Response(
      JSON.stringify({
        success: true,
        notification_id: notification.id,
        message: 'Notification sent successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Send notification error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
