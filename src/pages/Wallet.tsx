import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Minus, Eye, EyeOff, CreditCard, Banknote } from 'lucide-react';
import { useState } from 'react';
import { AddFundsModal } from '@/components/wallet/AddFundsModal';
import { useWallet } from '@/hooks/useWallet';

const Wallet = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [addFundsAmount, setAddFundsAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  
  const { wallet, loading } = useWallet();

  const walletTransactions = [
    { id: 1, type: 'credit', description: 'Wallet Top-up', amount: '+₦50,000', date: '2024-12-25', method: 'Bank Transfer' },
    { id: 2, type: 'debit', description: 'Electricity Bill', amount: '-₦15,500', date: '2024-12-24', method: 'Wallet' },
    { id: 3, type: 'credit', description: 'Cashback Reward', amount: '+₦750', date: '2024-12-23', method: 'System' },
    { id: 4, type: 'debit', description: 'DSTV Subscription', amount: '-₦8,500', date: '2024-12-22', method: 'Wallet' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Wallet</h1>
        <p className="text-muted-foreground">Manage your funds and view transactions</p>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-white">Wallet Balance</CardTitle>
              <CardDescription className="text-emerald-100">Available funds</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
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
              onClick={() => setShowAddFundsModal(true)}
            >
              <Plus className="h-4 w-4" />
              Add Funds
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-emerald-600 gap-2">
              <Minus className="h-4 w-4" />
              Withdraw
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="add-funds">Add Funds</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your wallet transaction history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {walletTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? <Plus className="h-5 w-5" /> : <Minus className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.date} • {transaction.method}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {transaction.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-funds">
          <Card>
            <CardHeader>
              <CardTitle>Add Funds to Wallet</CardTitle>
              <CardDescription>Top up your wallet using various payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Use our secure payment gateway to add funds to your wallet
                </p>
                <Button 
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => setShowAddFundsModal(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Funds Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw">
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Funds</CardTitle>
              <CardDescription>Transfer money from your wallet to your bank account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdraw-amount">Amount (₦)</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Available balance: ₦85,420.50
                </p>
              </div>

              <div className="space-y-2">
                <Label>Bank Account</Label>
                <div className="p-4 border rounded-lg">
                  <p className="font-medium">First Bank of Nigeria</p>
                  <p className="text-sm text-muted-foreground">Account: ****1234</p>
                  <p className="text-sm text-muted-foreground">John Doe</p>
                </div>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Note:</strong> Withdrawals are processed within 24 hours. 
                  A fee of ₦100 applies to withdrawals.
                </p>
              </div>

              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                Withdraw Funds
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddFundsModal 
        open={showAddFundsModal}
        onOpenChange={setShowAddFundsModal}
      />
    </div>
  );
};

export default Wallet;
