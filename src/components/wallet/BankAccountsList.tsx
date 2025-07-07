
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Building2, CheckCircle, Clock, AlertCircle, Shield } from 'lucide-react';
import { useState } from 'react';
import { BankVerificationModal } from './BankVerificationModal';

interface BankAccount {
  id: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  bank_code: string;
  is_default: boolean;
  is_verified: boolean;
  verification_status: string;
  created_at: string;
}

interface BankAccountsListProps {
  bankAccounts: BankAccount[];
  onAddAccount: () => void;
}

export const BankAccountsList = ({ bankAccounts, onAddAccount }: BankAccountsListProps) => {
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const getVerificationBadge = (account: BankAccount) => {
    if (account.is_verified) {
      return <Badge variant="default" className="bg-green-500 text-xs"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
    }
    
    switch (account.verification_status) {
      case 'pending':
        return <Badge variant="secondary" className="text-xs"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="text-xs"><AlertCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline" className="text-xs"><Shield className="h-3 w-3 mr-1" />Not Verified</Badge>;
    }
  };

  const handleVerifyAccount = (account: BankAccount) => {
    setSelectedAccount(account);
    setShowVerificationModal(true);
  };

  return (
    <>
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
                    <div className="flex-1">
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
                        {getVerificationBadge(account)}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {!account.is_verified && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerifyAccount(account)}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Verify
                        </Button>
                      )}
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

      <BankVerificationModal
        open={showVerificationModal}
        onOpenChange={setShowVerificationModal}
        bankAccount={selectedAccount}
      />
    </>
  );
};
