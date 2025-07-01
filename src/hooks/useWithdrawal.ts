
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useWithdrawal = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const processWithdrawal = async (step: 'verify_pin' | 'verify_otp_and_withdraw', data: {
    pin?: string;
    amount: number;
    bank_account_id: string;
    otp_code?: string;
  }) => {
    if (!user) return { error: 'User not authenticated' };

    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('process-withdrawal', {
        body: {
          action: step,
          user_id: user.id,
          pin: data.pin,
          amount: data.amount,
          bank_account_id: data.bank_account_id,
          otp_code: data.otp_code
        }
      });

      if (error) {
        console.error('Withdrawal error:', error);
        return { error: error.message };
      }

      if (!result.success) {
        return { error: result.error };
      }

      return { data: result, error: null };
    } catch (error: any) {
      console.error('Withdrawal processing error:', error);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    processWithdrawal,
    loading
  };
};
