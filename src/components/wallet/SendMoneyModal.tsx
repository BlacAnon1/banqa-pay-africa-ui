
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Send } from 'lucide-react';
import { RecipientSearch } from './send-money/RecipientSearch';
import { RecipientCard } from './send-money/RecipientCard';
import { TransferForm } from './send-money/TransferForm';
import { TransferSummary } from './send-money/TransferSummary';
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
    }
  }, [open]);

  useEffect(() => {
    if (amount && selectedCurrency) {
      calculateConversion(amount, selectedCurrency);
    }
  }, [amount, selectedCurrency]);

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
