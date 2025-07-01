
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  country: string;
  exchange_rate_to_base: number;
}

interface TransferSummaryProps {
  amount: string;
  selectedCurrencyInfo: Currency;
  transferFee: number;
  convertedAmount: number;
  exchangeRate: number;
}

export const TransferSummary = ({
  amount,
  selectedCurrencyInfo,
  transferFee,
  convertedAmount,
  exchangeRate
}: TransferSummaryProps) => {
  return (
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
          Exchange rate: 1 NGN = {exchangeRate.toFixed(4)} {selectedCurrencyInfo.code}
        </div>
      </CardContent>
    </Card>
  );
};
