
import { useState } from 'react';
import { CreditScoreCard } from '@/components/loans/CreditScoreCard';
import { LoanProviderCard } from '@/components/loans/LoanProviderCard';
import { LoanApplicationForm } from '@/components/loans/LoanApplicationForm';
import { LoanHistory } from '@/components/loans/LoanHistory';
import { useLoans } from '@/hooks/useLoans';
import { useCreditScore } from '@/hooks/useCreditScore';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Banknote, Users, TrendingUp, Shield } from 'lucide-react';

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

const Loans = () => {
  console.log('Loans component rendering...');
  
  try {
    const { loanProviders, loading } = useLoans();
    const { creditScore } = useCreditScore();
    const { t } = useLanguage();
    const [selectedProvider, setSelectedProvider] = useState<LoanProvider | null>(null);

    console.log('Loans data:', { loanProviders, loading, creditScore });

    if (loading) {
      console.log('Showing loading state');
      return (
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      );
    }

    if (selectedProvider) {
      console.log('Showing loan application form for:', selectedProvider.name);
      return (
        <LoanApplicationForm
          provider={selectedProvider}
          onBack={() => setSelectedProvider(null)}
          creditScore={creditScore?.score}
        />
      );
    }

    console.log('Showing main loans page');
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('nav.loans')}</h1>
          <p className="text-muted-foreground">
            Get instant loans from trusted partners. Compare rates and apply in minutes.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="cultural-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Lenders</p>
                  <p className="text-2xl font-bold">{loanProviders?.length || 0}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="cultural-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Min Rate</p>
                  <p className="text-2xl font-bold">
                    {loanProviders?.length > 0 ? Math.min(...loanProviders.map(p => p.min_interest_rate)).toFixed(1) : '0'}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="cultural-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Max Amount</p>
                  <p className="text-2xl font-bold">
                    ₦{loanProviders?.length > 0 ? (Math.max(...loanProviders.map(p => p.max_loan_amount)) / 1000000).toFixed(1) : '0'}M
                  </p>
                </div>
                <Banknote className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="cultural-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">KYC Protected</p>
                  <p className="text-2xl font-bold">100%</p>
                </div>
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Credit Score Section */}
            <CreditScoreCard />

            {/* Loan Providers */}
            <Card className="cultural-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Available Loan Providers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {loanProviders?.map((provider) => (
                    <LoanProviderCard
                      key={provider.id}
                      provider={provider}
                      onSelect={setSelectedProvider}
                      creditScore={creditScore?.score}
                    />
                  )) || <p>No loan providers available</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Loan History */}
            <LoanHistory />

            {/* KYC Info Card */}
            <Card className="cultural-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  KYC & Eligibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Required Documents:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">ID</Badge>
                      <span>National ID/Passport</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Bank</Badge>
                      <span>Bank Statement (3 months)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Income</Badge>
                      <span>Proof of Income</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Your credit score and KYC status determine your loan eligibility and interest rates.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in Loans component:', error);
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Loans</h1>
        <p className="text-gray-600">Please check the console for more details.</p>
      </div>
    );
  }
};

export default Loans;
