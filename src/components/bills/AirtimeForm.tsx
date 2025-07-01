import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Smartphone, ArrowLeft, CreditCard, Wallet } from 'lucide-react';
import { useReloadly } from '@/hooks/useReloadly';
import { useRealTimeWallet } from '@/hooks/useRealTimeWallet';
import { useDirectServicePayment } from '@/hooks/useDirectServicePayment';
import { toast } from '@/hooks/use-toast';

interface AirtimeFormProps {
  onBack: () => void;
}

interface Operator {
  operatorId: number;
  name: string;
  bundle: boolean;
  data: boolean;
  pin: boolean;
  supportsLocalAmounts: boolean;
  denominationType: string;
  senderCurrencyCode: string;
  senderCurrencySymbol: string;
  destinationCurrencyCode: string;
  destinationCurrencySymbol: string;
  commission: number;
  internationalDiscount: number;
  localDiscount: number;
  mostPopularAmount: number;
  minAmount: number;
  maxAmount: number;
  logoUrls: string[];
  fixedAmounts: number[];
  localFixedAmounts: number[];
  fixedAmountsDescriptions: Record<string, string>;
  localFixedAmountsDescriptions: Record<string, string>;
  country: {
    isoName: string;
    name: string;
  };
}

export const AirtimeForm = ({ onBack }: AirtimeFormProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [operators, setOperators] = useState<Operator[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [processing, setProcessing] = useState(false);
  
  const { loading, getOperators, detectOperator, topupAirtime } = useReloadly();
  const { wallet, syncWallet } = useRealTimeWallet();
  const { initializeServicePayment } = useDirectServicePayment();

  useEffect(() => {
    loadOperators();
  }, []);

  const loadOperators = async () => {
    try {
      const operatorData = await getOperators('NG');
      setOperators(operatorData);
      console.log('Loaded operators:', operatorData);
    } catch (error) {
      console.error('Failed to load operators:', error);
      toast({
        title: "Error",
        description: "Failed to load service providers. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePhoneNumberChange = async (value: string) => {
    setPhoneNumber(value);
    
    // Auto-detect operator when phone number is complete
    if (value.length >= 10) {
      try {
        const cleanNumber = value.replace(/\D/g, '');
        const detectedOperator = await detectOperator(cleanNumber);
        
        if (detectedOperator) {
          const operator = operators.find(op => op.operatorId === detectedOperator.operatorId);
          if (operator) {
            setSelectedOperator(operator);
            console.log('Auto-detected operator:', operator.name);
          }
        }
      } catch (error) {
        console.error('Failed to detect operator:', error);
      }
    }
  };

  const processAirtimeService = async (reference: string, amountNum: number) => {
    try {
      console.log('Processing airtime service delivery...');
      
      await topupAirtime({
        operator_id: selectedOperator!.operatorId,
        phone_number: phoneNumber.replace(/\D/g, ''),
        amount: amountNum,
        reference,
        country_code: 'NG'
      });

      toast({
        title: "Airtime Sent Successfully!",
        description: `₦${amountNum.toLocaleString()} airtime sent to ${phoneNumber}`,
        duration: 5000,
      });

      // Reset form
      setPhoneNumber('');
      setAmount('');
      setSelectedOperator(null);
      
    } catch (error) {
      console.error('Airtime service delivery failed:', error);
      
      // If using wallet payment, refund the amount
      if (paymentMethod === 'wallet') {
        console.log('Refunding wallet due to service failure...');
        await syncWallet(amountNum, 'credit', `REFUND_${reference}`, {
          service_type: 'airtime_refund',
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

    const reference = `AIRTIME_${Date.now()}`;
    
    try {
      // Debit wallet first
      const syncResult = await syncWallet(-amountNum, 'debit', reference, {
        service_type: 'airtime',
        provider: selectedOperator!.name,
        phone_number: phoneNumber,
        operator_id: selectedOperator!.operatorId
      });

      if (syncResult.error) {
        throw new Error(syncResult.error);
      }

      // Process service delivery
      await processAirtimeService(reference, amountNum);
      
    } catch (error) {
      console.error('Wallet payment failed:', error);
      throw error;
    }
  };

  const handleDirectPayment = async (amountNum: number) => {
    try {
      console.log('Initializing direct payment for airtime...');
      
      await initializeServicePayment({
        service_type: 'airtime',
        amount: amountNum,
        service_data: {
          operator_id: selectedOperator!.operatorId,
          operator_name: selectedOperator!.name,
          phone_number: phoneNumber.replace(/\D/g, ''),
          country_code: 'NG'
        }
      });

      // Reset form on successful payment
      setPhoneNumber('');
      setAmount('');
      setSelectedOperator(null);
      
    } catch (error) {
      console.error('Direct payment failed:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOperator || !phoneNumber || !amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const amountNum = parseFloat(amount);
    
    if (amountNum < selectedOperator.minAmount || amountNum > selectedOperator.maxAmount) {
      toast({
        title: "Invalid Amount",
        description: `Amount must be between ${selectedOperator.destinationCurrencySymbol}${selectedOperator.minAmount} and ${selectedOperator.destinationCurrencySymbol}${selectedOperator.maxAmount}`,
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
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-white" />
                </div>
                Airtime Recharge
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="08012345678"
                value={phoneNumber}
                onChange={(e) => handlePhoneNumberChange(e.target.value)}
                required
              />
            </div>

            {operators.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="operator">Network Operator</Label>
                <Select 
                  value={selectedOperator?.operatorId.toString() || ''} 
                  onValueChange={(value) => {
                    const operator = operators.find(op => op.operatorId.toString() === value);
                    setSelectedOperator(operator || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select network operator" />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map((operator) => (
                      <SelectItem key={operator.operatorId} value={operator.operatorId.toString()}>
                        {operator.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedOperator && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ({selectedOperator.destinationCurrencySymbol})</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder={`Min: ${selectedOperator.minAmount}, Max: ${selectedOperator.maxAmount}`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={selectedOperator.minAmount}
                    max={selectedOperator.maxAmount}
                    step="1"
                    required
                  />
                  <div className="text-sm text-muted-foreground">
                    Range: {selectedOperator.destinationCurrencySymbol}{selectedOperator.minAmount} - {selectedOperator.destinationCurrencySymbol}{selectedOperator.maxAmount}
                  </div>
                  
                  {selectedOperator.fixedAmounts.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-sm font-medium">Quick amounts:</span>
                      {selectedOperator.fixedAmounts.slice(0, 6).map((fixedAmount) => (
                        <Badge
                          key={fixedAmount}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          onClick={() => setAmount(fixedAmount.toString())}
                        >
                          {selectedOperator.destinationCurrencySymbol}{fixedAmount}
                        </Badge>
                      ))}
                    </div>
                  )}
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
              </>
            )}

            {phoneNumber && amount && selectedOperator && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Transaction Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Phone Number:</span>
                    <span>{phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Network:</span>
                    <span>{selectedOperator.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>{selectedOperator.destinationCurrencySymbol}{amount}</span>
                  </div>
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
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={processing || loading || !selectedOperator || !phoneNumber || !amount}
            >
              {processing ? 'Processing...' : paymentMethod === 'wallet' ? 'Pay from Wallet' : 'Pay with Card/Transfer'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
