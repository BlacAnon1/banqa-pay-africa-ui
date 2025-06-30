import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Zap, Droplets, Wifi, Banknote, TrendingUp, Smartphone, Shield, GraduationCap, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/hooks/useWallet';
import { AddFundsModal } from '@/components/wallet/AddFundsModal';
import { useState } from 'react';

const Dashboard = () => {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const { wallet, loading } = useWallet();
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);

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
              {loading ? '₦...' : formatCurrency(wallet?.balance || 0)}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 gap-2"
              onClick={() => setShowAddFundsModal(true)}
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

        {/* Getting Started */}
        <Card className="lg:col-span-1 cultural-card border-accent/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-accent">{t('dashboard.getStarted')}</CardTitle>
            <CardDescription>Start your financial journey with Banqa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Ready to start managing your bills?</p>
                <div className="space-y-3">
                  <Button 
                    className="w-full gap-2"
                    onClick={() => setShowAddFundsModal(true)}
                  >
                    <Plus className="h-4 w-4" />
                    {t('dashboard.loadWallet')}
                  </Button>
                  <Button variant="outline" className="w-full">
                    {t('dashboard.connectBank')}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddFundsModal 
        open={showAddFundsModal}
        onOpenChange={setShowAddFundsModal}
      />
    </div>
  );
};

export default Dashboard;
