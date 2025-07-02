
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, TrendingUp, Banknote, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface StatsCardsProps {
  wallet: any;
  loading: boolean;
  onAddFunds: () => void;
}

export const StatsCards = ({ wallet, loading, onAddFunds }: StatsCardsProps) => {
  const { t } = useLanguage();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="cultural-card border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">{t('dashboard.balance')}</CardTitle>
          <Banknote className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary flex items-center gap-2">
            {loading ? '₦...' : formatCurrency(wallet?.balance || 0)}
            {!loading && (
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" title="Live balance"></span>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 gap-2"
            onClick={onAddFunds}
          >
            <Plus className="h-4 w-4" />
            {t('dashboard.addFunds')}
          </Button>
        </CardContent>
      </Card>

      <Card className="cultural-card border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">{t('dashboard.billsPaid')}</CardTitle>
          <TrendingUp className="h-5 w-5 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-secondary">0</div>
          <p className="text-sm text-muted-foreground">{t('dashboard.thisMonth')}</p>
        </CardContent>
      </Card>

      <Card className="cultural-card border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">{t('dashboard.totalSpent')}</CardTitle>
          <CreditCard className="h-5 w-5 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-accent">{formatCurrency(0)}</div>
          <p className="text-sm text-muted-foreground">{t('dashboard.thisMonth')}</p>
        </CardContent>
      </Card>

      <Card className="cultural-card border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">{t('dashboard.pendingBills')}</CardTitle>
          <Banknote className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">0</div>
          <p className="text-sm text-orange-600 font-medium">{t('dashboard.getStarted')}</p>
        </CardContent>
      </Card>
    </div>
  );
};
