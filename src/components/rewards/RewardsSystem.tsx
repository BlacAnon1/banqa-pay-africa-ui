
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Gift, Smartphone, Zap, Heart, Trophy, Crown, Gem } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface RewardItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'airtime' | 'bills' | 'donations' | 'vouchers';
  icon: React.ReactNode;
  available: boolean;
}

interface UserRewards {
  totalPoints: number;
  currentTier: string;
  pointsToNextTier: number;
  lifetimePoints: number;
  redeemedPoints: number;
}

interface Transaction {
  id: string;
  type: 'earned' | 'redeemed';
  points: number;
  description: string;
  date: string;
}

export const RewardsSystem: React.FC = () => {
  const [userRewards, setUserRewards] = useState<UserRewards>({
    totalPoints: 2847,
    currentTier: 'Gold',
    pointsToNextTier: 1153,
    lifetimePoints: 12450,
    redeemedPoints: 3680
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const rewardItems: RewardItem[] = [
    {
      id: '1',
      name: 'Airtime ₦500',
      description: 'Mobile airtime for any network',
      cost: 250,
      category: 'airtime',
      icon: <Smartphone className="h-5 w-5" />,
      available: true
    },
    {
      id: '2',
      name: 'Airtime ₦1000',
      description: 'Mobile airtime for any network',
      cost: 450,
      category: 'airtime',
      icon: <Smartphone className="h-5 w-5" />,
      available: true
    },
    {
      id: '3',
      name: '5% Bill Discount',
      description: 'Discount on your next utility bill',
      cost: 800,
      category: 'bills',
      icon: <Zap className="h-5 w-5" />,
      available: true
    },
    {
      id: '4',
      name: '10% Bill Discount',
      description: 'Discount on your next utility bill',
      cost: 1500,
      category: 'bills',
      icon: <Zap className="h-5 w-5" />,
      available: true
    },
    {
      id: '5',
      name: 'Education Donation ₦2000',
      description: 'Donate to children\'s education programs',
      cost: 1000,
      category: 'donations',
      icon: <Heart className="h-5 w-5" />,
      available: true
    },
    {
      id: '6',
      name: 'Healthcare Donation ₦5000',
      description: 'Support community healthcare initiatives',
      cost: 2500,
      category: 'donations',
      icon: <Heart className="h-5 w-5" />,
      available: true
    }
  ];

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        type: 'earned',
        points: 25,
        description: 'Electricity bill payment',
        date: '2024-01-15'
      },
      {
        id: '2',
        type: 'earned',
        points: 15,
        description: 'Water bill payment',
        date: '2024-01-14'
      },
      {
        id: '3',
        type: 'redeemed',
        points: -450,
        description: 'Airtime ₦1000 redeemed',
        date: '2024-01-12'
      },
      {
        id: '4',
        type: 'earned',
        points: 30,
        description: 'Internet bill payment',
        date: '2024-01-10'
      }
    ];
    
    setTransactions(mockTransactions);
    setLoading(false);
  };

  const getTierInfo = (tier: string) => {
    const tiers = {
      'Bronze': { icon: <Trophy className="h-5 w-5 text-amber-600" />, color: 'text-amber-600', nextTier: 'Silver', minPoints: 0 },
      'Silver': { icon: <Crown className="h-5 w-5 text-gray-500" />, color: 'text-gray-500', nextTier: 'Gold', minPoints: 1000 },
      'Gold': { icon: <Crown className="h-5 w-5 text-yellow-500" />, color: 'text-yellow-500', nextTier: 'Platinum', minPoints: 4000 },
      'Platinum': { icon: <Gem className="h-5 w-5 text-purple-600" />, color: 'text-purple-600', nextTier: 'Diamond', minPoints: 10000 }
    };
    return tiers[tier as keyof typeof tiers] || tiers.Bronze;
  };

  const redeemReward = async (reward: RewardItem) => {
    if (userRewards.totalPoints < reward.cost) {
      toast({
        title: "Insufficient Points",
        description: `You need ${reward.cost - userRewards.totalPoints} more points to redeem this reward`,
        variant: "destructive"
      });
      return;
    }

    setUserRewards(prev => ({
      ...prev,
      totalPoints: prev.totalPoints - reward.cost,
      redeemedPoints: prev.redeemedPoints + reward.cost
    }));

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'redeemed',
      points: -reward.cost,
      description: `${reward.name} redeemed`,
      date: new Date().toISOString().split('T')[0]
    };

    setTransactions([newTransaction, ...transactions]);

    toast({
      title: "Reward Redeemed!",
      description: `${reward.name} has been added to your account`
    });
  };

  const tierInfo = getTierInfo(userRewards.currentTier);
  const progressPercentage = ((4000 - userRewards.pointsToNextTier) / 4000) * 100;

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-48 bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Banqa Rewards</h2>
        <p className="text-muted-foreground">Earn points with every transaction and redeem amazing rewards</p>
      </div>

      {/* Rewards Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              {userRewards.totalPoints.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {tierInfo.icon}
              <span className="text-2xl font-bold" style={{ color: tierInfo.color.replace('text-', '') }}>
                {userRewards.currentTier}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lifetime Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userRewards.lifetimePoints.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tier Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Tier Progress</CardTitle>
          <CardDescription>
            {userRewards.pointsToNextTier} points to reach {tierInfo.nextTier} tier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="w-full" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{userRewards.currentTier}</span>
            <span>{tierInfo.nextTier}</span>
          </div>
        </CardContent>
      </Card>

      {/* Rewards Catalog */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Rewards</TabsTrigger>
          <TabsTrigger value="airtime">Airtime</TabsTrigger>
          <TabsTrigger value="bills">Bill Discounts</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewardItems.map(reward => (
              <Card key={reward.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {reward.icon}
                      <CardTitle className="text-lg">{reward.name}</CardTitle>
                    </div>
                    <Badge variant="secondary">
                      {reward.cost} pts
                    </Badge>
                  </div>
                  <CardDescription>{reward.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => redeemReward(reward)}
                    disabled={userRewards.totalPoints < reward.cost}
                    className="w-full"
                  >
                    {userRewards.totalPoints < reward.cost ? 'Insufficient Points' : 'Redeem'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="airtime" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewardItems
              .filter(reward => reward.category === 'airtime')
              .map(reward => (
                <Card key={reward.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {reward.icon}
                        <CardTitle className="text-lg">{reward.name}</CardTitle>
                      </div>
                      <Badge variant="secondary">
                        {reward.cost} pts
                      </Badge>
                    </div>
                    <CardDescription>{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => redeemReward(reward)}
                      disabled={userRewards.totalPoints < reward.cost}
                      className="w-full"
                    >
                      {userRewards.totalPoints < reward.cost ? 'Insufficient Points' : 'Redeem'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="bills" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewardItems
              .filter(reward => reward.category === 'bills')
              .map(reward => (
                <Card key={reward.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {reward.icon}
                        <CardTitle className="text-lg">{reward.name}</CardTitle>
                      </div>
                      <Badge variant="secondary">
                        {reward.cost} pts
                      </Badge>
                    </div>
                    <CardDescription>{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => redeemReward(reward)}
                      disabled={userRewards.totalPoints < reward.cost}
                      className="w-full"
                    >
                      {userRewards.totalPoints < reward.cost ? 'Insufficient Points' : 'Redeem'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="donations" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewardItems
              .filter(reward => reward.category === 'donations')
              .map(reward => (
                <Card key={reward.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {reward.icon}
                        <CardTitle className="text-lg">{reward.name}</CardTitle>
                      </div>
                      <Badge variant="secondary">
                        {reward.cost} pts
                      </Badge>
                    </div>
                    <CardDescription>{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => redeemReward(reward)}
                      disabled={userRewards.totalPoints < reward.cost}
                      className="w-full"
                    >
                      {userRewards.totalPoints < reward.cost ? 'Insufficient Points' : 'Redeem'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Points History</CardTitle>
              <CardDescription>Your recent points activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                    <div className={`font-bold ${transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'earned' ? '+' : ''}{transaction.points} pts
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
