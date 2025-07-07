
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Wifi, WifiOff, Phone, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface USSDCode {
  provider: string;
  code: string;
  description: string;
  network: string;
}

const ussdCodes: USSDCode[] = [
  { provider: 'MTN', code: '*904*1#', description: 'Check Banqa balance', network: 'MTN' },
  { provider: 'Airtel', code: '*901*1#', description: 'Check Banqa balance', network: 'Airtel' },
  { provider: 'Glo', code: '*805*1#', description: 'Check Banqa balance', network: 'Glo' },
  { provider: '9mobile', code: '*229*1#', description: 'Check Banqa balance', network: '9mobile' },
  { provider: 'MTN', code: '*904*2*AMOUNT*PIN#', description: 'Pay electricity bill', network: 'MTN' },
  { provider: 'Airtel', code: '*901*2*AMOUNT*PIN#', description: 'Pay electricity bill', network: 'Airtel' },
  { provider: 'Glo', code: '*805*2*AMOUNT*PIN#', description: 'Pay electricity bill', network: 'Glo' },
  { provider: '9mobile', code: '*229*2*AMOUNT*PIN#', description: 'Pay electricity bill', network: '9mobile' },
];

export const OfflinePayments: React.FC = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [billType, setBillType] = useState<string>('electricity');

  const generateUSSDCode = () => {
    if (!selectedNetwork || !amount) {
      toast({
        title: "Missing Information",
        description: "Please select network and enter amount",
        variant: "destructive"
      });
      return '';
    }

    const baseCode = ussdCodes.find(
      code => code.network === selectedNetwork && code.description.includes(billType)
    );

    if (!baseCode) return '';

    return baseCode.code
      .replace('AMOUNT', amount)
      .replace('PIN', pin || 'YOUR_PIN');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "USSD code copied to clipboard"
    });
  };

  const generatedCode = generateUSSDCode();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <WifiOff className="h-5 w-5" />
            <CardTitle>Offline Payments</CardTitle>
            <Badge variant="secondary">No Internet Required</Badge>
          </div>
          <CardDescription>
            Pay bills using USSD codes from any phone, even without internet connection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Network</label>
            <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your network provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MTN">MTN</SelectItem>
                <SelectItem value="Airtel">Airtel</SelectItem>
                <SelectItem value="Glo">Glo</SelectItem>
                <SelectItem value="9mobile">9mobile</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bill Type</label>
            <Select value={billType} onValueChange={setBillType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electricity">Electricity</SelectItem>
                <SelectItem value="water">Water</SelectItem>
                <SelectItem value="internet">Internet</SelectItem>
                <SelectItem value="tv">Cable TV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Amount (₦)</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">PIN</label>
              <Input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Your Banqa PIN"
                maxLength={4}
              />
            </div>
          </div>

          {generatedCode && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Generated USSD Code:</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(generatedCode)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="text-lg font-mono bg-white p-3 rounded border">
                {generatedCode}
              </div>
              <p className="text-sm text-gray-600">
                Dial this code from your {selectedNetwork} line to pay your {billType} bill
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Quick USSD Codes
          </CardTitle>
          <CardDescription>
            Common USSD codes for Banqa services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {ussdCodes.filter(code => !code.code.includes('AMOUNT')).map((code, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <div className="font-mono text-sm">{code.code}</div>
                  <div className="text-sm text-gray-600">{code.description}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{code.network}</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(code.code)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
