
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  country: string;
  exchange_rate_to_base: number;
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  banqa_id: string;
}

export const useSendMoney = () => {
  const { user } = useAuth();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [transferFee, setTransferFee] = useState(0);

  const fetchCurrencies = async () => {
    const { data, error } = await supabase
      .from('currencies')
      .select('*')
      .eq('is_active', true)
      .order('country');

    if (!error && data) {
      setCurrencies(data);
    }
  };

  const calculateConversion = (amount: string, selectedCurrency: string) => {
    const currency = currencies.find(c => c.code === selectedCurrency);
    if (!currency || !amount) return;

    const rate = currency.exchange_rate_to_base;
    const converted = parseFloat(amount) * rate;
    const fee = converted * 0.01; // 1% transfer fee

    setExchangeRate(rate);
    setConvertedAmount(converted);
    setTransferFee(fee);
  };

  const sendMoney = async (
    selectedRecipient: UserProfile,
    amount: string,
    selectedCurrency: string,
    description: string,
    userBalance: number,
    onSuccess: () => void
  ) => {
    if (!selectedRecipient || !amount || !user) return;

    const totalAmount = parseFloat(amount) + transferFee;
    if (totalAmount > userBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough funds to complete this transfer",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('process-money-transfer', {
        body: {
          sender_id: user.id,
          recipient_id: selectedRecipient.id,
          amount: parseFloat(amount),
          sender_currency: 'NGN',
          recipient_currency: selectedCurrency,
          description: description || `Transfer to ${selectedRecipient.full_name}`
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Transfer Successful",
          description: `Successfully sent ${selectedCurrency} ${convertedAmount.toFixed(2)} to ${selectedRecipient.full_name}`,
        });
        
        onSuccess();
      } else {
        throw new Error(data.error || 'Transfer failed');
      }
    } catch (error: any) {
      toast({
        title: "Transfer Failed",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    currencies,
    loading,
    exchangeRate,
    convertedAmount,
    transferFee,
    fetchCurrencies,
    calculateConversion,
    sendMoney
  };
};
