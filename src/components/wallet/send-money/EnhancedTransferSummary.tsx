
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, MapPin, Users } from 'lucide-react';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  country: string;
  exchange_rate_to_base: number;
}

interface EnhancedTransferSummaryProps {
  amount: string;
  senderCurrency: Currency;
  recipientCurrency: Currency;
  transferFee: number;
  convertedAmount: number;
  exchangeRate: number;
}

export const EnhancedTransferSummary = ({
  amount,
  senderCurrency,
  recipientCurrency,
  transferFee,
  convertedAmount,
  exchangeRate
}: EnhancedTransferSummaryProps) => {
  const isCrossBorder = senderCurrency.code !== recipientCurrency.code;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          {isCrossBorder && <MapPin className="h-4 w-4 text-blue-600" />}
          Transfer Summary
          {isCrossBorder && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Cross-Border</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {isCrossBorder && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Route</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-white px-2 py-1 rounded">{senderCurrency.country}</span>
              <ArrowRight className="h-3 w-3" />
              <span className="bg-white px-2 py-1 rounded">{recipientCurrency.country}</span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>You send:</span>
            <span className="font-medium">{senderCurrency.symbol}{parseFloat(amount).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Transfer fee:</span>
            <span className="font-medium">{senderCurrency.symbol}{transferFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span>Total deducted:</span>
            <span className="font-bold">{senderCurrency.symbol}{(parseFloat(amount) + transferFee).toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center py-2">
          <div className="flex items-center gap-2">
            <div className="h-px bg-gray-300 flex-1 w-8"></div>
            <Users className="h-4 w-4 text-green-600" />
            <div className="h-px bg-gray-300 flex-1 w-8"></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Recipient gets:</span>
            <span className="font-bold text-green-600">
              {recipientCurrency.symbol}{convertedAmount.toFixed(2)}
            </span>
          </div>
          
          {isCrossBorder && (
            <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
              <div>Exchange rate: 1 {senderCurrency.code} = {exchangeRate.toFixed(4)} {recipientCurrency.code}</div>
              <div className="mt-1">Funds will be instantly available in {recipientCurrency.country}</div>
            </div>
          )}
        </div>

        {isCrossBorder && (
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <div className="text-xs font-medium text-green-800 mb-1">🌍 Borderless Finance Benefits</div>
            <div className="text-xs text-green-700">
              Supporting seamless financial inclusion across Africa with competitive rates and instant transfers.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
