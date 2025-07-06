
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Gift, Smartphone, Zap, Heart, Trophy, Crown, Gem } from 'lucide-react';
import { useRewardsSystem } from '@/hooks/useRewardsSystem';

export const RewardsSystem: React.FC = () => {
  const { userRewards, rewardItems, transactions, loading, redeemReward } = useRewardsSystem();

  const getTierInfo = (tier: string) => {
    const tiers = {
      'Bronze': { icon: <Trophy className="h-5 w-5 text-amber-600" />, color: 'text-amber-600', nextTier: 'Silver', minPoints: 0 },
      'Silver': { icon: <Crown className="h-5 w-5 text-gray-500" />, color: 'text-gray-500', nextTier: 'Gold', minPoints: 1000 },
      'Gold': { icon: <Crown className="h-5 w-5 text-yellow-500" />, color: 'text-yellow-500', nextTier: 'Platinum', minPoints: 4000 },
      'Platinum': { icon: <Gem className="h-5 w-5 text-purple-600" />, color: 'text-purple-600', nextTier: 'Diamond', minPoints: 10000 }
    };
    return tiers[tier as keyof typeof tiers] || tiers.Bronze;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'airtime': return <Smartphone className="h-5 w-5" />;
      case 'bills': return <Zap className="h-5 w-5" />;
      case 'donations': return <Heart className="h-5 w-5" />;
      default: return <Gift className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-48 bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!userRewards) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Banqa Rewards</CardTitle>
          <CardDescription>Earn points with every transaction and redeem amazing rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Welcome to Banqa Rewards!</h3>
            <p className="text-muted-foreground">
              Start making payments to earn points and unlock exclusive rewards.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const tierInfo = getTierInfo(userRewards.currentTier);
  const progressPercentage = userRewards.pointsToNextTier > 0 
    ? ((4000 - userRewards.pointsToNextTier) / 4000) * 100 
    : 100;

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
      {userRewards.pointsToNextTier > 0 && (
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
      )}

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
          {rewardItems.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No rewards available at the moment.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewardItems.map(reward => (
                <Card key={reward.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(reward.category)}
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
          )}
        </TabsContent>

        {['airtime', 'bills', 'donations'].map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewardItems
                .filter(reward => reward.category === category)
                .map(reward => (
                  <Card key={reward.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(reward.category)}
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
        ))}

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Points History</CardTitle>
              <CardDescription>Your recent points activity</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No transaction history yet.</p>
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
