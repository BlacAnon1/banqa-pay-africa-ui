
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface UserRewards {
  totalPoints: number;
  currentTier: string;
  pointsToNextTier: number;
  lifetimePoints: number;
  redeemedPoints: number;
}

interface RewardItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: string;
  available: boolean;
}

interface Transaction {
  id: string;
  type: 'earned' | 'redeemed';
  points: number;
  description: string;
  date: string;
}

export const useRewardsSystem = () => {
  const [userRewards, setUserRewards] = useState<UserRewards | null>(null);
  const [rewardItems, setRewardItems] = useState<RewardItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchUserRewards = async () => {
    if (!user) return;

    try {
      // Get or create user rewards record
      let { data: rewardsData, error } = await supabase
        .from('user_rewards')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Create rewards record if it doesn't exist
        const { data: newRewards, error: createError } = await supabase
          .from('user_rewards')
          .insert({
            user_id: user.id,
            total_points: 0,
            lifetime_points: 0,
            redeemed_points: 0,
            current_tier: 'Bronze'
          })
          .select()
          .single();

        if (createError) throw createError;
        rewardsData = newRewards;
      } else if (error) {
        throw error;
      }

      if (rewardsData) {
        const pointsToNextTier = calculatePointsToNextTier(rewardsData.total_points, rewardsData.current_tier);
        
        setUserRewards({
          totalPoints: rewardsData.total_points,
          currentTier: rewardsData.current_tier,
          pointsToNextTier,
          lifetimePoints: rewardsData.lifetime_points,
          redeemedPoints: rewardsData.redeemed_points
        });
      }
    } catch (error) {
      console.error('Error fetching user rewards:', error);
    }
  };

  const fetchRewardItems = async () => {
    try {
      const { data, error } = await supabase
        .from('reward_items')
        .select('*')
        .eq('is_active', true)
        .order('cost_points', { ascending: true });

      if (error) throw error;

      const processedItems = data?.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        cost: item.cost_points,
        category: item.category,
        available: true
      })) || [];

      setRewardItems(processedItems);
    } catch (error) {
      console.error('Error fetching reward items:', error);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('reward_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const processedTransactions = data?.map(transaction => ({
        id: transaction.id,
        type: transaction.transaction_type as 'earned' | 'redeemed',
        points: transaction.points,
        description: transaction.description,
        date: new Date(transaction.created_at).toISOString().split('T')[0]
      })) || [];

      setTransactions(processedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const redeemReward = async (reward: RewardItem) => {
    if (!user || !userRewards) return;

    if (userRewards.totalPoints < reward.cost) {
      toast({
        title: "Insufficient Points",
        description: `You need ${reward.cost - userRewards.totalPoints} more points to redeem this reward`,
        variant: "destructive"
      });
      return;
    }

    try {
      // Start a transaction
      const { error: rewardError } = await supabase
        .from('user_rewards')
        .update({
          total_points: userRewards.totalPoints - reward.cost,
          redeemed_points: userRewards.redeemedPoints + reward.cost
        })
        .eq('user_id', user.id);

      if (rewardError) throw rewardError;

      // Record the transaction
      const { error: transactionError } = await supabase
        .from('reward_transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'redeemed',
          points: -reward.cost,
          description: `${reward.name} redeemed`
        });

      if (transactionError) throw transactionError;

      toast({
        title: "Reward Redeemed!",
        description: `${reward.name} has been processed`
      });

      // Refresh data
      fetchUserRewards();
      fetchTransactions();
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast({
        title: "Error",
        description: "Failed to redeem reward",
        variant: "destructive"
      });
    }
  };

  const calculatePointsToNextTier = (currentPoints: number, currentTier: string): number => {
    const tierThresholds = {
      'Bronze': 1000,
      'Silver': 4000,
      'Gold': 10000,
      'Platinum': Infinity
    };

    const nextTierThreshold = tierThresholds[currentTier as keyof typeof tierThresholds];
    return nextTierThreshold === Infinity ? 0 : nextTierThreshold - currentPoints;
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchUserRewards(),
      fetchRewardItems(),
      fetchTransactions()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, [user]);

  return {
    userRewards,
    rewardItems,
    transactions,
    loading,
    redeemReward,
    refetch: fetchAllData
  };
};
