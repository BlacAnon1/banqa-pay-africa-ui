
import { useState } from 'react';
import { useRealTimeWallet } from '@/hooks/useRealTimeWallet';
import { AddFundsModal } from '@/components/wallet/AddFundsModal';
import { AddBankAccountModal } from '@/components/wallet/AddBankAccountModal';
import { CustomizeQuickPayModal } from '@/components/dashboard/CustomizeQuickPayModal';
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { QuickPaySection } from '@/components/dashboard/QuickPaySection';
import { GettingStartedCard } from '@/components/dashboard/GettingStartedCard';

const Dashboard = () => {
  console.log('Dashboard component rendering...');
  
  const { wallet, loading } = useRealTimeWallet();
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);

  console.log('Dashboard state:', { wallet, loading, showAddFundsModal, showAddBankModal, showCustomizeModal });

  try {
    return (
      <div className="space-y-8 african-pattern-bg min-h-full">
        {/* Welcome Section */}
        <WelcomeSection />

        {/* Stats Cards */}
        <StatsCards 
          wallet={wallet}
          loading={loading}
          onAddFunds={() => setShowAddFundsModal(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Pay */}
          <QuickPaySection onCustomize={() => setShowCustomizeModal(true)} />

          {/* Getting Started */}
          <GettingStartedCard 
            onAddFunds={() => setShowAddFundsModal(true)}
            onConnectBank={() => setShowAddBankModal(true)}
          />
        </div>

        <AddFundsModal 
          open={showAddFundsModal}
          onOpenChange={setShowAddFundsModal}
        />

        <AddBankAccountModal
          open={showAddBankModal}
          onOpenChange={setShowAddBankModal}
        />

        <CustomizeQuickPayModal
          open={showCustomizeModal}
          onOpenChange={setShowCustomizeModal}
        />
      </div>
    );
  } catch (error) {
    console.error('Error rendering Dashboard:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Dashboard Error</h1>
          <p className="text-gray-600">Failed to load dashboard components</p>
        </div>
      </div>
    );
  }
};

export default Dashboard;
