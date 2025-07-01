
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Send, User, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  country: string;
  exchange_rate_to_base: number;
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  banqa_id: string;
}

interface SendMoneyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userBalance: number;
}

export const SendMoneyModal = ({ open, onOpenChange, userBalance }: SendMoneyModalProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [banqaId, setBanqaId] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<UserProfile | null>(null);
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('NGN');
  const [description, setDescription] = useState('');
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [transferFee, setTransferFee] = useState(0);

  useEffect(() => {
    if (open) {
      fetchCurrencies();
      // Reset form when modal opens
      setStep(1);
      setBanqaId('');
      setSelectedRecipient(null);
      setAmount('');
      setDescription('');
    }
  }, [open]);

  useEffect(() => {
    if (amount && selectedCurrency) {
      calculateConversion();
    }
  }, [amount, selectedCurrency]);

  const fetchCurrencies = async () => {
    const { data, error } = await supabase
      .from('currencies')
      .select('*')
      .eq('is_active', true)
      .order('country');

    if (!error && data) {
      setCurrencies(data);
    }
  };

  const searchUserByBanqaId = async () => {
    if (!banqaId.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a Banqa ID",
        variant: "destructive"
      });
      return;
    }

    setSearchLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, banqa_id')
      .eq('banqa_id', banqaId.toUpperCase())
      .neq('id', user?.id)
      .single();

    if (error || !data) {
      toast({
        title: "User Not Found",
        description: "No user found with this Banqa ID",
        variant: "destructive"
      });
    } else {
      setSelectedRecipient(data);
      setStep(2);
    }
    setSearchLoading(false);
  };

  const calculateConversion = () => {
    const currency = currencies.find(c => c.code === selectedCurrency);
    if (!currency || !amount) return;

    const rate = currency.exchange_rate_to_base;
    const converted = parseFloat(amount) * rate;
    const fee = converted * 0.01; // 1% transfer fee

    setExchangeRate(rate);
    setConvertedAmount(converted);
    setTransferFee(fee);
  };

  const handleSendMoney = async () => {
    if (!selectedRecipient || !amount || !user) return;

    const totalAmount = parseFloat(amount) + transferFee;
    if (totalAmount > userBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough funds to complete this transfer",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('process-money-transfer', {
        body: {
          sender_id: user.id,
          recipient_id: selectedRecipient.id,
          amount: parseFloat(amount),
          sender_currency: 'NGN',
          recipient_currency: selectedCurrency,
          description: description || `Transfer to ${selectedRecipient.full_name}`
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Transfer Successful",
          description: `Successfully sent ${selectedCurrency} ${convertedAmount.toFixed(2)} to ${selectedRecipient.full_name}`,
        });
        
        // Reset form
        setStep(1);
        setBanqaId('');
        setSelectedRecipient(null);
        setAmount('');
        setDescription('');
        onOpenChange(false);
      } else {
        throw new Error(data.error || 'Transfer failed');
      }
    } catch (error: any) {
      toast({
        title: "Transfer Failed",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedCurrencyInfo = currencies.find(c => c.code === selectedCurrency);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Send Money to Banqa User</DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="banqaId">Enter Recipient's Banqa ID</Label>
              <div className="flex gap-2">
                <Input
                  id="banqaId"
                  placeholder="e.g., BQ12345678"
                  value={banqaId}
                  onChange={(e) => setBanqaId(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && searchUserByBanqaId()}
                />
                <Button onClick={searchUserByBanqaId} disabled={searchLoading}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Ask the recipient for their Banqa ID to send money
              </p>
            </div>
          </div>
        )}

        {step === 2 && selectedRecipient && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Sending to:</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{selectedRecipient.full_name}</p>
                    <p className="text-sm text-muted-foreground">Banqa ID: {selectedRecipient.banqa_id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount (NGN)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="currency">Recipient Currency</Label>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.code} - {currency.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="What's this for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {amount && selectedCurrencyInfo && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Transfer Summary</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <div className="flex justify-between">
                    <span>You send:</span>
                    <span className="font-medium">₦{parseFloat(amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transfer fee:</span>
                    <span className="font-medium">₦{transferFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Total deducted:</span>
                    <span className="font-bold">₦{(parseFloat(amount) + transferFee).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-center py-2">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex justify-between">
                    <span>Recipient gets:</span>
                    <span className="font-bold text-green-600">
                      {selectedCurrencyInfo.symbol}{convertedAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Exchange rate: 1 NGN = {exchangeRate.toFixed(4)} {selectedCurrency}
                  </div>
                </CardContent>
              </Card>
            )}

            {parseFloat(amount) + transferFee > userBalance && (
              <Alert>
                <AlertDescription>
                  Insufficient balance. You need ₦{((parseFloat(amount) + transferFee) - userBalance).toFixed(2)} more.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleSendMoney} 
                disabled={!amount || loading || parseFloat(amount) + transferFee > userBalance}
                className="flex-1"
              >
                {loading ? 'Sending...' : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Money
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
