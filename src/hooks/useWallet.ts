
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Wallet {
  id: string;
  balance: number;
  currency: string;
  updated_at: string;
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchWallet = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .eq('currency', 'NGN')
        .single();

      if (error) {
        console.error('Error fetching wallet:', error);
        return;
      }

      setWallet(data);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncWallet = async (amount: number, transaction_type: string, reference?: string, metadata?: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('sync_wallet', {
        body: {
          user_id: user?.id,
          amount,
          transaction_type,
          reference,
          metadata
        }
      });

      if (error) throw error;

      // Refresh wallet data
      await fetchWallet();

      return { data, error: null };
    } catch (error: any) {
      console.error('Wallet sync error:', error);
      return { data: null, error: error.message };
    }
  };

  useEffect(() => {
    fetchWallet();

    // Set up real-time subscription for wallet updates
    if (user) {
      const channel = supabase
        .channel('wallet-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'wallets',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Wallet updated:', payload);
            fetchWallet();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    wallet,
    loading,
    fetchWallet,
    syncWallet
  };
};
