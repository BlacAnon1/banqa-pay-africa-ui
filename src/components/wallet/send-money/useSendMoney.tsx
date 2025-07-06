
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
    console.log('Fetching active currencies...');
    
    const { data, error } = await supabase
      .from('currencies')
      .select('*')
      .eq('is_active', true)
      .order('country');

    if (error) {
      console.error('Error fetching currencies:', error);
      toast({
        title: "Error",
        description: "Failed to load currencies. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (data) {
      console.log('Currencies loaded:', data.length);
      setCurrencies(data);
    }
  };

  const calculateConversion = (amount: string, selectedCurrency: string) => {
    if (!amount || !selectedCurrency || !currencies.length) {
      setExchangeRate(1);
      setConvertedAmount(0);
      setTransferFee(0);
      return;
    }

    const senderCurrency = currencies.find(c => c.code === 'NGN'); // Sender's currency
    const recipientCurrency = currencies.find(c => c.code === selectedCurrency);
    
    if (!senderCurrency || !recipientCurrency) {
      console.error('Currency not found:', { senderCurrency: 'NGN', recipientCurrency: selectedCurrency });
      return;
    }

    // Calculate real exchange rate
    const rate = recipientCurrency.exchange_rate_to_base / senderCurrency.exchange_rate_to_base;
    const amountNum = parseFloat(amount);
    const converted = amountNum * rate;
    
    // Calculate fee based on amount and whether it's cross-border
    const isCrossBorder = selectedCurrency !== 'NGN';
    const feePercentage = isCrossBorder ? 0.015 : 0.01; // 1.5% for cross-border, 1% for domestic
    const fee = amountNum * feePercentage;

    console.log('Conversion calculated:', {
      amount: amountNum,
      rate,
      converted,
      fee,
      isCrossBorder,
      senderCountry: senderCurrency.country,
      recipientCountry: recipientCurrency.country
    });

    setExchangeRate(rate);
    setConvertedAmount(converted);
    setTransferFee(fee);
  };

  const validateTransfer = (
    selectedRecipient: UserProfile,
    amount: string,
    userBalance: number
  ): { isValid: boolean; error?: string } => {
    if (!selectedRecipient) {
      return { isValid: false, error: "Please select a recipient" };
    }

    if (!amount || parseFloat(amount) <= 0) {
      return { isValid: false, error: "Please enter a valid amount" };
    }

    const totalAmount = parseFloat(amount) + transferFee;
    if (totalAmount > userBalance) {
      return { 
        isValid: false, 
        error: `Insufficient balance. You need ₦${(totalAmount - userBalance).toFixed(2)} more.` 
      };
    }

    if (parseFloat(amount) < 100) {
      return { isValid: false, error: "Minimum transfer amount is ₦100" };
    }

    if (parseFloat(amount) > 5000000) {
      return { isValid: false, error: "Maximum transfer amount is ₦5,000,000" };
    }

    return { isValid: true };
  };

  const sendMoney = async (
    selectedRecipient: UserProfile,
    amount: string,
    selectedCurrency: string,
    description: string,
    userBalance: number,
    onSuccess: () => void
  ) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to send money",
        variant: "destructive"
      });
      return;
    }

    // Validate transfer
    const validation = validateTransfer(selectedRecipient, amount, userBalance);
    if (!validation.isValid) {
      toast({
        title: "Invalid Transfer",
        description: validation.error,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    console.log('Initiating money transfer:', {
      sender_id: user.id,
      recipient_id: selectedRecipient.id,
      amount: parseFloat(amount),
      sender_currency: 'NGN',
      recipient_currency: selectedCurrency,
      description,
      transferFee,
      convertedAmount
    });

    try {
      const { data, error } = await supabase.functions.invoke('process-money-transfer', {
        body: {
          sender_id: user.id,
          recipient_id: selectedRecipient.id,
          amount: parseFloat(amount),
          sender_currency: 'NGN',
          recipient_currency: selectedCurrency,
          description: description || `Cross-border transfer to ${selectedRecipient.full_name}`
        }
      });

      if (error) {
        console.error('Transfer function error:', error);
        throw error;
      }

      console.log('Transfer response:', data);

      if (data?.success) {
        const isCrossBorder = selectedCurrency !== 'NGN';
        const recipientCurrency = currencies.find(c => c.code === selectedCurrency);
        
        toast({
          title: "🎉 Transfer Successful",
          description: isCrossBorder 
            ? `Successfully sent ${selectedCurrency} ${convertedAmount.toFixed(2)} to ${selectedRecipient.full_name} in ${recipientCurrency?.country}. Total deducted: ₦${(parseFloat(amount) + transferFee).toFixed(2)}`
            : `Successfully sent ₦${parseFloat(amount).toFixed(2)} to ${selectedRecipient.full_name}. Total deducted: ₦${(parseFloat(amount) + transferFee).toFixed(2)}`,
          duration: 6000,
        });
        
        onSuccess();
      } else {
        throw new Error(data?.error || 'Transfer processing failed');
      }
    } catch (error: any) {
      console.error('Transfer error:', error);
      toast({
        title: "Transfer Failed",
        description: error.message || "Something went wrong during the transfer. Please try again.",
        variant: "destructive",
        duration: 6000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

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
