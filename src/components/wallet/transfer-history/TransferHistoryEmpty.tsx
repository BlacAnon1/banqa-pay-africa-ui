
import { Clock } from 'lucide-react';

export const TransferHistoryEmpty = () => {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <p>No transfers yet</p>
      <p className="text-sm">Your recent money transfers will appear here</p>
    </div>
  );
};
