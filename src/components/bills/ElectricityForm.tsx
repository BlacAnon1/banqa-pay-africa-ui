
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Zap, ArrowLeft, CreditCard, Wallet } from 'lucide-react';
import { useRealTimeWallet } from '@/hooks/useRealTimeWallet';
import { useDirectServicePayment } from '@/hooks/useDirectServicePayment';
import { toast } from '@/hooks/use-toast';

interface ElectricityFormProps {
  onBack: () => void;
}

const electricityProviders = [
  { id: 'aedc', name: 'Abuja Electricity Distribution Company (AEDC)', code: 'AEDC' },
  { id: 'ekedc', name: 'Eko Electricity Distribution Company (EKEDC)', code: 'EKEDC' },
  { id: 'ibedc', name: 'Ibadan Electricity Distribution Company (IBEDC)', code: 'IBEDC' },
  { id: 'ikeja', name: 'Ikeja Electric Payment', code: 'IKEJA' },
  { id: 'jos', name: 'Jos Electricity Distribution PlC', code: 'JOS' },
  { id: 'kano', name: 'Kano Electricity Distribution Company', code: 'KANO' },
  { id: 'portharcourt', name: 'Port Harcourt Electricity Distribution Company', code: 'PHED' },
];

const meterTypes = [
  { id: 'prepaid', name: 'Prepaid Meter' },
  { id: 'postpaid', name: 'Postpaid Meter' },
];

export const ElectricityForm = ({ onBack }: ElectricityFormProps) => {
  const [meterNumber, setMeterNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedMeterType, setSelectedMeterType] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [processing, setProcessing] = useState(false);
  
  const { wallet, syncWallet } = useRealTimeWallet();
  const { initializeServicePayment } = useDirectServicePayment();

  const processElectricityService = async (reference: string, amountNum: number) => {
    try {
      console.log('Processing electricity service delivery...');
      
      // This would be implemented with a third-party electricity API
      // For now, we'll simulate the process
      toast({
        title: "Electricity Bill Paid Successfully!",
        description: `₦${amountNum.toLocaleString()} electricity bill paid for meter ${meterNumber}`,
        duration: 5000,
      });

      setMeterNumber('');
      setAmount('');
      setSelectedProvider('');
      setSelectedMeterType('');
      setCustomerName('');
      
    } catch (error) {
      console.error('Electricity service delivery failed:', error);
      
      if (paymentMethod === 'wallet') {
        console.log('Refunding wallet due to service failure...');
        await syncWallet(amountNum, 'credit', `REFUND_${reference}`, {
          service_type: 'electricity_refund',
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

    const reference = `ELECTRICITY_${Date.now()}`;
    
    try {
      const provider = electricityProviders.find(p => p.id === selectedProvider);
      const syncResult = await syncWallet(-amountNum, 'debit', reference, {
        service_type: 'electricity',
        provider: provider?.name,
        meter_number: meterNumber,
        meter_type: selectedMeterType
      });

      if (syncResult.error) {
        throw new Error(syncResult.error);
      }

      await processElectricityService(reference, amountNum);
      
    } catch (error) {
      console.error('Wallet payment failed:', error);
      throw error;
    }
  };

  const handleDirectPayment = async (amountNum: number) => {
    try {
      console.log('Initializing direct payment for electricity...');
      
      const provider = electricityProviders.find(p => p.id === selectedProvider);
      await initializeServicePayment({
        service_type: 'electricity',
        amount: amountNum,
        service_data: {
          provider_id: selectedProvider,
          provider_name: provider?.name,
          provider_code: provider?.code,
          meter_number: meterNumber,
          meter_type: selectedMeterType,
          customer_name: customerName
        }
      });

      setMeterNumber('');
      setAmount('');
      setSelectedProvider('');
      setSelectedMeterType('');
      setCustomerName('');
      
    } catch (error) {
      console.error('Direct payment failed:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProvider || !selectedMeterType || !meterNumber || !amount) {
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
                <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                Electricity Bill
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="provider">Electricity Provider</Label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Select electricity provider" />
                </SelectTrigger>
                <SelectContent>
                  {electricityProviders.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meterType">Meter Type</Label>
              <Select value={selectedMeterType} onValueChange={setSelectedMeterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select meter type" />
                </SelectTrigger>
                <SelectContent>
                  {meterTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meterNumber">Meter Number</Label>
              <Input
                id="meterNumber"
                type="text"
                placeholder="Enter meter number"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
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

            {selectedProvider && selectedMeterType && meterNumber && amount && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Transaction Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Provider:</span>
                    <span>{electricityProviders.find(p => p.id === selectedProvider)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Meter Type:</span>
                    <span>{meterTypes.find(t => t.id === selectedMeterType)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Meter Number:</span>
                    <span>{meterNumber}</span>
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
              className="w-full bg-yellow-600 hover:bg-yellow-700"
              disabled={processing || !selectedProvider || !selectedMeterType || !meterNumber || !amount}
            >
              {processing ? 'Processing...' : paymentMethod === 'wallet' ? 'Pay from Wallet' : 'Pay with Card/Transfer'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
