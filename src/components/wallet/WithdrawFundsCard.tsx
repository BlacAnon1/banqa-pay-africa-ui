
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Building2 } from 'lucide-react';

interface BankAccount {
  id: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  bank_code: string;
  is_default: boolean;
  is_verified: boolean;
  created_at: string;
}

interface WithdrawFundsCardProps {
  bankAccounts: BankAccount[];
  onAddAccount: () => void;
  onWithdraw: () => void;
}

export const WithdrawFundsCard = ({ bankAccounts, onAddAccount, onWithdraw }: WithdrawFundsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdraw Funds</CardTitle>
        <CardDescription>Transfer money from your wallet to your bank account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {bankAccounts.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-muted-foreground mb-4">No bank accounts added</p>
            <p className="text-sm text-muted-foreground mb-4">
              Add a bank account to start withdrawing funds
            </p>
            <Button onClick={onAddAccount}>
              <Plus className="h-4 w-4 mr-2" />
              Add Bank Account
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4">
              {bankAccounts.map((account) => (
                <div key={account.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{account.bank_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {account.account_name} • ****{account.account_number.slice(-4)}
                      </p>
                      {account.is_default && (
                        <Badge variant="secondary" className="text-xs mt-1">Default</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {account.is_verified && (
                        <Badge variant="default" className="text-xs">Verified</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={onWithdraw}
              >
                <Minus className="h-4 w-4 mr-2" />
                Withdraw Funds
              </Button>
              <Button 
                variant="outline"
                onClick={onAddAccount}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
