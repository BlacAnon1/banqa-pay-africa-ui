
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBankAccounts } from '@/hooks/useBankAccounts';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface AddBankAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const nigerianBanks = [
  { name: "Access Bank", code: "044" },
  { name: "Citibank Nigeria", code: "023" },
  { name: "Ecobank Nigeria", code: "050" },
  { name: "Fidelity Bank", code: "070" },
  { name: "First Bank of Nigeria", code: "011" },
  { name: "First City Monument Bank", code: "214" },
  { name: "Guaranty Trust Bank", code: "058" },
  { name: "Heritage Bank", code: "030" },
  { name: "Keystone Bank", code: "082" },
  { name: "Polaris Bank", code: "076" },
  { name: "Providus Bank", code: "101" },
  { name: "Stanbic IBTC Bank", code: "221" },
  { name: "Standard Chartered Bank", code: "068" },
  { name: "Sterling Bank", code: "232" },
  { name: "Union Bank of Nigeria", code: "032" },
  { name: "United Bank For Africa", code: "033" },
  { name: "Unity Bank", code: "215" },
  { name: "Wema Bank", code: "035" },
  { name: "Zenith Bank", code: "057" }
];

export const AddBankAccountModal = ({ open, onOpenChange }: AddBankAccountModalProps) => {
  const [formData, setFormData] = useState({
    account_name: '',
    account_number: '',
    bank_name: '',
    bank_code: '',
    withdrawal_pin: '',
    confirm_pin: ''
  });
  const [loading, setLoading] = useState(false);
  const { addBankAccount } = useBankAccounts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.withdrawal_pin !== formData.confirm_pin) {
      toast({
        title: "PIN Mismatch",
        description: "Withdrawal PINs do not match",
        variant: "destructive"
      });
      return;
    }

    if (formData.withdrawal_pin.length !== 4) {
      toast({
        title: "Invalid PIN",
        description: "Withdrawal PIN must be 4 digits",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    const { error } = await addBankAccount({
      account_name: formData.account_name,
      account_number: formData.account_number,
      bank_name: formData.bank_name,
      bank_code: formData.bank_code,
      withdrawal_pin: formData.withdrawal_pin
    });

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      });
    } else {
      setFormData({
        account_name: '',
        account_number: '',
        bank_name: '',
        bank_code: '',
        withdrawal_pin: '',
        confirm_pin: ''
      });
      onOpenChange(false);
    }
    
    setLoading(false);
  };

  const handleBankChange = (bankName: string) => {
    const selectedBank = nigerianBanks.find(bank => bank.name === bankName);
    setFormData(prev => ({
      ...prev,
      bank_name: bankName,
      bank_code: selectedBank?.code || ''
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Bank Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="account_name">Account Holder Name</Label>
            <Input
              id="account_name"
              value={formData.account_name}
              onChange={(e) => setFormData(prev => ({ ...prev, account_name: e.target.value }))}
              placeholder="Enter account holder name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account_number">Account Number</Label>
            <Input
              id="account_number"
              value={formData.account_number}
              onChange={(e) => setFormData(prev => ({ ...prev, account_number: e.target.value }))}
              placeholder="Enter 10-digit account number"
              maxLength={10}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bank_name">Bank</Label>
            <Select value={formData.bank_name} onValueChange={handleBankChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Select your bank" />
              </SelectTrigger>
              <SelectContent>
                {nigerianBanks.map((bank) => (
                  <SelectItem key={bank.code} value={bank.name}>
                    {bank.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdrawal_pin">Create Withdrawal PIN</Label>
            <Input
              id="withdrawal_pin"
              type="password"
              value={formData.withdrawal_pin}
              onChange={(e) => setFormData(prev => ({ ...prev, withdrawal_pin: e.target.value }))}
              placeholder="Enter 4-digit PIN"
              maxLength={4}
              pattern="[0-9]{4}"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_pin">Confirm Withdrawal PIN</Label>
            <Input
              id="confirm_pin"
              type="password"
              value={formData.confirm_pin}
              onChange={(e) => setFormData(prev => ({ ...prev, confirm_pin: e.target.value }))}
              placeholder="Confirm 4-digit PIN"
              maxLength={4}
              pattern="[0-9]{4}"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
