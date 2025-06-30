
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/hooks/useWallet';
import { toast } from '@/hooks/use-toast';

interface FlutterwavePaymentData {
  amount: number;
  currency: string;
  reference: string;
  customer: {
    email: string;
    name: string;
    phone_number?: string;
  };
  customizations: {
    title: string;
    description: string;
    logo: string;
  };
}

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
      const reference = `BQ_${Date.now()}_${user.id.substr(0, 8)}`;
      
      const paymentData: FlutterwavePaymentData = {
        amount: amount,
        currency: 'NGN',
        reference: reference,
        customer: {
          email: profile.email,
          name: profile.full_name || 'Banqa User',
          phone_number: profile.phone_number || undefined,
        },
        customizations: {
          title: 'Banqa Wallet Top-up',
          description: `Add ₦${amount.toLocaleString()} to your Banqa wallet`,
          logo: window.location.origin + '/favicon.ico',
        },
      };

      // Load Flutterwave script dynamically
      if (!window.FlutterwaveCheckout) {
        await loadFlutterwaveScript();
      }

      return new Promise((resolve, reject) => {
        window.FlutterwaveCheckout({
          public_key: "FLWPUBK_TEST-SANDBOXDEMOKEY-X", // This will be replaced with actual key
          tx_ref: reference,
          amount: amount,
          currency: 'NGN',
          payment_options: 'card, banktransfer, ussd',
          customer: paymentData.customer,
          customizations: paymentData.customizations,
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
        description: "Could not initialize payment. Please try again.",
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
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Flutterwave script'));
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
