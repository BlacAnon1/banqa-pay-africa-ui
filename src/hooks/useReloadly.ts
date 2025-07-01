
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useReloadly = () => {
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const getAccessToken = async () => {
    if (accessToken) return accessToken;

    try {
      setLoading(true);
      console.log('Getting Reloadly access token...');

      const { data, error } = await supabase.functions.invoke('reloadly-auth');

      if (error) {
        console.error('Auth error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      setAccessToken(data.access_token);
      console.log('Reloadly access token obtained');
      return data.access_token;
    } catch (error) {
      console.error('Failed to get access token:', error);
      toast({
        title: "Service Error",
        description: "Failed to connect to service provider. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getOperators = async (countryCode = 'NG') => {
    try {
      const token = await getAccessToken();
      
      const { data, error } = await supabase.functions.invoke('reloadly-services', {
        body: {
          action: 'get_operators',
          access_token: token,
          country_code: countryCode
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      return data.data;
    } catch (error) {
      console.error('Failed to get operators:', error);
      throw error;
    }
  };

  const detectOperator = async (phoneNumber: string, countryCode = 'NG') => {
    try {
      const token = await getAccessToken();
      
      const { data, error } = await supabase.functions.invoke('reloadly-services', {
        body: {
          action: 'get_operator_by_phone',
          access_token: token,
          phone_number: phoneNumber,
          country_code: countryCode
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      return data.data;
    } catch (error) {
      console.error('Failed to detect operator:', error);
      return null;
    }
  };

  const topupAirtime = async (params: {
    operator_id: number;
    phone_number: string;
    amount: number;
    reference: string;
    country_code?: string;
  }) => {
    try {
      const token = await getAccessToken();
      
      const { data, error } = await supabase.functions.invoke('reloadly-services', {
        body: {
          action: 'topup_airtime',
          access_token: token,
          ...params
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      return data.data;
    } catch (error) {
      console.error('Failed to send airtime:', error);
      throw error;
    }
  };

  const getGiftCardProducts = async (countryCode = 'NG') => {
    try {
      const token = await getAccessToken();
      
      const { data, error } = await supabase.functions.invoke('reloadly-services', {
        body: {
          action: 'get_gift_card_products',
          access_token: token,
          country_code: countryCode
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      return data.data;
    } catch (error) {
      console.error('Failed to get gift card products:', error);
      throw error;
    }
  };

  return {
    loading,
    getOperators,
    detectOperator,
    topupAirtime,
    getGiftCardProducts
  };
};
