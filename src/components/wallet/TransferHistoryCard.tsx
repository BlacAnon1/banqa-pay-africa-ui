
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface MoneyTransfer {
  id: string;
  sender_id: string;
  recipient_id: string;
  sender_currency: string;
  recipient_currency: string;
  amount_sent: number;
  amount_received: number;
  exchange_rate: number;
  transfer_fee: number;
  status: string;
  reference_number: string;
  description: string;
  created_at: string;
  sender_profile?: {
    full_name: string;
    email: string;
  };
  recipient_profile?: {
    full_name: string;
    email: string;
  };
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
          sender_profile:profiles!sender_id(full_name, email),
          recipient_profile:profiles!recipient_id(full_name, email)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        setTransfers(data);
      }
    } catch (error) {
      console.error('Error fetching transfers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
          <CardDescription>Your recent money transfers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer History</CardTitle>
        <CardDescription>Your recent money transfers</CardDescription>
      </CardHeader>
      <CardContent>
        {transfers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transfers yet. Start sending money to other Banqa users!
          </div>
        ) : (
          <div className="space-y-4">
            {transfers.map((transfer) => {
              const isSent = transfer.sender_id === user?.id;
              const otherUser = isSent ? transfer.recipient_profile : transfer.sender_profile;
              
              return (
                <div key={transfer.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isSent ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {isSent ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium">
                          {isSent ? 'Sent to' : 'Received from'} {otherUser?.full_name}
                        </p>
                        <p className="text-sm text-muted-foreground">{otherUser?.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${isSent ? 'text-red-600' : 'text-green-600'}`}>
                        {isSent ? '-' : '+'}
                        {transfer.sender_currency} {isSent ? transfer.amount_sent : transfer.amount_received}
                      </p>
                      {transfer.sender_currency !== transfer.recipient_currency && (
                        <p className="text-xs text-muted-foreground">
                          ≈ {transfer.recipient_currency} {transfer.amount_received}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(transfer.status)}
                      <Badge variant={getStatusColor(transfer.status) as any}>
                        {transfer.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transfer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {transfer.description && (
                    <p className="text-sm text-muted-foreground mt-2">{transfer.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
