
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreditCard, Plus, Eye, EyeOff, Settings } from 'lucide-react';
import { useVirtualCards } from '@/hooks/useVirtualCards';

export const BanqaCard: React.FC = () => {
  const { cards, loading, createCard, topUpCard } = useVirtualCards();
  const [showCardNumbers, setShowCardNumbers] = useState(false);
  const [newCardName, setNewCardName] = useState('');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [selectedCardId, setSelectedCardId] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTopUpDialogOpen, setIsTopUpDialogOpen] = useState(false);

  const handleCreateCard = async () => {
    if (!newCardName.trim()) return;
    
    await createCard(newCardName);
    setNewCardName('');
    setIsCreateDialogOpen(false);
  };

  const handleTopUp = async () => {
    if (!topUpAmount || !selectedCardId) return;
    
    const amount = parseFloat(topUpAmount);
    if (amount <= 0) return;

    await topUpCard(selectedCardId, amount);
    setTopUpAmount('');
    setSelectedCardId('');
    setIsTopUpDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-32 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">BanqaCard</h2>
          <p className="text-muted-foreground">Virtual prepaid cards for utility payments</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCardNumbers(!showCardNumbers)}
          >
            {showCardNumbers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Card
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New BanqaCard</DialogTitle>
                <DialogDescription>
                  Create a virtual card exclusively for utility payments
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardName">Card Name</Label>
                  <Input
                    id="cardName"
                    placeholder="e.g., My Utility Card"
                    value={newCardName}
                    onChange={(e) => setNewCardName(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreateCard} className="w-full">
                  Create Card
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {cards.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No BanqaCards yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first virtual card to start making secure utility payments.
              </p>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Card
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <Card key={card.id} className="relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge variant={card.isActive ? "default" : "secondary"}>
                  {card.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              
              {/* Card Visual */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 m-4 rounded-xl">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-sm opacity-80">BanqaCard</p>
                    <h3 className="font-semibold">{card.cardName}</h3>
                  </div>
                  <div className="w-12 h-8 bg-white/20 rounded"></div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-lg font-mono tracking-widest">
                      {showCardNumbers ? card.maskedNumber : '•••• •••• •••• ••••'}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-80">EXPIRES</p>
                      <p className="font-mono">
                        {String(card.expiryMonth).padStart(2, '0')}/{String(card.expiryYear).slice(-2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-80">BALANCE</p>
                      <p className="text-xl font-bold">₦{card.balance.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Daily Limit</p>
                    <p className="font-semibold">₦{card.dailyLimit.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly Limit</p>
                    <p className="font-semibold">₦{card.monthlyLimit.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={card.autoTopupEnabled}
                      disabled
                    />
                    <Label className="text-sm">Auto Top-up</Label>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Dialog open={isTopUpDialogOpen} onOpenChange={setIsTopUpDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setSelectedCardId(card.id)}
                      >
                        Top Up
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                  <Button variant="outline" className="flex-1">
                    View Transactions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Top Up Dialog */}
      <Dialog open={isTopUpDialogOpen} onOpenChange={setIsTopUpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Top Up BanqaCard</DialogTitle>
            <DialogDescription>
              Add funds to your virtual card from your wallet
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[5000, 10000, 20000].map(amount => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setTopUpAmount(amount.toString())}
                >
                  ₦{amount.toLocaleString()}
                </Button>
              ))}
            </div>
            <Button onClick={handleTopUp} className="w-full">
              Top Up Card
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
