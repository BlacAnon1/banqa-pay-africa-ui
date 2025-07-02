
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLoans } from '@/hooks/useLoans';
import { History, Calendar, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const LoanHistory = () => {
  const { loanApplications, loading } = useLoans();

  if (loading) {
    return (
      <Card className="cultural-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Loan History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'disbursed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="cultural-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Loan History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loanApplications.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No loan applications yet. Apply for your first loan above!
          </p>
        ) : (
          <div className="space-y-4">
            {loanApplications.map((application) => (
              <div key={application.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="font-semibold">{application.loan_providers.name}</div>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(application.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-semibold">{formatCurrency(application.amount, 'NGN')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Term</p>
                      <p className="font-semibold">{application.tenure_months} months</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Interest Rate</p>
                    <p className="font-semibold">{application.interest_rate}% APR</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly Payment</p>
                    <p className="font-semibold">{formatCurrency(application.monthly_payment, 'NGN')}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Purpose:</span> {application.purpose.replace('_', ' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
