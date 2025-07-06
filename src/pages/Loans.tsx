import { useState } from 'react';
import { CreditScoreCard } from '@/components/loans/CreditScoreCard';
import { useLoans } from '@/hooks/useLoans';
import { useCreditScore } from '@/hooks/useCreditScore';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Banknote, Users, TrendingUp, Shield, Clock, Bell } from 'lucide-react';

const Loans = () => {
  console.log('Loans component rendering...');
  
  try {
    const { loanProviders, loading } = useLoans();
    const { creditScore } = useCreditScore();
    const { t } = useLanguage();

    console.log('Loans data:', { loanProviders, loading, creditScore });

    if (loading) {
      console.log('Showing loading state');
      return (
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mb-2"></div>
            <div className="h-4 bg-muted rounded w-96"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      );
    }

    console.log('Showing coming soon loans page');
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('nav.loans')}</h1>
          <p className="text-muted-foreground">
            Get instant loans from trusted partners. Compare rates and apply in minutes.
          </p>
        </div>

        {/* Coming Soon Banner */}
        <Card className="cultural-card border-primary/20 bg-primary/5">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Loans Coming Soon!</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We're finalizing partnerships with top loan providers in Nigeria to bring you the best rates and instant approvals. 
              Get ready for seamless loan applications with competitive interest rates based on your credit score.
            </p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <Badge variant="secondary" className="text-sm">
                <Bell className="h-4 w-4 mr-1" />
                Notify me when ready
              </Badge>
            </div>
            <Button variant="outline" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        {/* Preview Stats Cards - Show what will be available */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="cultural-card opacity-75">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Partner Lenders</p>
                  <p className="text-2xl font-bold">{loanProviders?.length || 7}+</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="cultural-card opacity-75">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Starting Rate</p>
                  <p className="text-2xl font-bold">3.5%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="cultural-card opacity-75">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Max Amount</p>
                  <p className="text-2xl font-bold">₦10M</p>
                </div>
                <Banknote className="h-8 w-8 text-info" />
              </div>
            </CardContent>
          </Card>

          <Card className="cultural-card opacity-75">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approval Time</p>
                  <p className="text-2xl font-bold">2 hrs</p>
                </div>
                <Shield className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Credit Score Section - Keep this active */}
            <CreditScoreCard />

            {/* Coming Soon Features */}
            <Card className="cultural-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  What to Expect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-semibold mb-2">Instant Pre-approval</h4>
                    <p className="text-sm text-muted-foreground">
                      Get pre-approved instantly based on your credit score and transaction history.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-semibold mb-2">Competitive Rates</h4>
                    <p className="text-sm text-muted-foreground">
                      Access the best interest rates from multiple lenders in one place.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-semibold mb-2">Fast Disbursement</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive approved loans directly in your Banqa wallet within hours.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-semibold mb-2">Flexible Repayment</h4>
                    <p className="text-sm text-muted-foreground">
                      Choose repayment terms that work for your financial situation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Credit Building Tips */}
            <Card className="cultural-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Build Your Credit Score
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">Complete Your Profile</p>
                      <p className="text-xs text-muted-foreground">Add employment and income details</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">Verify Your Identity</p>
                      <p className="text-xs text-muted-foreground">Upload KYC documents</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">Use Banqa Regularly</p>
                      <p className="text-xs text-muted-foreground">Build transaction history</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    A higher credit score means better loan terms and faster approvals when loans launch.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Notification Signup */}
            <Card className="cultural-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Stay Updated
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Be the first to know when our loan services go live. We'll notify you through the app when you can start applying.
                </p>
                <Button variant="outline" className="w-full" disabled>
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications Active
                </Button>
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
        <h1 className="text-2xl font-bold text-destructive">Error Loading Loans</h1>
        <p className="text-muted-foreground">Please check the console for more details.</p>
      </div>
    );
  }
};

export default Loans;
