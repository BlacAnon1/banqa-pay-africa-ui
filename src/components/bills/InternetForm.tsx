
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Wifi, ArrowLeft, CreditCard, Wallet } from 'lucide-react';
import { useRealTimeWallet } from '@/hooks/useRealTimeWallet';
import { useDirectServicePayment } from '@/hooks/useDirectServicePayment';
import { toast } from '@/hooks/use-toast';

interface InternetFormProps {
  onBack: () => void;
}

const internetProviders = [
  { id: 'mtn_internet', name: 'MTN Internet', plans: ['5GB - ₦2,500', '10GB - ₦5,000', '20GB - ₦8,000'] },
  { id: 'glo_internet', name: 'Glo Internet', plans: ['3GB - ₦1,500', '8GB - ₦3,500', '15GB - ₦6,000'] },
  { id: 'airtel_internet', name: 'Airtel Internet', plans: ['4GB - ₦2,000', '12GB - ₦4,500', '25GB - ₦9,000'] },
  { id: 'spectranet', name: 'Spectranet', plans: ['Unlimited Lite - ₦8,500', 'Unlimited Premium - ₦15,000'] },
  { id: 'smile', name: 'Smile Communications', plans: ['5GB - ₦3,000', '10GB - ₦5,500', '30GB - ₦12,000'] },
];

export const InternetForm = ({ onBack }: InternetFormProps) => {
  const [deviceId, setDeviceId] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [processing, setProcessing] = useState(false);
  
  const { wallet, syncWallet } = useRealTimeWallet();
  const { initializeServicePayment } = useDirectServicePayment();

  const processInternetService = async (reference: string, amountNum: number) => {
    try {
      console.log('Processing internet service delivery...');
      
      // This would be implemented with internet provider APIs
      // For now, we'll simulate the process
      toast({
        title: "Internet Subscription Successful!",
        description: `${selectedPlan} subscription activated for device ${deviceId}`,
        duration: 5000,
      });

      setDeviceId('');
      setSelectedProvider('');
      setSelectedPlan('');
      
    } catch (error) {
      console.error('Internet service delivery failed:', error);
      
      if (paymentMethod === 'wallet') {
        console.log('Refunding wallet due to service failure...');
        await syncWallet(amountNum, 'credit', `REFUND_${reference}`, {
          service_type: 'internet_refund',
          original_reference: reference,
          reason: 'Service delivery failed'
        });
        
        toast({
          title: "Service Failed - Refund Processed",
          description: `₦${amountNum.toLocaleString()} has been refunded to your wallet due to service failure.`,
          variant: "destructive",
          duration: 7000,
        });
      }
      
      throw error;
    }
  };

  const handleWalletPayment = async (amountNum: number) => {
    if (!wallet || wallet.balance < amountNum) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance in your wallet.",
        variant: "destructive",
      });
      return;
    }

    const reference = `INTERNET_${Date.now()}`;
    
    try {
      const provider = internetProviders.find(p => p.id === selectedProvider);
      const syncResult = await syncWallet(-amountNum, 'debit', reference, {
        service_type: 'internet',
        provider: provider?.name,
        device_id: deviceId,
        plan: selectedPlan
      });

      if (syncResult.error) {
        throw new Error(syncResult.error);
      }

      await processInternetService(reference, amountNum);
      
    } catch (error) {
      console.error('Wallet payment failed:', error);
      throw error;
    }
  };

  const handleDirectPayment = async (amountNum: number) => {
    try {
      console.log('Initializing direct payment for internet...');
      
      const provider = internetProviders.find(p => p.id === selectedProvider);
      await initializeServicePayment({
        service_type: 'internet',
        amount: amountNum,
        service_data: {
          provider_id: selectedProvider,
          provider_name: provider?.name,
          device_id: deviceId,
          plan: selectedPlan
        }
      });

      setDeviceId('');
      setSelectedProvider('');
      setSelectedPlan('');
      
    } catch (error) {
      console.error('Direct payment failed:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProvider || !selectedPlan || !deviceId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Extract amount from plan string
    const amountMatch = selectedPlan.match(/₦([\d,]+)/);
    if (!amountMatch) {
      toast({
        title: "Invalid Plan",
        description: "Could not determine plan cost.",
        variant: "destructive",
      });
      return;
    }

    const amountNum = parseFloat(amountMatch[1].replace(',', ''));
    setProcessing(true);

    try {
      if (paymentMethod === 'wallet') {
        await handleWalletPayment(amountNum);
      } else {
        await handleDirectPayment(amountNum);
      }
    } catch (error) {
      console.error('Transaction failed:', error);
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Failed to process transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const selectedProviderData = internetProviders.find(p => p.id === selectedProvider);
  const amountMatch = selectedPlan.match(/₦([\d,]+)/);
  const planAmount = amountMatch ? amountMatch[1] : '0';

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <Wifi className="h-5 w-5 text-secondary-foreground" />
                </div>
                Internet Subscription
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="provider">Internet Provider</Label>
              <Select value={selectedProvider} onValueChange={(value) => {
                setSelectedProvider(value);
                setSelectedPlan(''); // Reset plan when provider changes
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select internet provider" />
                </SelectTrigger>
                <SelectContent>
                  {internetProviders.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProviderData && (
              <div className="space-y-2">
                <Label htmlFor="plan">Select Plan</Label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProviderData.plans.map((plan, index) => (
                      <SelectItem key={index} value={plan}>
                        {plan}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="deviceId">Device ID / Account Number</Label>
              <Input
                id="deviceId"
                type="text"
                placeholder="Enter device ID or account number"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Payment Method</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-3">
                  <RadioGroupItem value="wallet" id="wallet" />
                  <Label htmlFor="wallet" className="flex items-center gap-2 cursor-pointer">
                    <Wallet className="h-4 w-4" />
                    Wallet Balance
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3">
                  <RadioGroupItem value="direct" id="direct" />
                  <Label htmlFor="direct" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="h-4 w-4" />
                    Card/Transfer
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {selectedProvider && selectedPlan && deviceId && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Transaction Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Provider:</span>
                    <span>{selectedProviderData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span>{selectedPlan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Device ID:</span>
                    <span>{deviceId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span>{paymentMethod === 'wallet' ? 'Wallet Balance' : 'Card/Transfer'}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total Cost:</span>
                    <span>₦{planAmount}</span>
                  </div>
                  {paymentMethod === 'wallet' && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Wallet Balance:</span>
                      <span>₦{wallet?.balance?.toLocaleString() || '0.00'}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary/90"
              disabled={processing || !selectedProvider || !selectedPlan || !deviceId}
            >
              {processing ? 'Processing...' : paymentMethod === 'wallet' ? 'Pay from Wallet' : 'Pay with Card/Transfer'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
