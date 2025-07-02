
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
import { EnhancedTransferSummary } from './send-money/EnhancedTransferSummary';
import { CrossBorderTransferInfo } from './send-money/CrossBorderTransferInfo';
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
  const senderCurrencyInfo = currencies.find(c => c.code === 'NGN'); // Assuming sender is always NGN for now

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Money - Borderless African Finance</DialogTitle>
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

            {amount && selectedCurrencyInfo && senderCurrencyInfo && (
              <>
                <CrossBorderTransferInfo
                  senderCurrency="NGN"
                  recipientCurrency={selectedCurrency}
                  exchangeRate={exchangeRate}
                  transferFee={transferFee}
                  amount={parseFloat(amount)}
                />

                <EnhancedTransferSummary
                  amount={amount}
                  senderCurrency={senderCurrencyInfo}
                  recipientCurrency={selectedCurrencyInfo}
                  transferFee={transferFee}
                  convertedAmount={convertedAmount}
                  exchangeRate={exchangeRate}
                />
              </>
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

        {step === 4 && pinVerified && selectedRecipient && selectedCurrencyInfo && senderCurrencyInfo && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Confirm Cross-Border Transfer</h3>
              <p className="text-sm text-muted-foreground">
                Supporting borderless finance across Africa
              </p>
            </div>

            <RecipientCard recipient={selectedRecipient} />
            
            <EnhancedTransferSummary
              amount={amount}
              senderCurrency={senderCurrencyInfo}
              recipientCurrency={selectedCurrencyInfo}
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
                {loading ? 'Processing...' : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Complete Transfer
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
