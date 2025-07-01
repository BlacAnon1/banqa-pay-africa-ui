
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { AddFundsModal } from '@/components/wallet/AddFundsModal';
import { useRealTimeWallet } from '@/hooks/useRealTimeWallet';
import { useRealTimeTransactions } from '@/hooks/useRealTimeTransactions';
import { AddBankAccountModal } from '@/components/wallet/AddBankAccountModal';
import { WithdrawalProcess } from '@/components/wallet/WithdrawalProcess';
import { useBankAccounts } from '@/hooks/useBankAccounts';
import { toast } from '@/hooks/use-toast';
import { WalletBalance } from '@/components/wallet/WalletBalance';
import { TransactionsList } from '@/components/wallet/TransactionsList';
import { AddFundsCard } from '@/components/wallet/AddFundsCard';
import { WithdrawFundsCard } from '@/components/wallet/WithdrawFundsCard';
import { BankAccountsList } from '@/components/wallet/BankAccountsList';
import { SendMoneyModal } from '@/components/wallet/SendMoneyModal';
import { TransferHistoryCard } from '@/components/wallet/TransferHistoryCard';

const Wallet = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showSendMoneyModal, setShowSendMoneyModal] = useState(false);
  
  const { wallet, loading } = useRealTimeWallet();
  const { transactions, loading: transactionsLoading } = useRealTimeTransactions();
  const { bankAccounts } = useBankAccounts();

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
      
      <WalletBalance
        wallet={wallet}
        loading={loading}
        showBalance={showBalance}
        onToggleBalance={() => setShowBalance(!showBalance)}
        onAddFunds={() => setShowAddFundsModal(true)}
        onWithdraw={handleWithdrawClick}
      />

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="send-money">Send Money</TabsTrigger>
          <TabsTrigger value="add-funds">Add Funds</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <TransactionsList 
            transactions={transactions}
            loading={transactionsLoading}
          />
        </TabsContent>

        <TabsContent value="send-money" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Send Money to Banqa Users</h3>
              <p className="text-muted-foreground">
                Send money instantly to other Banqa users across Africa with automatic currency conversion.
              </p>
              <button
                onClick={() => setShowSendMoneyModal(true)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md font-medium"
              >
                Send Money Now
              </button>
            </div>
            <TransferHistoryCard />
          </div>
        </TabsContent>

        <TabsContent value="add-funds">
          <AddFundsCard onAddFunds={() => setShowAddFundsModal(true)} />
        </TabsContent>

        <TabsContent value="withdraw">
          <WithdrawFundsCard
            bankAccounts={bankAccounts}
            onAddAccount={() => setShowAddBankModal(true)}
            onWithdraw={() => setShowWithdrawalModal(true)}
          />
        </TabsContent>

        <TabsContent value="accounts">
          <BankAccountsList
            bankAccounts={bankAccounts}
            onAddAccount={() => setShowAddBankModal(true)}
          />
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

      <SendMoneyModal
        open={showSendMoneyModal}
        onOpenChange={setShowSendMoneyModal}
        userBalance={wallet?.balance || 0}
      />
    </div>
  );
};

export default Wallet;
