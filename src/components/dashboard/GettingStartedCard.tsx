
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface GettingStartedCardProps {
  onAddFunds: () => void;
}

export const GettingStartedCard = ({ onAddFunds }: GettingStartedCardProps) => {
  const { t } = useLanguage();

  return (
    <Card className="lg:col-span-1 cultural-card border-accent/20">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-accent">{t('dashboard.getStarted')}</CardTitle>
        <CardDescription>Start your financial journey with Banqa</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Ready to start managing your bills?</p>
            <div className="space-y-3">
              <Button 
                className="w-full gap-2"
                onClick={onAddFunds}
              >
                <Plus className="h-4 w-4" />
                {t('dashboard.loadWallet')}
              </Button>
              <Button variant="outline" className="w-full">
                {t('dashboard.connectBank')}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
