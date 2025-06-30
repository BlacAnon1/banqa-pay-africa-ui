
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/hooks/useWallet';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useFlutterwavePayment = () => {
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();
  const { syncWallet } = useWallet();

  const initializePayment = async (amount: number) => {
    if (!user || !profile) {
      toast({
        title: "Authentication Error",
        description: "Please log in to add funds",
        variant: "destructive",
      });
      return null;
    }

    setLoading(true);

    try {
      console.log('Initializing payment for user:', user.id, 'amount:', amount);
      console.log('User profile:', profile);

      // Get payment data from secure edge function
      const { data: paymentResponse, error: paymentError } = await supabase.functions.invoke(
        'initialize-payment',
        {
          body: { amount },
        }
      );

      console.log('Payment response:', paymentResponse, 'Error:', paymentError);

      if (paymentError) {
        console.error('Supabase function error:', paymentError);
        throw new Error(`Function error: ${paymentError.message}`);
      }

      if (!paymentResponse || !paymentResponse.success) {
        console.error('Payment response error:', paymentResponse);
        throw new Error(paymentResponse?.error || 'Failed to initialize payment');
      }

      const { paymentData, reference } = paymentResponse;
      console.log('Payment data received:', { reference, amount, paymentData });

      // Load Flutterwave script dynamically
      if (!window.FlutterwaveCheckout) {
        console.log('Loading Flutterwave script...');
        await loadFlutterwaveScript();
      }

      return new Promise((resolve, reject) => {
        console.log('Opening Flutterwave checkout with data:', paymentData);
        
        window.FlutterwaveCheckout({
          ...paymentData,
          callback: async (response: any) => {
            console.log('Flutterwave response:', response);
            
            if (response.status === 'successful') {
              try {
                // Sync wallet with the payment amount
                const syncResult = await syncWallet(
                  amount, 
                  'credit', 
                  response.transaction_id,
                  {
                    payment_method: 'flutterwave',
                    flw_ref: response.flw_ref,
                    tx_ref: response.tx_ref
                  }
                );

                if (syncResult.error) {
                  throw new Error(syncResult.error);
                }

                toast({
                  title: "Payment Successful!",
                  description: `₦${amount.toLocaleString()} has been added to your wallet`,
                });

                resolve(response);
              } catch (error) {
                console.error('Wallet sync error:', error);
                toast({
                  title: "Payment Processing Error",
                  description: "Payment was successful but wallet update failed. Please contact support.",
                  variant: "destructive",
                });
                reject(error);
              }
            } else {
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
            resolve(null);
          },
        });
      });

    } catch (error) {
      console.error('Payment initialization error:', error);
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
    initializePayment,
    loading,
  };
};

// Type declaration for Flutterwave
declare global {
  interface Window {
    FlutterwaveCheckout: (options: any) => void;
  }
}
