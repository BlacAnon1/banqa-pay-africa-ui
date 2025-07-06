
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface CountryWallet {
  id: string;
  country: string;
  countryCode: string;
  currency: string;
  symbol: string;
  balance: number;
  isDefault: boolean;
  exchangeRate: number;
  flag: string;
}

export const useMultiCountryWallets = () => {
  const [wallets, setWallets] = useState<CountryWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchWallets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('multi_country_wallets')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('is_default', { ascending: false });

      if (error) throw error;

      const processedWallets = data?.map(wallet => ({
        id: wallet.id,
        country: wallet.country_name,
        countryCode: wallet.country_code,
        currency: wallet.currency_code,
        symbol: wallet.currency_symbol,
        balance: wallet.balance,
        isDefault: wallet.is_default,
        exchangeRate: wallet.exchange_rate,
        flag: getCountryFlag(wallet.country_code)
      })) || [];

      setWallets(processedWallets);
    } catch (error) {
      console.error('Error fetching wallets:', error);
      toast({
        title: "Error",
        description: "Failed to load wallets",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addWallet = async (countryCode: string, countryName: string, currencyCode: string, currencySymbol: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('multi_country_wallets')
        .insert({
          user_id: user.id,
          country_code: countryCode,
          country_name: countryName,
          currency_code: currencyCode,
          currency_symbol: currencySymbol,
          balance: 0,
          is_default: wallets.length === 0,
          exchange_rate: await getExchangeRate(currencyCode)
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Wallet Added",
        description: `${countryName} wallet created successfully`
      });

      fetchWallets();
    } catch (error) {
      console.error('Error adding wallet:', error);
      toast({
        title: "Error",
        description: "Failed to create wallet",
        variant: "destructive"
      });
    }
  };

  const getCountryFlag = (countryCode: string): string => {
    const flagEmojis: { [key: string]: string } = {
      'NG': '🇳🇬', 'GH': '🇬🇭', 'KE': '🇰🇪', 'ZA': '🇿🇦',
      'EG': '🇪🇬', 'MA': '🇲🇦', 'TN': '🇹🇳', 'DZ': '🇩🇿',
      'ET': '🇪🇹', 'UG': '🇺🇬', 'TZ': '🇹🇿', 'RW': '🇷🇼'
    };
    return flagEmojis[countryCode] || '🏳️';
  };

  const getExchangeRate = async (currencyCode: string): Promise<number> => {
    // In production, this would call a real exchange rate API
    // For now, return mock rates
    const rates: { [key: string]: number } = {
      'NGN': 1,
      'GHS': 12.5,
      'KES': 0.57,
      'ZAR': 0.38,
      'EGP': 2.1
    };
    return rates[currencyCode] || 1;
  };

  useEffect(() => {
    fetchWallets();
  }, [user]);

  return { wallets, loading, addWallet, refetch: fetchWallets };
};
