
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useReloadly = () => {
  const [loading, setLoading] = useState(false);

  const getOperators = async (countryCode: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('reloadly-services', {
        body: {
          action: 'get_operators',
          country_code: countryCode
        }
      });

      if (error) throw error;
      return data.operators || [];
    } catch (error) {
      console.error('Error fetching operators:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const detectOperator = async (phoneNumber: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('reloadly-services', {
        body: {
          action: 'detect_operator',
          phone_number: phoneNumber
        }
      });

      if (error) throw error;
      return data.operator;
    } catch (error) {
      console.error('Error detecting operator:', error);
      throw error;
    }
  };

  const topupAirtime = async (params: {
    operator_id: number;
    phone_number: string;
    amount: number;
    reference: string;
    country_code: string;
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke('reloadly-services', {
        body: {
          action: 'topup_airtime',
          ...params
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error processing airtime topup:', error);
      throw error;
    }
  };

  const topupData = async (params: {
    operator_id: number;
    phone_number: string;
    amount: number;
    reference: string;
    country_code: string;
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke('reloadly-services', {
        body: {
          action: 'topup_data',
          ...params
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error processing data topup:', error);
      throw error;
    }
  };

  const getGiftCardProducts = async (countryCode: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('reloadly-services', {
        body: {
          action: 'get_gift_card_products',
          country_code: countryCode
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching gift card products:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getOperators,
    detectOperator,
    topupAirtime,
    topupData,
    getGiftCardProducts
  };
};
