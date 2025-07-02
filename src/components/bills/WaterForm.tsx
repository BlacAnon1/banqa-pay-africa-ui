
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Droplets, ArrowLeft, CreditCard, Wallet } from 'lucide-react';
import { useRealTimeWallet } from '@/hooks/useRealTimeWallet';
import { useDirectServicePayment } from '@/hooks/useDirectServicePayment';
import { toast } from '@/hooks/use-toast';

interface WaterFormProps {
  onBack: () => void;
}

const waterProviders = [
  { id: 'lagos_water', name: 'Lagos Water Corporation', state: 'Lagos' },
  { id: 'abuja_water', name: 'FCT Water Board', state: 'Abuja' },
  { id: 'kano_water', name: 'Kano State Water Board', state: 'Kano' },
  { id: 'rivers_water', name: 'Rivers State Water Board', state: 'Rivers' },
  { id: 'ogun_water', name: 'Ogun State Water Corporation', state: 'Ogun' },
];

export const WaterForm = ({ onBack }: WaterFormProps) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [processing, setProcessing] = useState(false);
  
  const { wallet, syncWallet } = useRealTimeWallet();
  const { initializeServicePayment } = useDirectServicePayment();

  const processWaterService = async (reference: string, amountNum: number) => {
    try {
      console.log('Processing water service delivery...');
      
      // This would be implemented with a third-party water bills API
      // For now, we'll simulate the process
      toast({
        title: "Water Bill Paid Successfully!",
        description: `₦${amountNum.toLocaleString()} water bill paid for account ${accountNumber}`,
        duration: 5000,
      });

      setAccountNumber('');
      setAmount('');
      setSelectedProvider('');
      setCustomerName('');
      
    } catch (error) {
      console.error('Water service delivery failed:', error);
      
      if (paymentMethod === 'wallet') {
        console.log('Refunding wallet due to service failure...');
        await syncWallet(amountNum, 'credit', `REFUND_${reference}`, {
          service_type: 'water_refund',
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

    const reference = `WATER_${Date.now()}`;
    
    try {
      const provider = waterProviders.find(p => p.id === selectedProvider);
      const syncResult = await syncWallet(-amountNum, 'debit', reference, {
        service_type: 'water',
        provider: provider?.name,
        account_number: accountNumber
      });

      if (syncResult.error) {
        throw new Error(syncResult.error);
      }

      await processWaterService(reference, amountNum);
      
    } catch (error) {
      console.error('Wallet payment failed:', error);
      throw error;
    }
  };

  const handleDirectPayment = async (amountNum: number) => {
    try {
      console.log('Initializing direct payment for water...');
      
      const provider = waterProviders.find(p => p.id === selectedProvider);
      await initializeServicePayment({
        service_type: 'water',
        amount: amountNum,
        service_data: {
          provider_id: selectedProvider,
          provider_name: provider?.name,
          account_number: accountNumber,
          customer_name: customerName,
          state: provider?.state
        }
      });

      setAccountNumber('');
      setAmount('');
      setSelectedProvider('');
      setCustomerName('');
      
    } catch (error) {
      console.error('Direct payment failed:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProvider || !accountNumber || !amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const amountNum = parseFloat(amount);
    
    if (amountNum < 100) {
      toast({
        title: "Invalid Amount",
        description: "Minimum amount is ₦100.",
        variant: "destructive",
      });
      return;
    }

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
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Droplets className="h-5 w-5 text-primary-foreground" />
                </div>
                Water Bill
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="provider">Water Provider</Label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Select water provider" />
                </SelectTrigger>
                <SelectContent>
                  {waterProviders.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name} ({provider.state})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                type="text"
                placeholder="Enter account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
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

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount (minimum ₦100)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="100"
                step="1"
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

            {selectedProvider && accountNumber && amount && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Transaction Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Provider:</span>
                    <span>{waterProviders.find(p => p.id === selectedProvider)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Number:</span>
                    <span>{accountNumber}</span>
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
                    <span>₦{amount}</span>
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
              className="w-full banqa-gradient hover:opacity-90"
              disabled={processing || !selectedProvider || !accountNumber || !amount}
            >
              {processing ? 'Processing...' : paymentMethod === 'wallet' ? 'Pay from Wallet' : 'Pay with Card/Transfer'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
