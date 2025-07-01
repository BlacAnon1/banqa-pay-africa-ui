
import { Skeleton } from '@/components/ui/skeleton';

export const TransferHistoryLoading = () => {
  return (
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
  );
};
