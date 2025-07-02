
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Globe, TrendingDown } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CrossBorderTransferInfoProps {
  senderCurrency: string;
  recipientCurrency: string;
  exchangeRate: number;
  transferFee: number;
  amount: number;
}

export const CrossBorderTransferInfo = ({
  senderCurrency,
  recipientCurrency,
  exchangeRate,
  transferFee,
  amount
}: CrossBorderTransferInfoProps) => {
  const isCrossBorder = senderCurrency !== recipientCurrency;
  const savings = amount * 0.05; // Estimate 5% savings over traditional bureau de change

  if (!isCrossBorder) return null;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Globe className="h-4 w-4 text-blue-600" />
          Cross-Border Transfer Benefits
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <Alert className="border-green-200 bg-green-50">
          <TrendingDown className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Save up to ₦{savings.toLocaleString()}</strong> compared to traditional bureau de change services
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Info className="h-3 w-3 text-blue-600" />
            <span>Instant currency conversion at competitive rates</span>
          </div>
          <div className="flex items-center gap-2">
            <Info className="h-3 w-3 text-blue-600" />
            <span>No physical bureau de change visits required</span>
          </div>
          <div className="flex items-center gap-2">
            <Info className="h-3 w-3 text-blue-600" />
            <span>Secure and trackable cross-border transactions</span>
          </div>
          <div className="flex items-center gap-2">
            <Info className="h-3 w-3 text-blue-600" />
            <span>Support for major African currencies</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border">
          <div className="text-xs text-gray-600 mb-1">Exchange Rate</div>
          <div className="font-medium">
            1 {senderCurrency} = {exchangeRate.toFixed(4)} {recipientCurrency}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Competitive rates updated in real-time
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
