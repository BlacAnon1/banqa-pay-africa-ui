
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, CreditCard, Calendar, Building2 } from 'lucide-react';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  description?: string;
  service_type?: string;
  status: string;
  created_at: string;
  provider_name?: string;
}

interface TransactionsListProps {
  transactions: Transaction[];
  loading: boolean;
}

export const TransactionsList = ({ transactions, loading }: TransactionsListProps) => {
  const getTransactionIcon = (type: string) => {
    if (type === 'credit' || type === 'wallet_topup') {
      return <Plus className="h-5 w-5" />;
    }
    return <Minus className="h-5 w-5" />;
  };

  const getTransactionColor = (type: string) => {
    if (type === 'credit' || type === 'wallet_topup') {
      return 'bg-green-100 text-green-600';
    }
    return 'bg-red-100 text-red-600';
  };

  const getTransactionAmountColor = (type: string) => {
    if (type === 'credit' || type === 'wallet_topup') {
      return 'text-green-600';
    }
    return 'text-red-600';
  };

  const formatTransactionAmount = (amount: number, type: string) => {
    const formattedAmount = `₦${Number(amount).toLocaleString()}`;
    if (type === 'credit' || type === 'wallet_topup') {
      return `+${formattedAmount}`;
    }
    return `-${formattedAmount}`;
  };

  const getServiceTypeDisplay = (serviceType: string) => {
    switch (serviceType) {
      case 'wallet_topup':
        return 'Wallet Top-up';
      case 'wallet_debit':
        return 'Wallet Debit';
      case 'electricity':
        return 'Electricity Bill';
      case 'airtime':
        return 'Airtime Purchase';
      case 'data':
        return 'Data Bundle';
      case 'cable_tv':
        return 'Cable TV Subscription';
      default:
        return serviceType || 'Transaction';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your wallet transaction history</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <CreditCard className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-muted-foreground mb-2">No transactions yet</p>
            <p className="text-sm text-muted-foreground">Your transaction history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.slice(0, 10).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    getTransactionColor(transaction.transaction_type)
                  }`}>
                    {getTransactionIcon(transaction.transaction_type)}
                  </div>
                  <div>
                    <p className="font-medium">
                      {transaction.description || getServiceTypeDisplay(transaction.service_type || transaction.transaction_type)}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(transaction.created_at), 'MMM dd, yyyy • HH:mm')}</span>
                      {transaction.provider_name && (
                        <>
                          <span>•</span>
                          <Building2 className="h-3 w-3" />
                          <span>{transaction.provider_name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    getTransactionAmountColor(transaction.transaction_type)
                  }`}>
                    {formatTransactionAmount(Number(transaction.amount), transaction.transaction_type)}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={transaction.status === 'completed' ? 'default' : 
                             transaction.status === 'failed' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {transaction.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {transaction.transaction_type}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
