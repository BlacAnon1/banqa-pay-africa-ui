import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Transfer {
  id: string;
  sender_id: string;
  recipient_id: string;
  amount_sent: number;
  amount_received: number;
  status: string;
  created_at: string;
  reference_number: string;
  description?: string;
  sender_profile?: {
    full_name: string;
    email: string;
    banqa_id: string;
  } | null;
  recipient_profile?: {
    full_name: string;
    email: string;
    banqa_id: string;
  } | null;
}

export const TransferHistoryCard = () => {
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
          let senderProfile = null;
          let recipientProfile = null;

          // Handle sender profile - check if it's a valid profile object
          if (transfer.sender_profile && 
              typeof transfer.sender_profile === 'object' && 
              'full_name' in transfer.sender_profile &&
              'email' in transfer.sender_profile &&
              'banqa_id' in transfer.sender_profile) {
            senderProfile = transfer.sender_profile;
          }

          // Handle recipient profile - check if it's a valid profile object  
          if (transfer.recipient_profile && 
              typeof transfer.recipient_profile === 'object' && 
              'full_name' in transfer.recipient_profile &&
              'email' in transfer.recipient_profile &&
              'banqa_id' in transfer.recipient_profile) {
            recipientProfile = transfer.recipient_profile;
          }

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

  const getTransferDisplayInfo = (transfer: Transfer) => {
    const isSender = transfer.sender_id === profile?.id;
    
    if (isSender) {
      const recipientProfile = transfer.recipient_profile;
      return {
        type: 'sent' as const,
        amount: transfer.amount_sent,
        icon: ArrowUpRight,
        name: recipientProfile?.full_name || 'Unknown User',
        email: recipientProfile?.email || '',
        id: recipientProfile?.banqa_id || 'Unknown ID',
        color: 'text-red-600'
      };
    } else {
      const senderProfile = transfer.sender_profile;
      return {
        type: 'received' as const,
        amount: transfer.amount_received,
        icon: ArrowDownLeft,
        name: senderProfile?.full_name || 'Unknown User',
        email: senderProfile?.email || '',
        id: senderProfile?.banqa_id || 'Unknown ID',
        color: 'text-green-600'
      };
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Transfers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full" />
                  <div className="space-y-1">
                    <div className="w-24 h-4 bg-muted rounded" />
                    <div className="w-16 h-3 bg-muted rounded" />
                  </div>
                </div>
                <div className="w-16 h-4 bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Transfers
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transfers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No transfers yet</p>
            <p className="text-sm">Your recent money transfers will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transfers.map((transfer) => {
              const displayInfo = getTransferDisplayInfo(transfer);
              const Icon = displayInfo.icon;
              
              return (
                <div key={transfer.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${displayInfo.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{displayInfo.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {displayInfo.id}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${displayInfo.color}`}>
                      {displayInfo.type === 'sent' ? '-' : '+'}₦{displayInfo.amount.toLocaleString()}
                    </div>
                    <Badge variant={transfer.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                      {transfer.status}
                    </Badge>
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
