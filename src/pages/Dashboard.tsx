
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Zap, Droplets, Wifi, Banknote, TrendingUp, Smartphone, Shield, GraduationCap, Plus, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRealTimeWallet } from '@/hooks/useRealTimeWallet';
import { useQuickPayPreferences } from '@/hooks/useQuickPayPreferences';
import { AddFundsModal } from '@/components/wallet/AddFundsModal';
import { CustomizeQuickPayModal } from '@/components/dashboard/CustomizeQuickPayModal';
import { AfricanLogo } from '@/components/ui/AfricanLogo';
import { useState } from 'react';

const Dashboard = () => {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const { wallet, loading } = useRealTimeWallet();
  const { preferences, loading: preferencesLoading } = useQuickPayPreferences();
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);

  const iconMap = {
    Zap, Droplets, Wifi, Smartphone, CreditCard: CreditCard, Shield, 
    GraduationCap, Banknote
  };

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap] || Banknote;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getServiceDisplayName = (serviceName: string) => {
    // Handle special cases for core services
    if (serviceName === 'airtime') return 'Airtime';
    if (serviceName === 'data') return 'Data Bundle';
    return t(serviceName);
  };

  return (
    <div className="space-y-8 african-pattern-bg min-h-full">
      {/* Welcome Section */}
      <div className="cultural-card bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-2xl border border-primary/10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold text-foreground">
              {t('dashboard.welcome')}, {profile?.full_name?.split(' ')[0] || t('common.friend')}!
            </h1>
            <AfricanLogo size="md" variant="icon" />
          </div>
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
            <div className="text-3xl font-bold text-primary flex items-center gap-2">
              {loading ? '₦...' : formatCurrency(wallet?.balance || 0)}
              {!loading && (
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live balance"></span>
              )}
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-primary">{t('dashboard.quickPay')}</CardTitle>
                <CardDescription className="text-base">{t('dashboard.quickPaySubtitle')}</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setShowCustomizeModal(true)}
              >
                <Settings className="h-4 w-4" />
                Customize
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {preferencesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
                ))}
              </div>
            ) : preferences.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No Quick Pay services configured yet.</p>
                <Button
                  variant="outline"
                  onClick={() => setShowCustomizeModal(true)}
                  className="gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Customize Quick Pay
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {preferences.map((preference) => {
                  const IconComponent = getIconComponent(preference.service_icon);
                  
                  return (
                    <Button
                      key={preference.id}
                      variant="outline"
                      className="h-24 flex flex-col gap-3 hover:bg-primary/5 hover:border-primary rounded-xl cultural-card transition-all duration-300 hover:scale-105"
                    >
                      <div className={`w-10 h-10 rounded-full ${preference.service_color} flex items-center justify-center shadow-md`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-xs font-medium text-center leading-tight">
                        {getServiceDisplayName(preference.service_name)}
                      </span>
                    </Button>
                  );
                })}
              </div>
            )}
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

      <CustomizeQuickPayModal
        open={showCustomizeModal}
        onOpenChange={setShowCustomizeModal}
      />
    </div>
  );
};

export default Dashboard;
