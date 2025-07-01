
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface Profile {
  full_name: string;
  email: string;
  banqa_id: string;
}

interface MoneyTransfer {
  id: string;
  sender_id: string;
  recipient_id: string;
  amount_sent: number;
  amount_received: number;
  sender_currency: string;
  recipient_currency: string;
  exchange_rate: number;
  status: string;
  description: string;
  created_at: string;
  processed_at: string;
  sender_profile: Profile | null;
  recipient_profile: Profile | null;
}

export const TransferHistoryCard = () => {
  const { user } = useAuth();
  const [transfers, setTransfers] = useState<MoneyTransfer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTransfers();
    }
  }, [user]);

  const fetchTransfers = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('money_transfers')
        .select(`
          *,
          sender_profile:profiles!money_transfers_sender_id_fkey(full_name, email, banqa_id),
          recipient_profile:profiles!money_transfers_recipient_id_fkey(full_name, email, banqa_id)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching transfers:', error);
        setTransfers([]);
        return;
      }

      // Filter and validate the data
      const validTransfers: MoneyTransfer[] = [];
      
      if (data) {
        for (const transfer of data) {
          // Check if profiles exist and are valid objects (not error objects)
          const senderProfile = transfer.sender_profile;
          const recipientProfile = transfer.recipient_profile;
          
          const senderValid = senderProfile && 
            typeof senderProfile === 'object' && 
            senderProfile !== null &&
            'full_name' in senderProfile &&
            'email' in senderProfile &&
            'banqa_id' in senderProfile &&
            !('error' in senderProfile);
          
          const recipientValid = recipientProfile && 
            typeof recipientProfile === 'object' && 
            recipientProfile !== null &&
            'full_name' in recipientProfile &&
            'email' in recipientProfile &&
            'banqa_id' in recipientProfile &&
            !('error' in recipientProfile);

          if (senderValid && recipientValid) {
            validTransfers.push({
              ...transfer,
              sender_profile: senderProfile as Profile,
              recipient_profile: recipientProfile as Profile
            });
          }
        }
      }

      setTransfers(validTransfers);
    } catch (error) {
      console.error('Error fetching transfers:', error);
      setTransfers([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transfers</CardTitle>
          <CardDescription>Your money transfer history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading transfers...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transfers</CardTitle>
        <CardDescription>Your money transfer history</CardDescription>
      </CardHeader>
      <CardContent>
        {transfers.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No transfers yet. Send your first transfer to get started!
          </div>
        ) : (
          <div className="space-y-3">
            {transfers.map((transfer) => {
              const isSender = transfer.sender_id === user?.id;
              const otherParty = isSender ? transfer.recipient_profile : transfer.sender_profile;
              
              if (!otherParty) {
                return null;
              }
              
              return (
                <div key={transfer.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${isSender ? 'text-red-600' : 'text-green-600'}`}>
                        {isSender ? 'Sent to' : 'Received from'}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {otherParty.full_name} ({otherParty.banqa_id})
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(transfer.created_at), { addSuffix: true })}
                    </div>
                    {transfer.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {transfer.description}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${isSender ? 'text-red-600' : 'text-green-600'}`}>
                      {isSender ? '-' : '+'}₦{transfer.amount_sent.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Status: {transfer.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
