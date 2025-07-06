
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Settings, Plus, Eye, EyeOff, Lock, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VirtualCard {
  id: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  balance: number;
  isActive: boolean;
  spendingLimit: number;
  autoTopUp: boolean;
  autoTopUpThreshold: number;
  autoTopUpAmount: number;
  cardName: string;
}

export const BanqaCard: React.FC = () => {
  const [cards, setCards] = useState<VirtualCard[]>([]);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    // Simulate loading cards
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockCards: VirtualCard[] = [
      {
        id: '1',
        cardNumber: '5399 **** **** 2847',
        expiryDate: '12/27',
        cvv: '***',
        balance: 25000,
        isActive: true,
        spendingLimit: 50000,
        autoTopUp: true,
        autoTopUpThreshold: 5000,
        autoTopUpAmount: 20000,
        cardName: 'Primary Utility Card'
      }
    ];
    
    setCards(mockCards);
    setSelectedCard(mockCards[0]?.id || '');
    setLoading(false);
  };

  const createNewCard = async () => {
    const newCard: VirtualCard = {
      id: Date.now().toString(),
      cardNumber: `5399 **** **** ${Math.floor(1000 + Math.random() * 9000)}`,
      expiryDate: '12/28',
      cvv: '***',
      balance: 0,
      isActive: true,
      spendingLimit: 30000,
      autoTopUp: false,
      autoTopUpThreshold: 5000,
      autoTopUpAmount: 15000,
      cardName: `BanqaCard ${cards.length + 1}`
    };

    setCards([...cards, newCard]);
    setSelectedCard(newCard.id);
    
    toast({
      title: "BanqaCard Created",
      description: "Your new virtual utility card is ready to use"
    });
  };

  const updateCardSettings = (cardId: string, updates: Partial<VirtualCard>) => {
    setCards(cards.map(card => 
      card.id === cardId ? { ...card, ...updates } : card
    ));
    
    toast({
      title: "Settings Updated",
      description: "Card settings have been saved"
    });
  };

  const topUpCard = async (cardId: string, amount: number) => {
    setCards(cards.map(card => 
      card.id === cardId ? { ...card, balance: card.balance + amount } : card
    ));
    
    toast({
      title: "Card Topped Up",
      description: `₦${amount.toLocaleString()} added to your BanqaCard`
    });
  };

  const selectedCardData = cards.find(card => card.id === selectedCard);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-48 bg-muted rounded-lg"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">BanqaCard</h2>
          <p className="text-muted-foreground">Virtual prepaid cards for utility payments</p>
        </div>
        <Button onClick={createNewCard}>
          <Plus className="h-4 w-4 mr-2" />
          Create Card
        </Button>
      </div>

      {cards.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No BanqaCards Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first virtual utility card to start making secure payments
            </p>
            <Button onClick={createNewCard}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Card
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={selectedCard} onValueChange={setSelectedCard} className="space-y-4">
          <TabsList className="grid w-full grid-cols-1">
            {cards.map(card => (
              <TabsTrigger key={card.id} value={card.id} className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                {card.cardName}
                <Badge variant={card.isActive ? "default" : "secondary"}>
                  {card.isActive ? "Active" : "Inactive"}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {cards.map(card => (
            <TabsContent key={card.id} value={card.id} className="space-y-6">
              {/* Card Display */}
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <Zap className="h-6 w-6" />
                      <span className="font-bold text-lg">BanqaCard</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCardDetails(!showCardDetails)}
                      className="text-white hover:bg-white/20"
                    >
                      {showCardDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-2xl font-mono tracking-wider">
                      {showCardDetails ? '5399 1234 5678 2847' : card.cardNumber}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs opacity-80">VALID THRU</div>
                        <div className="font-mono">{card.expiryDate}</div>
                      </div>
                      <div>
                        <div className="text-xs opacity-80">CVV</div>
                        <div className="font-mono">{showCardDetails ? '847' : card.cvv}</div>
                      </div>
                      <div>
                        <div className="text-xs opacity-80">BALANCE</div>
                        <div className="font-bold">₦{card.balance.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Controls */}
              <Tabs defaultValue="balance" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="balance">Balance & Top-up</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                </TabsList>

                <TabsContent value="balance" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top-up Card</CardTitle>
                      <CardDescription>Add funds to your BanqaCard</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        {[5000, 10000, 20000].map(amount => (
                          <Button
                            key={amount}
                            variant="outline"
                            onClick={() => topUpCard(card.id, amount)}
                            className="h-12"
                          >
                            ₦{amount.toLocaleString()}
                          </Button>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Input placeholder="Custom amount" type="number" />
                        <Button>Top-up</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Auto Top-up</CardTitle>
                      <CardDescription>Automatically add funds when balance runs low</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="autoTopUp">Enable Auto Top-up</Label>
                        <Switch
                          id="autoTopUp"
                          checked={card.autoTopUp}
                          onCheckedChange={(checked) => updateCardSettings(card.id, { autoTopUp: checked })}
                        />
                      </div>
                      
                      {card.autoTopUp && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="threshold">Top-up when balance falls below</Label>
                            <Input
                              id="threshold"
                              type="number"
                              value={card.autoTopUpThreshold}
                              onChange={(e) => updateCardSettings(card.id, { autoTopUpThreshold: parseInt(e.target.value) })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="amount">Auto top-up amount</Label>
                            <Input
                              id="amount"
                              type="number"
                              value={card.autoTopUpAmount}
                              onChange={(e) => updateCardSettings(card.id, { autoTopUpAmount: parseInt(e.target.value) })}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Card Settings</CardTitle>
                      <CardDescription>Manage your card preferences and limits</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="cardName">Card Name</Label>
                        <Input
                          id="cardName"
                          value={card.cardName}
                          onChange={(e) => updateCardSettings(card.id, { cardName: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="spendingLimit">Monthly Spending Limit</Label>
                        <Input
                          id="spendingLimit"
                          type="number"
                          value={card.spendingLimit}
                          onChange={(e) => updateCardSettings(card.id, { spendingLimit: parseInt(e.target.value) })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="cardActive">Card Active</Label>
                        <Switch
                          id="cardActive"
                          checked={card.isActive}
                          onCheckedChange={(checked) => updateCardSettings(card.id, { isActive: checked })}
                        />
                      </div>
                      
                      <div className="pt-4 border-t">
                        <Button variant="destructive" className="w-full">
                          <Lock className="h-4 w-4 mr-2" />
                          Freeze Card
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="transactions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Transactions</CardTitle>
                      <CardDescription>Your BanqaCard payment history</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-muted-foreground">
                        No transactions yet
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};
