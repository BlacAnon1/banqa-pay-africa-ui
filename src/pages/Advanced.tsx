
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BiometricAuth } from '@/components/biometric/BiometricAuth';
import { SmartInsights } from '@/components/insights/SmartInsights';
import { MultiCountryWallet } from '@/components/wallet/MultiCountryWallet';
import { BanqaCard } from '@/components/cards/BanqaCard';
import { RewardsSystem } from '@/components/rewards/RewardsSystem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Fingerprint, 
  Brain, 
  Wallet, 
  CreditCard, 
  Star, 
  Smartphone,
  QrCode,
  FileImage,
  Users,
  Package
} from 'lucide-react';

const Advanced = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Advanced Features</h1>
        <p className="text-muted-foreground">Explore innovative fintech capabilities powered by AI and biometrics</p>
      </div>

      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Smart Insights</span>
          </TabsTrigger>
          <TabsTrigger value="wallets" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">Multi-Wallets</span>
          </TabsTrigger>
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">BanqaCard</span>
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Rewards</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">More</span>
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

        <TabsContent value="features" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Additional Features</h2>
            <p className="text-muted-foreground mb-6">More innovative capabilities coming soon</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Biometric Authentication */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Fingerprint className="h-5 w-5" />
                  <CardTitle>Biometric Auth</CardTitle>
                  <Badge variant="secondary">Available</Badge>
                </div>
                <CardDescription>
                  Secure payments with fingerprint or facial recognition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BiometricAuth
                  onSuccess={() => console.log('Biometric auth successful')}
                  onFallback={() => console.log('Fallback to PIN')}
                  title="Demo Authentication"
                  description="Try biometric authentication"
                />
              </CardContent>
            </Card>

            {/* Offline Payments */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  <CardTitle>Offline Payments</CardTitle>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
                <CardDescription>
                  Pay bills using USSD codes even without internet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• USSD code support for basic phones</p>
                  <p>• Works across all networks</p>
                  <p>• No internet connection required</p>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Payments */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  <CardTitle>QR Payments</CardTitle>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
                <CardDescription>
                  Scan QR codes to pay bills instantly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Quick scan-to-pay functionality</p>
                  <p>• Generate payment QR codes</p>
                  <p>• Share bills with friends</p>
                </div>
              </CardContent>
            </Card>

            {/* AI Bill Assistant */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileImage className="h-5 w-5" />
                  <CardTitle>AI Bill Assistant</CardTitle>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
                <CardDescription>
                  Upload bill images for automatic processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• OCR text recognition</p>
                  <p>• Auto-fill payment details</p>
                  <p>• Support for images and PDFs</p>
                </div>
              </CardContent>
            </Card>

            {/* Bill Splitting */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <CardTitle>Bill Splitting</CardTitle>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
                <CardDescription>
                  Share bills with friends and split costs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Invite friends to share bills</p>
                  <p>• Automatic portion calculation</p>
                  <p>• Payment reminders</p>
                </div>
              </CardContent>
            </Card>

            {/* Bundled Payments */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  <CardTitle>Bundle Payments</CardTitle>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
                <CardDescription>
                  Pay multiple utilities with discounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Monthly utility bundles</p>
                  <p>• Exclusive discounts</p>
                  <p>• Simplified payment process</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Advanced;
