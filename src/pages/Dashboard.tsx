
import { useState } from 'react';
import { useRealTimeWallet } from '@/hooks/useRealTimeWallet';
import { AddFundsModal } from '@/components/wallet/AddFundsModal';
import { CustomizeQuickPayModal } from '@/components/dashboard/CustomizeQuickPayModal';
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { QuickPaySection } from '@/components/dashboard/QuickPaySection';
import { GettingStartedCard } from '@/components/dashboard/GettingStartedCard';

const Dashboard = () => {
  const { wallet, loading } = useRealTimeWallet();
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);

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
        <GettingStartedCard onAddFunds={() => setShowAddFundsModal(true)} />
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
