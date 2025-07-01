
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { useTransferHistory } from './transfer-history/useTransferHistory';
import { TransferHistoryLoading } from './transfer-history/TransferHistoryLoading';
import { TransferHistoryEmpty } from './transfer-history/TransferHistoryEmpty';
import { TransferItem } from './transfer-history/TransferItem';

export const TransferHistoryCard = () => {
  const { transfers, loading } = useTransferHistory();

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
          <TransferHistoryLoading />
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
          <TransferHistoryEmpty />
        ) : (
          <div className="space-y-3">
            {transfers.map((transfer) => (
              <TransferItem key={transfer.id} transfer={transfer} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
