import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Minus, Eye, EyeOff, CreditCard, Banknote, Calendar, Building2 } from 'lucide-react';
import { useState } from 'react';
import { AddFundsModal } from '@/components/wallet/AddFundsModal';
import { useRealTimeWallet } from '@/hooks/useRealTimeWallet';
import { useRealTimeTransactions } from '@/hooks/useRealTimeTransactions';
import { format } from 'date-fns';
import { AddBankAccountModal } from '@/components/wallet/AddBankAccountModal';
import { WithdrawalProcess } from '@/components/wallet/WithdrawalProcess';
import { useBankAccounts } from '@/hooks/useBankAccounts';

const Wallet = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [addFundsAmount, setAddFundsAmount] = useState('');
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  
  const { wallet, loading } = useRealTimeWallet();
  const { transactions, loading: transactionsLoading } = useRealTimeTransactions();
  const { bankAccounts } = useBankAccounts();

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

  const handleWithdrawClick = () => {
    if (bankAccounts.length === 0) {
      toast({
        title: "No Bank Account",
        description: "Please add a bank account first to withdraw funds",
        variant: "destructive"
      });
      setShowAddBankModal(true);
      return;
    }
    setShowWithdrawalModal(true);
  };

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
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-emerald-600 gap-2"
              onClick={handleWithdrawClick}
            >
              <Minus className="h-4 w-4" />
              Withdraw
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="add-funds">Add Funds</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your wallet transaction history</CardDescription>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
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
              {bankAccounts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-muted-foreground mb-4">No bank accounts added</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add a bank account to start withdrawing funds
                  </p>
                  <Button onClick={() => setShowAddBankModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Bank Account
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {bankAccounts.map((account) => (
                      <div key={account.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{account.bank_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {account.account_name} • ****{account.account_number.slice(-4)}
                            </p>
                            {account.is_default && (
                              <Badge variant="secondary" className="text-xs mt-1">Default</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {account.is_verified && (
                              <Badge variant="default" className="text-xs">Verified</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => setShowWithdrawalModal(true)}
                    >
                      <Minus className="h-4 w-4 mr-2" />
                      Withdraw Funds
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowAddBankModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Account
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <CardTitle>Bank Accounts</CardTitle>
              <CardDescription>Manage your withdrawal bank accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {bankAccounts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-muted-foreground mb-2">No bank accounts</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add your first bank account for withdrawals
                  </p>
                  <Button onClick={() => setShowAddBankModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Bank Account
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bankAccounts.map((account) => (
                    <div key={account.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{account.bank_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {account.account_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Account: ****{account.account_number.slice(-4)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {account.is_default && (
                              <Badge variant="secondary" className="text-xs">Default</Badge>
                            )}
                            {account.is_verified && (
                              <Badge variant="default" className="text-xs">Verified</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowAddBankModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Bank Account
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddFundsModal 
        open={showAddFundsModal}
        onOpenChange={setShowAddFundsModal}
      />
      
      <AddBankAccountModal
        open={showAddBankModal}
        onOpenChange={setShowAddBankModal}
      />
      
      <WithdrawalProcess
        open={showWithdrawalModal}
        onOpenChange={setShowWithdrawalModal}
      />
    </div>
  );
};

export default Wallet;
