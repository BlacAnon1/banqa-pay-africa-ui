
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Zap, Droplets, Wifi, Banknote, Calendar, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const upcomingBills = [
    { id: 1, service: 'Electricity', amount: '₦15,500', dueDate: 'Dec 30', status: 'due' },
    { id: 2, service: 'Internet', amount: '₦8,000', dueDate: 'Jan 5', status: 'upcoming' },
    { id: 3, service: 'Water', amount: '₦3,200', dueDate: 'Jan 10', status: 'upcoming' },
  ];

  const recentTransactions = [
    { id: 1, service: 'TV Subscription', amount: '₦5,500', date: 'Dec 25', status: 'completed' },
    { id: 2, service: 'Airtime', amount: '₦2,000', date: 'Dec 24', status: 'completed' },
    { id: 3, service: 'Electricity', amount: '₦15,500', date: 'Dec 20', status: 'completed' },
  ];

  const quickPayServices = [
    { name: t('bills.electricity'), icon: Zap, color: 'bg-yellow-500' },
    { name: t('bills.water'), icon: Droplets, color: 'bg-blue-500' },
    { name: t('bills.internet'), icon: Wifi, color: 'bg-purple-500' },
    { name: t('bills.airtime'), icon: Banknote, color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">
          {t('dashboard.welcome')}, {user?.fullName?.split(' ')[0]}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's your financial overview and upcoming bills
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-emerald-200 dark:border-emerald-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.balance')}</CardTitle>
            <Banknote className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">₦85,420</div>
            <p className="text-xs text-muted-foreground">+2.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bills Paid</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦156,800</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Bills</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Due soon</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Pay */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Pay</CardTitle>
            <CardDescription>Pay your most used services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickPayServices.map((service) => (
                <Button
                  key={service.name}
                  variant="outline"
                  className="h-20 flex flex-col gap-2 hover:bg-muted"
                >
                  <div className={`w-8 h-8 rounded-full ${service.color} flex items-center justify-center`}>
                    <service.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs">{service.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Bills */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Bills</CardTitle>
            <CardDescription>Bills due in the next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingBills.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{bill.service}</p>
                    <p className="text-sm text-muted-foreground">Due {bill.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{bill.amount}</p>
                    <Badge variant={bill.status === 'due' ? 'destructive' : 'secondary'}>
                      {bill.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest bill payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{transaction.service}</p>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{transaction.amount}</p>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
