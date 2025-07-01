
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Smartphone, ArrowLeft } from 'lucide-react';
import { useReloadly } from '@/hooks/useReloadly';
import { useRealTimeWallet } from '@/hooks/useRealTimeWallet';
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
  const [operators, setOperators] = useState<Operator[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [processing, setProcessing] = useState(false);
  
  const { loading, getOperators, detectOperator, topupAirtime } = useReloadly();
  const { wallet, syncWallet } = useRealTimeWallet();

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

    if (!wallet || wallet.balance < amountNum) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance in your wallet.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    try {
      const reference = `AIRTIME_${Date.now()}`;
      
      // Debit wallet first
      const syncResult = await syncWallet(-amountNum, 'debit', reference, {
        service_type: 'airtime',
        provider: selectedOperator.name,
        phone_number: phoneNumber,
        operator_id: selectedOperator.operatorId
      });

      if (syncResult.error) {
        throw new Error(syncResult.error);
      }

      // Send airtime
      await topupAirtime({
        operator_id: selectedOperator.operatorId,
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
      console.error('Airtime purchase failed:', error);
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Failed to send airtime. Please try again.",
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
                  <div className="flex justify-between font-medium">
                    <span>Total Cost:</span>
                    <span>₦{amount}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Wallet Balance:</span>
                    <span>₦{wallet?.balance?.toLocaleString() || '0.00'}</span>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={processing || loading || !selectedOperator || !phoneNumber || !amount}
            >
              {processing ? 'Processing...' : 'Send Airtime'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
