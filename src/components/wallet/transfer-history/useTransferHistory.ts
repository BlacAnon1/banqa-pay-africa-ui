
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Transfer } from './types';

export const useTransferHistory = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    if (!profile?.id) return;

    const fetchTransfers = async () => {
      try {
        const { data, error } = await supabase
          .from('money_transfers')
          .select(`
            *,
            sender_profile:profiles!money_transfers_sender_id_fkey(full_name, email, banqa_id),
            recipient_profile:profiles!money_transfers_recipient_id_fkey(full_name, email, banqa_id)
          `)
          .or(`sender_id.eq.${profile.id},recipient_id.eq.${profile.id}`)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching transfers:', error);
          return;
        }

        // Process the data to handle potential profile lookup errors
        const processedTransfers = data?.map(transfer => {
          // Create properly typed profile objects or null
          const senderProfile = transfer.sender_profile && 
            typeof transfer.sender_profile === 'object' && 
            transfer.sender_profile !== null &&
            'full_name' in transfer.sender_profile &&
            'email' in transfer.sender_profile &&
            'banqa_id' in transfer.sender_profile
            ? {
                full_name: (transfer.sender_profile as any).full_name as string,
                email: (transfer.sender_profile as any).email as string,
                banqa_id: (transfer.sender_profile as any).banqa_id as string
              }
            : null;

          const recipientProfile = transfer.recipient_profile && 
            typeof transfer.recipient_profile === 'object' && 
            transfer.recipient_profile !== null &&
            'full_name' in transfer.recipient_profile &&
            'email' in transfer.recipient_profile &&
            'banqa_id' in transfer.recipient_profile
            ? {
                full_name: (transfer.recipient_profile as any).full_name as string,
                email: (transfer.recipient_profile as any).email as string,
                banqa_id: (transfer.recipient_profile as any).banqa_id as string
              }
            : null;

          return {
            ...transfer,
            sender_profile: senderProfile,
            recipient_profile: recipientProfile
          };
        }) || [];

        setTransfers(processedTransfers);
      } catch (error) {
        console.error('Error fetching transfers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransfers();
  }, [profile?.id]);

  return { transfers, loading };
};
