
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CreditCard, Banknote, Smartphone } from 'lucide-react';

interface AddFundsCardProps {
  onAddFunds: () => void;
}

export const AddFundsCard = ({ onAddFunds }: AddFundsCardProps) => {
  return (
    <Card className="cultural-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Add Funds to Wallet
        </CardTitle>
        <CardDescription>Top up your wallet using various secure payment methods</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <CreditCard className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">Cards</p>
            <p className="text-xs text-muted-foreground">Visa, Mastercard</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Banknote className="h-8 w-8 mx-auto mb-2 text-success" />
            <p className="text-sm font-medium">Bank Transfer</p>
            <p className="text-xs text-muted-foreground">Direct transfer</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Smartphone className="h-8 w-8 mx-auto mb-2 text-info" />
            <p className="text-sm font-medium">Mobile Money</p>
            <p className="text-xs text-muted-foreground">USSD, Apps</p>
          </div>
        </div>
        
        <div className="text-center py-4">
          <p className="text-muted-foreground mb-4">
            Use our secure payment gateway to add funds instantly to your wallet
          </p>
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
            onClick={onAddFunds}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Funds Now
          </Button>
        </div>
        
        <div className="text-center text-xs text-muted-foreground">
          All transactions are secured with 256-bit SSL encryption
        </div>
      </CardContent>
    </Card>
  );
};
