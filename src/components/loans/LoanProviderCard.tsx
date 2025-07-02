
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface LoanProvider {
  id: string;
  name: string;
  min_loan_amount: number;
  max_loan_amount: number;
  min_interest_rate: number;
  max_interest_rate: number;
  min_tenure_months: number;
  max_tenure_months: number;
  countries_supported: string[];
  kyc_requirements: string[];
}

interface LoanProviderCardProps {
  provider: LoanProvider;
  onSelect: (provider: LoanProvider) => void;
  creditScore?: number;
}

export const LoanProviderCard = ({ provider, onSelect, creditScore }: LoanProviderCardProps) => {
  const getEffectiveRate = () => {
    if (!creditScore) return provider.max_interest_rate;
    
    // Better credit score = lower interest rate
    if (creditScore >= 750) return provider.min_interest_rate;
    if (creditScore >= 650) return provider.min_interest_rate + (provider.max_interest_rate - provider.min_interest_rate) * 0.3;
    if (creditScore >= 550) return provider.min_interest_rate + (provider.max_interest_rate - provider.min_interest_rate) * 0.6;
    return provider.max_interest_rate;
  };

  const effectiveRate = getEffectiveRate();

  return (
    <Card className="cultural-card hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{provider.name}</CardTitle>
          <Badge variant="secondary">
            {effectiveRate.toFixed(1)}% APR
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Min Amount</p>
            <p className="font-semibold">{formatCurrency(provider.min_loan_amount, 'NGN')}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Max Amount</p>
            <p className="font-semibold">{formatCurrency(provider.max_loan_amount, 'NGN')}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Min Term</p>
            <p className="font-semibold">{provider.min_tenure_months} months</p>
          </div>
          <div>
            <p className="text-muted-foreground">Max Term</p>
            <p className="font-semibold">{provider.max_tenure_months} months</p>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-2">KYC Requirements</p>
          <div className="flex flex-wrap gap-1">
            {provider.kyc_requirements.slice(0, 3).map((req, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {req.replace('_', ' ')}
              </Badge>
            ))}
            {provider.kyc_requirements.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{provider.kyc_requirements.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <Button 
          onClick={() => onSelect(provider)} 
          className="w-full banqa-gradient"
        >
          Apply Now
        </Button>
      </CardContent>
    </Card>
  );
};
