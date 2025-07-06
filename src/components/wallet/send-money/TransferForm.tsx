
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  country: string;
  exchange_rate_to_base: number;
}

interface TransferFormProps {
  amount: string;
  setAmount: (amount: string) => void;
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  description: string;
  setDescription: (description: string) => void;
  currencies: Currency[];
}

export const TransferForm = ({
  amount,
  setAmount,
  selectedCurrency,
  setSelectedCurrency,
  description,
  setDescription,
  currencies
}: TransferFormProps) => {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const formatAmountInput = (value: string) => {
    if (!value) return '';
    const num = parseFloat(value);
    return isNaN(num) ? value : num.toLocaleString();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="amount" className="text-sm font-medium">
            Amount (NGN) *
          </Label>
          <Input
            id="amount"
            type="text"
            placeholder="0.00"
            value={amount}
            onChange={handleAmountChange}
            className="mt-1"
            autoComplete="off"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Min: ₦100 | Max: ₦5,000,000
          </p>
        </div>
        <div>
          <Label htmlFor="currency" className="text-sm font-medium">
            Recipient Currency *
          </Label>
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{currency.symbol}</span>
                    <span className="font-medium">{currency.code}</span>
                    <span className="text-muted-foreground">- {currency.country}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description" className="text-sm font-medium">
          Description (Optional)
        </Label>
        <Input
          id="description"
          placeholder="What's this for? (e.g., Payment for services)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1"
          maxLength={100}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {description.length}/100 characters
        </p>
      </div>
    </div>
  );
};
