
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  return (
    <>
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
    </>
  );
};
