
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Wallet {
  id: string;
  balance: number;
  currency: string;
  updated_at: string;
}

export const useRealTimeWallet = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [previousBalance, setPreviousBalance] = useState<number | null>(null);
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

      // Show balance change notification
      if (previousBalance !== null && data.balance !== previousBalance) {
        const difference = data.balance - previousBalance;
        if (difference > 0) {
          toast({
            title: "Wallet Updated",
            description: `₦${difference.toLocaleString()} added to your wallet`,
            duration: 5000,
          });
        }
      }

      setPreviousBalance(data.balance);
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

      // Force refresh wallet data after sync
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
        .channel('wallet-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'wallets',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Real-time wallet update:', payload);
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
