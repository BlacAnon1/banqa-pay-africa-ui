
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRealTimeTransactions } from '@/hooks/useRealTimeTransactions';

const History = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { transactions, loading, fetchTransactions } = useRealTimeTransactions();

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = (transaction.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.service_type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.reference_number || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || transaction.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type: string) => {
    return type === 'credit' ? '↗️' : '↙️';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('history.title')}</h1>
          <p className="text-muted-foreground">{t('history.subtitle')}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchTransactions}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t('history.filterTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('history.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t('history.filterPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('history.allStatus')}</SelectItem>
                <SelectItem value="completed">{t('status.completed')}</SelectItem>
                <SelectItem value="failed">{t('status.failed')}</SelectItem>
                <SelectItem value="pending">{t('status.pending')}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              {t('history.export')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Transaction Updates Banner */}
      {transactions.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Live updates enabled - New transactions will appear automatically
          </p>
        </div>
      )}

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>{t('history.recentTransactions')}</CardTitle>
          <CardDescription>
            {t('history.showingResults', { 
              count: filteredTransactions.length, 
              total: transactions.length 
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">
                          {getTransactionIcon(transaction.transaction_type)}
                        </span>
                        <h3 className="font-semibold">
                          {transaction.description || transaction.service_type || t('history.transaction')}
                        </h3>
                        <Badge variant={transaction.status === 'completed' ? 'default' : 
                                     transaction.status === 'failed' ? 'destructive' : 'secondary'}>
                          {t(`status.${transaction.status}`)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {transaction.provider_name || t('history.banqa')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t('history.reference')}: {transaction.reference_number}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className={`font-bold text-lg ${
                        transaction.transaction_type === 'credit' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {transaction.transaction_type === 'credit' ? '+' : '-'}
                        {formatCurrency(Number(transaction.amount))}
                      </p>
                      <p className="text-sm text-muted-foreground">{formatDate(transaction.created_at)}</p>
                      <p className="text-xs text-muted-foreground">ID: {transaction.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{t('history.noTransactions')}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
