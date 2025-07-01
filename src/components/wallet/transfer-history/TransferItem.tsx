
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Transfer, TransferDisplayInfo } from './types';
import { useAuth } from '@/contexts/AuthContext';

interface TransferItemProps {
  transfer: Transfer;
}

export const TransferItem = ({ transfer }: TransferItemProps) => {
  const { profile } = useAuth();

  const getTransferDisplayInfo = (transfer: Transfer): TransferDisplayInfo => {
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

  const displayInfo = getTransferDisplayInfo(transfer);
  const Icon = displayInfo.icon;

  return (
    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors">
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
};
