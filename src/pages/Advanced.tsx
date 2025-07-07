
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BiometricAuth } from '@/components/biometric/BiometricAuth';
import { SmartInsights } from '@/components/insights/SmartInsights';
import { MultiCountryWallet } from '@/components/wallet/MultiCountryWallet';
import { BanqaCard } from '@/components/cards/BanqaCard';
import { RewardsSystem } from '@/components/rewards/RewardsSystem';
import { QRCodePayments } from '@/components/payments/QRCodePayments';
import { OfflinePayments } from '@/components/payments/OfflinePayments';
import { AIBillAssistant } from '@/components/ai/AIBillAssistant';
import { BillSplitting } from '@/components/bills/BillSplitting';
import { BundledPayments } from '@/components/payments/BundledPayments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Fingerprint, 
  Brain, 
  Wallet, 
  CreditCard, 
  Star, 
  QrCode,
  WifiOff,
  Bot,
  Users,
  Package
} from 'lucide-react';

const Advanced = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Advanced Features</h1>
        <p className="text-muted-foreground">Innovative fintech capabilities powered by AI and cutting-edge technology</p>
      </div>

      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Insights</span>
          </TabsTrigger>
          <TabsTrigger value="wallets" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">Wallets</span>
          </TabsTrigger>
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Cards</span>
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Rewards</span>
          </TabsTrigger>
          <TabsTrigger value="qr" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            <span className="hidden sm:inline">QR Pay</span>
          </TabsTrigger>
          <TabsTrigger value="offline" className="flex items-center gap-2">
            <WifiOff className="h-4 w-4" />
            <span className="hidden sm:inline">Offline</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">AI Assistant</span>
          </TabsTrigger>
          <TabsTrigger value="split" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Split Bills</span>
          </TabsTrigger>
          <TabsTrigger value="bundles" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Bundles</span>
          </TabsTrigger>
          <TabsTrigger value="biometric" className="flex items-center gap-2">
            <Fingerprint className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights">
          <SmartInsights />
        </TabsContent>

        <TabsContent value="wallets">
          <MultiCountryWallet />
        </TabsContent>

        <TabsContent value="cards">
          <BanqaCard />
        </TabsContent>

        <TabsContent value="rewards">
          <RewardsSystem />
        </TabsContent>

        <TabsContent value="qr">
          <QRCodePayments />
        </TabsContent>

        <TabsContent value="offline">
          <OfflinePayments />
        </TabsContent>

        <TabsContent value="ai">
          <AIBillAssistant />
        </TabsContent>

        <TabsContent value="split">
          <BillSplitting />
        </TabsContent>

        <TabsContent value="bundles">
          <BundledPayments />
        </TabsContent>

        <TabsContent value="biometric">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Biometric Security</h2>
              <p className="text-muted-foreground mb-6">Enhanced security with fingerprint and facial recognition</p>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Fingerprint className="h-5 w-5" />
                  <CardTitle>Biometric Authentication</CardTitle>
                  <Badge variant="secondary">Available</Badge>
                </div>
                <CardDescription>
                  Secure your payments with fingerprint or facial recognition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BiometricAuth
                  onSuccess={() => console.log('Biometric auth successful')}
                  onFallback={() => console.log('Fallback to PIN')}
                  title="Payment Authorization"
                  description="Authenticate to proceed with payment"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Advanced;
