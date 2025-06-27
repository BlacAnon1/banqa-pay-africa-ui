
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface PayBillData {
  service_type: string;
  provider_name: string;
  amount: number;
  customer_data: Record<string, any>;
  reference_id?: string;
}

export interface VerifyServiceData {
  service_type: string;
  provider_name: string;
  customer_data: Record<string, any>;
}

export const useBillPayment = () => {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const verifyServiceInput = async (data: VerifyServiceData) => {
    setVerifying(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('verify_service_input', {
        body: data
      });

      if (error) throw error;

      return { data: result, error: null };
    } catch (error: any) {
      console.error('Service verification error:', error);
      return { data: null, error: error.message };
    } finally {
      setVerifying(false);
    }
  };

  const payBill = async (data: PayBillData) => {
    setLoading(true);
    try {
      const reference_id = data.reference_id || `PAY${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      
      const { data: result, error } = await supabase.functions.invoke('pay_bill', {
        body: {
          ...data,
          reference_id
        }
      });

      if (error) throw error;

      if (result.success) {
        toast({
          title: "Payment Successful",
          description: result.message,
        });
      } else {
        toast({
          title: "Payment Failed",
          description: result.message,
          variant: "destructive",
        });
      }

      return { data: result, error: null };
    } catch (error: any) {
      console.error('Bill payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    payBill,
    verifyServiceInput,
    loading,
    verifying
  };
};
