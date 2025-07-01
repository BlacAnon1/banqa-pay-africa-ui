
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AddFundsCardProps {
  onAddFunds: () => void;
}

export const AddFundsCard = ({ onAddFunds }: AddFundsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Funds to Wallet</CardTitle>
        <CardDescription>Top up your wallet using various payment methods</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            Use our secure payment gateway to add funds to your wallet
          </p>
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={onAddFunds}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Funds Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
