
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface BankAccount {
  id: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  bank_code: string;
  is_default: boolean;
  is_verified: boolean;
  created_at: string;
}

export const useBankAccounts = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBankAccounts = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bank accounts:', error);
        return;
      }

      setBankAccounts(data || []);
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBankAccount = async (accountData: {
    account_name: string;
    account_number: string;
    bank_name: string;
    bank_code: string;
    withdrawal_pin: string;
  }) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      // First, create/update withdrawal PIN
      const { error: pinError } = await supabase
        .from('withdrawal_pins')
        .upsert({
          user_id: user.id,
          pin_hash: accountData.withdrawal_pin // In production, this should be properly hashed
        });

      if (pinError) {
        console.error('Error setting withdrawal PIN:', pinError);
        return { error: 'Failed to set withdrawal PIN' };
      }

      // Then add bank account
      const { data, error } = await supabase
        .from('bank_accounts')
        .insert({
          user_id: user.id,
          account_name: accountData.account_name,
          account_number: accountData.account_number,
          bank_name: accountData.bank_name,
          bank_code: accountData.bank_code,
          is_default: bankAccounts.length === 0 // First account becomes default
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding bank account:', error);
        return { error: 'Failed to add bank account' };
      }

      await fetchBankAccounts();
      toast({
        title: "Bank Account Added",
        description: "Your bank account has been added successfully",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Error adding bank account:', error);
      return { error: error.message };
    }
  };

  const setDefaultAccount = async (accountId: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      // Remove default from all accounts
      await supabase
        .from('bank_accounts')
        .update({ is_default: false })
        .eq('user_id', user.id);

      // Set new default
      const { error } = await supabase
        .from('bank_accounts')
        .update({ is_default: true })
        .eq('id', accountId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error setting default account:', error);
        return { error: 'Failed to set default account' };
      }

      await fetchBankAccounts();
      toast({
        title: "Default Account Updated",
        description: "Default withdrawal account has been updated",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Error setting default account:', error);
      return { error: error.message };
    }
  };

  const deleteBankAccount = async (accountId: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('bank_accounts')
        .delete()
        .eq('id', accountId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting bank account:', error);
        return { error: 'Failed to delete bank account' };
      }

      await fetchBankAccounts();
      toast({
        title: "Bank Account Deleted",
        description: "Bank account has been removed successfully",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Error deleting bank account:', error);
      return { error: error.message };
    }
  };

  useEffect(() => {
    fetchBankAccounts();
  }, [user]);

  return {
    bankAccounts,
    loading,
    addBankAccount,
    setDefaultAccount,
    deleteBankAccount,
    refetch: fetchBankAccounts
  };
};
