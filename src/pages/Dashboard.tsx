
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Zap, Droplets, Wifi, Banknote, Calendar, TrendingUp, Smartphone, Shield, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { t } = useLanguage();
  const { profile } = useAuth();

  // Real African-focused data
  const upcomingBills = [
    { id: 1, service: t('bills.electricity'), amount: '₦15,500', dueDate: 'Dec 30', status: 'due' },
    { id: 2, service: t('bills.internet'), amount: '₦8,000', dueDate: 'Jan 5', status: 'upcoming' },
    { id: 3, service: t('bills.water'), amount: '₦3,200', dueDate: 'Jan 10', status: 'upcoming' },
  ];

  const recentTransactions = [
    { id: 1, service: t('bills.tv'), amount: '₦5,500', date: 'Dec 25', status: 'completed' },
    { id: 2, service: t('bills.airtime'), amount: '₦2,000', date: 'Dec 24', status: 'completed' },
    { id: 3, service: t('bills.electricity'), amount: '₦15,500', date: 'Dec 20', status: 'completed' },
  ];

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

  return (
    <div className="space-y-8 african-pattern-bg min-h-full">
      {/* Welcome Section */}
      <div className="cultural-card bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-2xl border border-primary/10">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold text-foreground">
            {t('dashboard.welcome')}, {profile?.full_name?.split(' ')[0] || 'Friend'}! 🌍
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
            <div className="text-3xl font-bold text-primary">₦285,420</div>
            <p className="text-sm text-emerald-600 font-medium">+12.5% {t('dashboard.thisMonth')}</p>
          </CardContent>
        </Card>

        <Card className="cultural-card border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">{t('dashboard.billsPaid')}</CardTitle>
            <TrendingUp className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">47</div>
            <p className="text-sm text-muted-foreground">{t('dashboard.thisMonth')}</p>
          </CardContent>
        </Card>

        <Card className="cultural-card border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">{t('dashboard.totalSpent')}</CardTitle>
            <CreditCard className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">₦456,800</div>
            <p className="text-sm text-muted-foreground">{t('dashboard.thisMonth')}</p>
          </CardContent>
        </Card>

        <Card className="cultural-card border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">{t('dashboard.upcomingBills')}</CardTitle>
            <Calendar className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">3</div>
            <p className="text-sm text-orange-600 font-medium">{t('dashboard.dueSoon')}</p>
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

        {/* Upcoming Bills */}
        <Card className="lg:col-span-1 cultural-card border-accent/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-accent">{t('dashboard.upcomingBills')}</CardTitle>
            <CardDescription>Bills due in the next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingBills.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-4 border border-primary/10 rounded-xl hover:bg-primary/5 transition-colors">
                  <div>
                    <p className="font-semibold text-foreground">{bill.service}</p>
                    <p className="text-sm text-muted-foreground">Due {bill.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{bill.amount}</p>
                    <Badge variant={bill.status === 'due' ? 'destructive' : 'secondary'} className="text-xs">
                      {t(`status.${bill.status}`)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="cultural-card border-secondary/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-secondary">{t('dashboard.recentTransactions')}</CardTitle>
          <CardDescription className="text-base">{t('dashboard.recentTransactionsSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border border-secondary/10 rounded-xl hover:bg-secondary/5 transition-colors">
                <div>
                  <p className="font-semibold text-foreground">{transaction.service}</p>
                  <p className="text-sm text-muted-foreground">{transaction.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{transaction.amount}</p>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
                    {t(`status.${transaction.status}`)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
