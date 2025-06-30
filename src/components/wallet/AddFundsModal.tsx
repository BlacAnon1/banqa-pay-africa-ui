
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Banknote, Smartphone } from 'lucide-react';
import { useFlutterwavePayment } from '@/hooks/useFlutterwavePayment';

interface AddFundsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QUICK_AMOUNTS = [1000, 5000, 10000, 20000, 50000];

export const AddFundsModal: React.FC<AddFundsModalProps> = ({ open, onOpenChange }) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('card');
  const { initializePayment, loading } = useFlutterwavePayment();

  const handleAmountSelect = (value: number) => {
    setAmount(value.toString());
  };

  const handlePayment = async () => {
    const numAmount = parseFloat(amount);
    
    if (!numAmount || numAmount < 100) {
      return;
    }

    const result = await initializePayment(numAmount);
    if (result) {
      onOpenChange(false);
      setAmount('');
    }
  };

  const paymentMethods = [
    { id: 'card', name: 'Debit/Credit Card', icon: CreditCard },
    { id: 'bank', name: 'Bank Transfer', icon: Banknote },
    { id: 'ussd', name: 'USSD', icon: Smartphone },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add Funds to Wallet</DialogTitle>
          <DialogDescription>
            Top up your wallet using secure payment methods
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount (₦)
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="100"
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground">
              Minimum amount: ₦100
            </p>
          </div>

          {/* Quick Amount Buttons */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Select</Label>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_AMOUNTS.map((value) => (
                <Button
                  key={value}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAmountSelect(value)}
                  className={amount === value.toString() ? 'border-primary bg-primary/5' : ''}
                >
                  ₦{value.toLocaleString()}
                </Button>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Payment Method</Label>
            <div className="grid gap-2">
              {paymentMethods.map((method) => (
                <Button
                  key={method.id}
                  variant="outline"
                  className={`justify-start h-12 ${
                    selectedMethod === method.id ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <method.icon className="h-4 w-4 mr-3" />
                  {method.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={!amount || parseFloat(amount) < 100 || loading}
            className="w-full h-12 text-base font-medium"
          >
            {loading ? 'Processing...' : `Add ₦${amount ? parseFloat(amount).toLocaleString() : '0'}`}
          </Button>

          <div className="text-xs text-muted-foreground text-center">
            Secure payment powered by Flutterwave
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
