
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ServicePaymentData {
  service_type: string;
  amount: number;
  service_data: any;
}

export const useDirectServicePayment = () => {
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();

  const initializeServicePayment = async (paymentData: ServicePaymentData) => {
    if (!user || !profile) {
      toast({
        title: "Authentication Error",
        description: "Please log in to continue",
        variant: "destructive",
      });
      return null;
    }

    setLoading(true);

    try {
      console.log('Initializing service payment:', paymentData);

      // Get payment initialization data
      const { data: paymentResponse, error: paymentError } = await supabase.functions.invoke(
        'initialize-payment',
        {
          body: { 
            amount: paymentData.amount,
            metadata: {
              service_type: paymentData.service_type,
              service_data: paymentData.service_data
            }
          },
        }
      );

      if (paymentError) {
        console.error('Payment initialization error:', paymentError);
        throw new Error(`Payment initialization failed: ${paymentError.message}`);
      }

      if (!paymentResponse || !paymentResponse.success) {
        throw new Error(paymentResponse?.error || 'Failed to initialize payment');
      }

      // Load Flutterwave script if not already loaded
      if (!window.FlutterwaveCheckout) {
        await loadFlutterwaveScript();
      }

      return new Promise((resolve, reject) => {
        console.log('Opening Flutterwave checkout for service payment');
        
        let paymentProcessed = false;
        
        window.FlutterwaveCheckout({
          ...paymentResponse.paymentData,
          customizations: {
            ...paymentResponse.paymentData.customizations,
            title: `${paymentData.service_type.charAt(0).toUpperCase() + paymentData.service_type.slice(1)} Purchase`,
            description: `Pay for ${paymentData.service_type} service`,
          },
          callback: async (response: any) => {
            console.log('Service payment callback:', response);
            
            if (paymentProcessed) {
              console.log('Payment already processed, ignoring duplicate callback');
              return;
            }
            paymentProcessed = true;
            
            if (response.status === 'successful' || response.status === 'completed') {
              try {
                console.log('Processing service delivery...');
                
                // Process the service delivery
                const serviceResult = await supabase.functions.invoke('process-service-payment', {
                  body: {
                    amount: paymentData.amount,
                    service_type: paymentData.service_type,
                    service_data: paymentData.service_data,
                    payment_reference: response.transaction_id?.toString() || response.flw_ref,
                    user_id: user.id,
                    flutterwave_response: response
                  }
                });

                console.log('Service processing result:', serviceResult);

                if (serviceResult.error || !serviceResult.data?.success) {
                  throw new Error(serviceResult.data?.error || 'Service delivery failed');
                }

                toast({
                  title: "Payment & Service Successful!",
                  description: `Your ${paymentData.service_type} has been delivered successfully.`,
                  duration: 5000,
                });

                resolve(response);
              } catch (error) {
                console.error('Service delivery error:', error);
                toast({
                  title: "Payment Successful - Service Failed",
                  description: "Payment was processed but service delivery failed. Please contact support.",
                  variant: "destructive",
                });
                reject(error);
              }
            } else {
              console.log('Payment failed or cancelled:', response.status);
              toast({
                title: "Payment Failed",
                description: "Your payment could not be processed. Please try again.",
                variant: "destructive",
              });
              reject(new Error('Payment failed'));
            }
          },
          onclose: () => {
            console.log('Payment modal closed');
            if (!paymentProcessed) {
              resolve(null);
            }
          },
        });
      });

    } catch (error) {
      console.error('Service payment error:', error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Could not initialize payment. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadFlutterwaveScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="flutterwave"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.flutterwave.com/v3.js';
      script.async = true;
      script.onload = () => {
        console.log('Flutterwave script loaded successfully');
        resolve();
      };
      script.onerror = () => {
        console.error('Failed to load Flutterwave script');
        reject(new Error('Failed to load Flutterwave script'));
      };
      document.head.appendChild(script);
    });
  };

  return {
    initializeServicePayment,
    loading,
  };
};
