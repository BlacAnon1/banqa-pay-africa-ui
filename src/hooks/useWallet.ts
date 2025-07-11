
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

export const useWallet = () => {
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

      // Show balance change notification only for positive changes
      if (previousBalance !== null && data.balance > previousBalance) {
        const difference = data.balance - previousBalance;
        toast({
          title: "Wallet Credited",
          description: `₦${difference.toLocaleString()} added to your wallet`,
          duration: 4000,
        });
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
