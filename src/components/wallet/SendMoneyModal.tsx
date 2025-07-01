
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { RecipientSearch } from './send-money/RecipientSearch';
import { RecipientCard } from './send-money/RecipientCard';
import { TransferForm } from './send-money/TransferForm';
import { TransferSummary } from './send-money/TransferSummary';
import { PinVerificationStep } from './send-money/PinVerificationStep';
import { useSendMoney } from './send-money/useSendMoney';

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
  const [step, setStep] = useState(1);
  const [selectedRecipient, setSelectedRecipient] = useState<UserProfile | null>(null);
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('NGN');
  const [description, setDescription] = useState('');
  const [pinVerified, setPinVerified] = useState(false);
  const { user } = useAuth();

  const {
    currencies,
    loading,
    exchangeRate,
    convertedAmount,
    transferFee,
    fetchCurrencies,
    calculateConversion,
    sendMoney
  } = useSendMoney();

  useEffect(() => {
    if (open) {
      fetchCurrencies();
      // Reset form when modal opens
      setStep(1);
      setSelectedRecipient(null);
      setAmount('');
      setDescription('');
      setPinVerified(false);
    }
  }, [open]);

  useEffect(() => {
    if (amount && selectedCurrency) {
      calculateConversion(amount, selectedCurrency);
    }
  }, [amount, selectedCurrency]);

  const verifyPin = async (pin: string) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('withdrawal_pins')
        .select('pin_hash')
        .eq('user_id', user.id)
        .single();

      if (error) {
        return { success: false, error: 'No withdrawal PIN found. Please add a bank account first.' };
      }

      // In production, you should hash the input PIN and compare with stored hash
      // For now, we'll do a simple comparison (this should be properly hashed)
      if (data.pin_hash === pin) {
        return { success: true };
      } else {
        return { success: false, error: 'Invalid PIN' };
      }
    } catch (error) {
      return { success: false, error: 'Failed to verify PIN' };
    }
  };

  const handleSendMoney = async () => {
    if (!selectedRecipient) return;

    await sendMoney(
      selectedRecipient,
      amount,
      selectedCurrency,
      description,
      userBalance,
      () => {
        // Reset form on success
        setStep(1);
        setSelectedRecipient(null);
        setAmount('');
        setDescription('');
        setPinVerified(false);
        onOpenChange(false);
      }
    );
  };

  const selectedCurrencyInfo = currencies.find(c => c.code === selectedCurrency);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Send Money to Banqa User</DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <RecipientSearch
            onRecipientFound={(recipient) => {
              setSelectedRecipient(recipient);
              setStep(2);
            }}
          />
        )}

        {step === 2 && selectedRecipient && (
          <div className="space-y-4">
            <RecipientCard recipient={selectedRecipient} />

            <TransferForm
              amount={amount}
              setAmount={setAmount}
              selectedCurrency={selectedCurrency}
              setSelectedCurrency={setSelectedCurrency}
              description={description}
              setDescription={setDescription}
              currencies={currencies}
            />

            {amount && selectedCurrencyInfo && (
              <TransferSummary
                amount={amount}
                selectedCurrencyInfo={selectedCurrencyInfo}
                transferFee={transferFee}
                convertedAmount={convertedAmount}
                exchangeRate={exchangeRate}
              />
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
                onClick={() => setStep(3)} 
                disabled={!amount || parseFloat(amount) + transferFee > userBalance}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <PinVerificationStep
            onPinVerified={() => {
              setPinVerified(true);
              setStep(4);
            }}
            onBack={() => setStep(2)}
            onVerifyPin={verifyPin}
            loading={loading}
          />
        )}

        {step === 4 && pinVerified && selectedRecipient && selectedCurrencyInfo && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Confirm Transfer</h3>
              <p className="text-sm text-muted-foreground">
                Please review the details below before sending
              </p>
            </div>

            <RecipientCard recipient={selectedRecipient} />
            
            <TransferSummary
              amount={amount}
              selectedCurrencyInfo={selectedCurrencyInfo}
              transferFee={transferFee}
              convertedAmount={convertedAmount}
              exchangeRate={exchangeRate}
            />

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleSendMoney} 
                disabled={loading}
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
