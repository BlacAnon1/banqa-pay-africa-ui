
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Zap, Droplets, Wifi, Banknote, Calendar, TrendingUp, Smartphone, Shield, GraduationCap, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { t } = useLanguage();
  const { profile, user } = useAuth();
  const [walletBalance, setWalletBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // Fetch wallet balance
        const { data: walletData } = await supabase
          .from('wallets')
          .select('balance')
          .eq('user_id', user.id)
          .single();

        if (walletData) {
          setWalletBalance(walletData.balance);
        }

        // Fetch recent transactions
        const { data: transactionsData } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (transactionsData) {
          setRecentTransactions(transactionsData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const quickPayServices = [
    { name: t('bills.electricity'), icon: Zap, color: 'bg-yellow-500' },
    { name: t('bills.water'), icon: Droplets, color: 'bg-blue-500' },
    { name: t('bills.internet'), icon: Wifi, color: 'bg-purple-500' },
    { name: t('bills.airtime'), icon: Smartphone, color: 'bg-green-500' },
    { name: t('bills.tv'), icon: CreditCard, color: 'bg-orange-500' },
    { name: t('bills.insurance'), icon: Shield, color: 'bg-red-500' },
    { name: t('bills.school'), icon: GraduationCap, color: 'bg-indigo-500' },
    { name: t('bills.taxes'), icon: Banknote, color: 'bg-emerald-600' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 african-pattern-bg min-h-full">
      {/* Welcome Section */}
      <div className="cultural-card bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-2xl border border-primary/10">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold text-foreground">
            {t('dashboard.welcome')}, {profile?.full_name?.split(' ')[0] || t('common.friend')}! 🌍
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            {t('dashboard.subtitle')}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="cultural-card border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">{t('dashboard.balance')}</CardTitle>
            <Banknote className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {formatCurrency(walletBalance)}
            </div>
            <Button variant="outline" size="sm" className="mt-2 gap-2">
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
            <div className="text-3xl font-bold text-secondary">
              {recentTransactions.filter(t => t.status === 'completed').length}
            </div>
            <p className="text-sm text-muted-foreground">{t('dashboard.thisMonth')}</p>
          </CardContent>
        </Card>

        <Card className="cultural-card border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">{t('dashboard.totalSpent')}</CardTitle>
            <CreditCard className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">
              {formatCurrency(
                recentTransactions
                  .filter(t => t.status === 'completed')
                  .reduce((sum, t) => sum + Number(t.amount), 0)
              )}
            </div>
            <p className="text-sm text-muted-foreground">{t('dashboard.thisMonth')}</p>
          </CardContent>
        </Card>

        <Card className="cultural-card border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">{t('dashboard.pendingBills')}</CardTitle>
            <Calendar className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {recentTransactions.filter(t => t.status === 'pending').length}
            </div>
            <p className="text-sm text-orange-600 font-medium">{t('dashboard.needsAttention')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Pay */}
        <Card className="lg:col-span-2 cultural-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary">{t('dashboard.quickPay')}</CardTitle>
            <CardDescription className="text-base">{t('dashboard.quickPaySubtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickPayServices.map((service) => (
                <Button
                  key={service.name}
                  variant="outline"
                  className="h-24 flex flex-col gap-3 hover:bg-primary/5 hover:border-primary rounded-xl cultural-card transition-all duration-300 hover:scale-105"
                >
                  <div className={`w-10 h-10 rounded-full ${service.color} flex items-center justify-center shadow-md`}>
                    <service.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-center leading-tight">{service.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="lg:col-span-1 cultural-card border-accent/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-accent">{t('dashboard.recentTransactions')}</CardTitle>
            <CardDescription>{t('dashboard.recentTransactionsSubtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-primary/10 rounded-xl hover:bg-primary/5 transition-colors">
                    <div>
                      <p className="font-semibold text-foreground">{transaction.description || transaction.service_type}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(transaction.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(Number(transaction.amount))}</p>
                      <Badge 
                        variant={transaction.status === 'completed' ? 'default' : 
                                transaction.status === 'failed' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {t(`status.${transaction.status}`)}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">{t('dashboard.noTransactions')}</p>
                  <Button variant="outline" className="mt-4">
                    {t('dashboard.startPaying')}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
