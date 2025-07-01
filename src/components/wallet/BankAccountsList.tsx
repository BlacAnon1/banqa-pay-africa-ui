
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Building2 } from 'lucide-react';

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

interface BankAccountsListProps {
  bankAccounts: BankAccount[];
  onAddAccount: () => void;
}

export const BankAccountsList = ({ bankAccounts, onAddAccount }: BankAccountsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bank Accounts</CardTitle>
        <CardDescription>Manage your withdrawal bank accounts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {bankAccounts.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-muted-foreground mb-2">No bank accounts</p>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first bank account for withdrawals
            </p>
            <Button onClick={onAddAccount}>
              <Plus className="h-4 w-4 mr-2" />
              Add Bank Account
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {bankAccounts.map((account) => (
              <div key={account.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{account.bank_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {account.account_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Account: ****{account.account_number.slice(-4)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {account.is_default && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                      {account.is_verified && (
                        <Badge variant="default" className="text-xs">Verified</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onAddAccount}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Bank Account
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
