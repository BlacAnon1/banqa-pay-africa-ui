
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tv, ArrowLeft, CreditCard, Wallet } from 'lucide-react';
import { useRealTimeWallet } from '@/hooks/useRealTimeWallet';
import { useDirectServicePayment } from '@/hooks/useDirectServicePayment';
import { toast } from '@/hooks/use-toast';

interface TVFormProps {
  onBack: () => void;
}

const tvProviders = [
  { 
    id: 'dstv', 
    name: 'DSTV', 
    packages: [
      'Padi - ₦2,500',
      'Yanga - ₦3,500',
      'Confam - ₦6,200',
      'Compact - ₦10,500',
      'Compact Plus - ₦16,600',
      'Premium - ₦24,500'
    ]
  },
  { 
    id: 'gotv', 
    name: 'GOtv', 
    packages: [
      'Lite - ₦1,100',
      'Max - ₦2,250',
      'Jolli - ₦3,300',
      'Super - ₦5,500'
    ]
  },
  { 
    id: 'startimes', 
    name: 'Startimes', 
    packages: [
      'Nova - ₦1,300',
      'Basic - ₦2,200',
      'Smart - ₦3,000',
      'Classic - ₦4,200',
      'Super - ₦6,200'
    ]
  }
];

export const TVForm = ({ onBack }: TVFormProps) => {
  const [smartCardNumber, setSmartCardNumber] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [customerName, setCustomerName] = useState('');
  const [processing, setProcessing] = useState(false);
  
  const { wallet, syncWallet } = useRealTimeWallet();
  const { initializeServicePayment } = useDirectServicePayment();

  const processTVService = async (reference: string, amountNum: number) => {
    try {
      console.log('Processing TV service delivery...');
      
      // This would be implemented with TV provider APIs
      // For now, we'll simulate the process
      toast({
        title: "TV Subscription Successful!",
        description: `${selectedPackage} subscription activated for smart card ${smartCardNumber}`,
        duration: 5000,
      });

      setSmartCardNumber('');
      setSelectedProvider('');
      setSelectedPackage('');
      setCustomerName('');
      
    } catch (error) {
      console.error('TV service delivery failed:', error);
      
      if (paymentMethod === 'wallet') {
        console.log('Refunding wallet due to service failure...');
        await syncWallet(amountNum, 'credit', `REFUND_${reference}`, {
          service_type: 'tv_refund',
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

    const reference = `TV_${Date.now()}`;
    
    try {
      const provider = tvProviders.find(p => p.id === selectedProvider);
      const syncResult = await syncWallet(-amountNum, 'debit', reference, {
        service_type: 'tv',
        provider: provider?.name,
        smart_card_number: smartCardNumber,
        package: selectedPackage
      });

      if (syncResult.error) {
        throw new Error(syncResult.error);
      }

      await processTVService(reference, amountNum);
      
    } catch (error) {
      console.error('Wallet payment failed:', error);
      throw error;
    }
  };

  const handleDirectPayment = async (amountNum: number) => {
    try {
      console.log('Initializing direct payment for TV...');
      
      const provider = tvProviders.find(p => p.id === selectedProvider);
      await initializeServicePayment({
        service_type: 'tv',
        amount: amountNum,
        service_data: {
          provider_id: selectedProvider,
          provider_name: provider?.name,
          smart_card_number: smartCardNumber,
          package: selectedPackage,
          customer_name: customerName
        }
      });

      setSmartCardNumber('');
      setSelectedProvider('');
      setSelectedPackage('');
      setCustomerName('');
      
    } catch (error) {
      console.error('Direct payment failed:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProvider || !selectedPackage || !smartCardNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Extract amount from package string
    const amountMatch = selectedPackage.match(/₦([\d,]+)/);
    if (!amountMatch) {
      toast({
        title: "Invalid Package",
        description: "Could not determine package cost.",
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

  const selectedProviderData = tvProviders.find(p => p.id === selectedProvider);
  const amountMatch = selectedPackage.match(/₦([\d,]+)/);
  const packageAmount = amountMatch ? amountMatch[1] : '0';

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
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
                  <Tv className="h-5 w-5 text-white" />
                </div>
                TV Subscription
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="provider">TV Provider</Label>
              <Select value={selectedProvider} onValueChange={(value) => {
                setSelectedProvider(value);
                setSelectedPackage(''); // Reset package when provider changes
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select TV provider" />
                </SelectTrigger>
                <SelectContent>
                  {tvProviders.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProviderData && (
              <div className="space-y-2">
                <Label htmlFor="package">Select Package</Label>
                <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a package" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProviderData.packages.map((pkg, index) => (
                      <SelectItem key={index} value={pkg}>
                        {pkg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="smartCardNumber">Smart Card Number</Label>
              <Input
                id="smartCardNumber"
                type="text"
                placeholder="Enter smart card number"
                value={smartCardNumber}
                onChange={(e) => setSmartCardNumber(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name (Optional)</Label>
              <Input
                id="customerName"
                type="text"
                placeholder="Enter customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
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

            {selectedProvider && selectedPackage && smartCardNumber && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Transaction Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Provider:</span>
                    <span>{selectedProviderData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Package:</span>
                    <span>{selectedPackage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Smart Card:</span>
                    <span>{smartCardNumber}</span>
                  </div>
                  {customerName && (
                    <div className="flex justify-between">
                      <span>Customer Name:</span>
                      <span>{customerName}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span>{paymentMethod === 'wallet' ? 'Wallet Balance' : 'Card/Transfer'}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total Cost:</span>
                    <span>₦{packageAmount}</span>
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
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={processing || !selectedProvider || !selectedPackage || !smartCardNumber}
            >
              {processing ? 'Processing...' : paymentMethod === 'wallet' ? 'Pay from Wallet' : 'Pay with Card/Transfer'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
