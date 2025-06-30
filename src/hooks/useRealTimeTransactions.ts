
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  user_id: string;
  transaction_type: string;
  amount: number;
  status: string;
  currency: string;
  reference_number: string;
  description: string;
  service_type?: string;
  provider_name?: string;
  created_at: string;
  updated_at: string;
  metadata?: any;
}

export const useRealTimeTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();

    // Set up real-time subscription for new transactions
    if (user) {
      const channel = supabase
        .channel('transactions-realtime')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'transactions',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('New transaction received:', payload);
            const newTransaction = payload.new as Transaction;
            
            // Add to transactions list
            setTransactions(prev => [newTransaction, ...prev]);
            
            // Show notification for new transaction
            toast({
              title: "New Transaction",
              description: `${newTransaction.description || newTransaction.transaction_type} - ₦${Number(newTransaction.amount).toLocaleString()}`,
              duration: 5000,
            });
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'transactions',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Transaction updated:', payload);
            const updatedTransaction = payload.new as Transaction;
            
            // Update transaction in list
            setTransactions(prev => 
              prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
            );
            
            // Show notification for status changes
            if (updatedTransaction.status === 'completed') {
              toast({
                title: "Transaction Completed",
                description: `${updatedTransaction.description || updatedTransaction.transaction_type} has been completed`,
                duration: 5000,
              });
            } else if (updatedTransaction.status === 'failed') {
              toast({
                title: "Transaction Failed",
                description: `${updatedTransaction.description || updatedTransaction.transaction_type} has failed`,
                variant: "destructive",
                duration: 5000,
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    transactions,
    loading,
    fetchTransactions
  };
};
