
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLoans } from '@/hooks/useLoans';
import { Calculator, ArrowLeft } from 'lucide-react';

interface LoanProvider {
  id: string;
  name: string;
  min_loan_amount: number;
  max_loan_amount: number;
  min_interest_rate: number;
  max_interest_rate: number;
  min_tenure_months: number;
  max_tenure_months: number;
}

interface LoanApplicationFormProps {
  provider: LoanProvider;
  onBack: () => void;
  creditScore?: number;
}

export const LoanApplicationForm = ({ provider, onBack, creditScore }: LoanApplicationFormProps) => {
  const [formData, setFormData] = useState({
    amount: '',
    tenure_months: '',
    purpose: '',
    employment_status: '',
    monthly_income: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { submitLoanApplication } = useLoans();

  const calculateInterestRate = () => {
    if (!creditScore) return provider.max_interest_rate;
    
    if (creditScore >= 750) return provider.min_interest_rate;
    if (creditScore >= 650) return provider.min_interest_rate + (provider.max_interest_rate - provider.min_interest_rate) * 0.3;
    if (creditScore >= 550) return provider.min_interest_rate + (provider.max_interest_rate - provider.min_interest_rate) * 0.6;
    return provider.max_interest_rate;
  };

  const calculateMonthlyPayment = () => {
    const amount = parseFloat(formData.amount);
    const months = parseInt(formData.tenure_months);
    const rate = calculateInterestRate() / 100 / 12;

    if (!amount || !months || !rate) return 0;

    const monthlyPayment = (amount * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    return monthlyPayment;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const interestRate = calculateInterestRate();
      const monthlyPayment = calculateMonthlyPayment();

      await submitLoanApplication({
        provider_id: provider.id,
        amount: parseFloat(formData.amount),
        tenure_months: parseInt(formData.tenure_months),
        interest_rate: interestRate,
        monthly_payment: monthlyPayment,
        purpose: formData.purpose,
        employment_status: formData.employment_status,
        monthly_income: parseFloat(formData.monthly_income)
      });

      toast({
        title: "Application Submitted",
        description: "Your loan application has been submitted successfully. You'll receive updates via notifications.",
      });

      onBack();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit loan application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const monthlyPayment = calculateMonthlyPayment();
  const interestRate = calculateInterestRate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">Apply for {provider.name} Loan</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="cultural-card">
          <CardHeader>
            <CardTitle>Loan Application</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="amount">Loan Amount (₦)</Label>
                <Input
                  id="amount"
                  type="number"
                  min={provider.min_loan_amount}
                  max={provider.max_loan_amount}
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder={`${provider.min_loan_amount} - ${provider.max_loan_amount}`}
                  required
                />
              </div>

              <div>
                <Label htmlFor="tenure">Loan Term (months)</Label>
                <Select
                  value={formData.tenure_months}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, tenure_months: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: provider.max_tenure_months - provider.min_tenure_months + 1 }, (_, i) => {
                      const months = provider.min_tenure_months + i;
                      return (
                        <SelectItem key={months} value={months.toString()}>
                          {months} months
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="purpose">Loan Purpose</Label>
                <Select
                  value={formData.purpose}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, purpose: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="home_improvement">Home Improvement</SelectItem>
                    <SelectItem value="debt_consolidation">Debt Consolidation</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="employment">Employment Status</Label>
                <Select
                  value={formData.employment_status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, employment_status: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="self_employed">Self Employed</SelectItem>
                    <SelectItem value="business_owner">Business Owner</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="income">Monthly Income (₦)</Label>
                <Input
                  id="income"
                  type="number"
                  min="0"
                  value={formData.monthly_income}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthly_income: e.target.value }))}
                  placeholder="Enter your monthly income"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full banqa-gradient" 
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="cultural-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Loan Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-primary/5 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span>Loan Amount:</span>
                <span className="font-semibold">₦{formData.amount ? parseFloat(formData.amount).toLocaleString() : '0'}</span>
              </div>
              <div className="flex justify-between">
                <span>Interest Rate:</span>
                <span className="font-semibold">{interestRate.toFixed(2)}% APR</span>
              </div>
              <div className="flex justify-between">
                <span>Loan Term:</span>
                <span className="font-semibold">{formData.tenure_months || '0'} months</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg">
                <span>Monthly Payment:</span>
                <span className="font-bold text-primary">₦{monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Payment:</span>
                <span className="font-semibold">₦{(monthlyPayment * parseInt(formData.tenure_months || '0')).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            {creditScore && (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  ✓ Your credit score of {creditScore} qualifies you for a {interestRate.toFixed(2)}% interest rate
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
