
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useWithdrawal } from '@/hooks/useWithdrawal';
import { useBankAccounts } from '@/hooks/useBankAccounts';
import { useRealTimeWallet } from '@/hooks/useRealTimeWallet';
import { toast } from '@/hooks/use-toast';
import { Loader2, Shield, Mail } from 'lucide-react';

interface WithdrawalProcessProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WithdrawalProcess = ({ open, onOpenChange }: WithdrawalProcessProps) => {
  const [step, setStep] = useState<'amount' | 'pin' | 'otp'>('amount');
  const [formData, setFormData] = useState({
    amount: '',
    bank_account_id: '',
    pin: '',
    otp: ''
  });

  const { processWithdrawal, loading } = useWithdrawal();
  const { bankAccounts } = useBankAccounts();
  const { wallet } = useRealTimeWallet();

  const handleAmountSubmit = () => {
    const amount = parseFloat(formData.amount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive"
      });
      return;
    }

    if (!wallet || amount > wallet.balance) {
      toast({
        title: "Insufficient Balance",
        description: "Withdrawal amount exceeds available balance",
        variant: "destructive"
      });
      return;
    }

    if (!formData.bank_account_id) {
      toast({
        title: "Select Bank Account",
        description: "Please select a bank account for withdrawal",
        variant: "destructive"
      });
      return;
    }

    setStep('pin');
  };

  const handlePinSubmit = async () => {
    if (formData.pin.length !== 4) {
      toast({
        title: "Invalid PIN",
        description: "Please enter your 4-digit withdrawal PIN",
        variant: "destructive"
      });
      return;
    }

    const { data, error } = await processWithdrawal('verify_pin', {
      pin: formData.pin,
      amount: parseFloat(formData.amount),
      bank_account_id: formData.bank_account_id
    });

    if (error) {
      toast({
        title: "PIN Verification Failed",
        description: error,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "OTP Sent",
      description: "Verification code sent to your email",
    });
    setStep('otp');
  };

  const handleOtpSubmit = async () => {
    if (formData.otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit verification code",
        variant: "destructive"
      });
      return;
    }

    const { data, error } = await processWithdrawal('verify_otp_and_withdraw', {
      amount: parseFloat(formData.amount),
      bank_account_id: formData.bank_account_id,
      otp_code: formData.otp
    });

    if (error) {
      toast({
        title: "Withdrawal Failed",
        description: error,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Withdrawal Successful",
      description: `₦${parseFloat(formData.amount).toLocaleString()} withdrawal processed successfully`,
    });

    // Reset form and close modal
    setFormData({ amount: '', bank_account_id: '', pin: '', otp: '' });
    setStep('amount');
    onOpenChange(false);
  };

  const handleClose = () => {
    setFormData({ amount: '', bank_account_id: '', pin: '', otp: '' });
    setStep('amount');
    onOpenChange(false);
  };

  const selectedAccount = bankAccounts.find(acc => acc.id === formData.bank_account_id);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'amount' && 'Withdraw Funds'}
            {step === 'pin' && 'Enter Withdrawal PIN'}
            {step === 'otp' && 'Enter Verification Code'}
          </DialogTitle>
        </DialogHeader>

        {step === 'amount' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="Enter withdrawal amount"
                min="100"
                max={wallet?.balance || 0}
              />
              <p className="text-sm text-muted-foreground">
                Available balance: ₦{wallet?.balance?.toLocaleString() || '0.00'}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Select Bank Account</Label>
              {bankAccounts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No bank accounts added yet</p>
              ) : (
                <Select 
                  value={formData.bank_account_id} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, bank_account_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {bankAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        <div className="flex flex-col">
                          <span>{account.bank_name}</span>
                          <span className="text-sm text-muted-foreground">
                            {account.account_name} • ****{account.account_number.slice(-4)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleAmountSubmit} disabled={bankAccounts.length === 0}>
                Continue
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 'pin' && (
          <div className="space-y-4">
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto text-emerald-600 mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Enter your 4-digit withdrawal PIN to proceed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin">Withdrawal PIN</Label>
              <Input
                id="pin"
                type="password"
                value={formData.pin}
                onChange={(e) => setFormData(prev => ({ ...prev, pin: e.target.value }))}
                placeholder="Enter 4-digit PIN"
                maxLength={4}
                className="text-center text-lg tracking-widest"
              />
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm">
                <strong>Withdrawal Details:</strong><br />
                Amount: ₦{parseFloat(formData.amount).toLocaleString()}<br />
                Account: {selectedAccount?.bank_name} • ****{selectedAccount?.account_number.slice(-4)}
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('amount')}>
                Back
              </Button>
              <Button onClick={handlePinSubmit} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify PIN
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-4">
            <div className="text-center">
              <Mail className="h-12 w-12 mx-auto text-emerald-600 mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Enter the 6-digit verification code sent to your email
              </p>
            </div>

            <div className="space-y-2">
              <Label>Verification Code</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={formData.otp}
                  onChange={(value) => setFormData(prev => ({ ...prev, otp: value }))}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('pin')}>
                Back
              </Button>
              <Button onClick={handleOtpSubmit} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Withdrawal
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
