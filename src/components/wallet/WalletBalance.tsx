
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Plus, Minus } from 'lucide-react';

interface WalletBalanceProps {
  wallet: { balance: number } | null;
  loading: boolean;
  showBalance: boolean;
  onToggleBalance: () => void;
  onAddFunds: () => void;
  onWithdraw: () => void;
}

export const WalletBalance = ({
  wallet,
  loading,
  showBalance,
  onToggleBalance,
  onAddFunds,
  onWithdraw
}: WalletBalanceProps) => {
  return (
    <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              Wallet Balance
              {!loading && (
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" title="Live balance"></span>
              )}
            </CardTitle>
            <CardDescription className="text-emerald-100">Available funds</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleBalance}
            className="text-white hover:bg-emerald-600"
          >
            {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold mb-4">
          {loading ? (
            '₦*****.**'
          ) : showBalance ? (
            `₦${wallet?.balance?.toLocaleString() || '0.00'}`
          ) : (
            '₦*****.**'
          )}
        </div>
        <div className="flex gap-3">
          <Button 
            className="bg-white text-emerald-600 hover:bg-emerald-50 gap-2"
            onClick={onAddFunds}
          >
            <Plus className="h-4 w-4" />
            Add Funds
          </Button>
          <Button 
            variant="outline" 
            className="border-white text-white hover:bg-emerald-600 gap-2"
            onClick={onWithdraw}
          >
            <Minus className="h-4 w-4" />
            Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
