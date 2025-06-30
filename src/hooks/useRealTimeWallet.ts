
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
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching wallet for user:', user.id);
      
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .eq('currency', 'NGN')
        .single();

      if (error && error.code === 'PGRST116') {
        // Wallet doesn't exist, create it
        console.log('Creating wallet for user:', user.id);
        const { data: newWallet, error: createError } = await supabase
          .from('wallets')
          .insert({ user_id: user.id, balance: 0, currency: 'NGN' })
          .select()
          .single();

        if (createError) {
          console.error('Error creating wallet:', createError);
          return;
        }

        setWallet(newWallet);
        setPreviousBalance(0);
      } else if (error) {
        console.error('Error fetching wallet:', error);
        return;
      } else {
        // Show balance change notification
        if (previousBalance !== null && data.balance !== previousBalance) {
          const difference = data.balance - previousBalance;
          if (difference > 0) {
            console.log(`Balance increased by ${difference}`);
            toast({
              title: "Wallet Updated",
              description: `₦${difference.toLocaleString()} added to your wallet`,
              duration: 5000,
            });
          }
        }

        setPreviousBalance(data.balance);
        setWallet(data);
        console.log('Wallet fetched successfully:', data);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncWallet = async (amount: number, transaction_type: string, reference?: string, metadata?: any) => {
    try {
      console.log('Syncing wallet:', { amount, transaction_type, reference, metadata });
      
      const { data, error } = await supabase.functions.invoke('sync_wallet', {
        body: {
          user_id: user?.id,
          amount,
          transaction_type,
          reference,
          metadata
        }
      });

      if (error) {
        console.error('Wallet sync function error:', error);
        throw error;
      }

      console.log('Wallet sync response:', data);

      if (!data.success) {
        throw new Error(data.error || 'Wallet sync failed');
      }

      // Force refresh wallet data after sync
      setTimeout(() => {
        fetchWallet();
      }, 1000);

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
      console.log('Setting up real-time wallet subscription for user:', user.id);
      
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
            console.log('Real-time wallet update received:', payload);
            fetchWallet();
          }
        )
        .subscribe((status) => {
          console.log('Wallet subscription status:', status);
        });

      return () => {
        console.log('Cleaning up wallet subscription');
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
