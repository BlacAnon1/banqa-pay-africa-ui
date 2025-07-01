
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ServicePaymentData {
  service_type: string;
  amount: number;
  service_data: Record<string, any>;
}

export const useDirectServicePayment = () => {
  const [processing, setProcessing] = useState(false);

  const initializeServicePayment = async (paymentData: ServicePaymentData) => {
    setProcessing(true);
    
    try {
      console.log('Initializing service payment:', paymentData);
      
      // First, initialize the payment with Flutterwave
      const { data: paymentResult, error: paymentError } = await supabase.functions.invoke('initialize-payment', {
        body: {
          amount: paymentData.amount,
          service_type: paymentData.service_type,
          service_data: paymentData.service_data,
          redirect_url: `${window.location.origin}/payment-success`
        }
      });

      if (paymentError) {
        throw new Error(paymentError.message || 'Failed to initialize payment');
      }

      if (paymentResult.payment_link) {
        // Redirect to payment page
        window.location.href = paymentResult.payment_link;
      } else {
        throw new Error('No payment link received');
      }
      
    } catch (error) {
      console.error('Payment initialization failed:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setProcessing(false);
    }
  };

  const processServiceAfterPayment = async (reference: string, serviceType: string, serviceData: any) => {
    try {
      console.log('Processing service delivery after payment:', { reference, serviceType, serviceData });
      
      // Call the appropriate service delivery function based on service type
      const { data: result, error } = await supabase.functions.invoke('process-service-payment', {
        body: {
          reference,
          service_type: serviceType,
          service_data: serviceData
        }
      });

      if (error) {
        throw new Error(error.message || 'Service delivery failed');
      }

      return result;
    } catch (error) {
      console.error('Service delivery failed:', error);
      throw error;
    }
  };

  return {
    processing,
    initializeServicePayment,
    processServiceAfterPayment
  };
};
