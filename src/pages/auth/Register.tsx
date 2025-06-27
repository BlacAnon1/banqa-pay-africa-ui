
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

const countries = [
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'GH', name: 'Ghana' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'EG', name: 'Egypt' },
  { code: 'MA', name: 'Morocco' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'UG', name: 'Uganda' },
  { code: 'TZ', name: 'Tanzania' },
];

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    countryOfResidence: '',
    dateOfBirth: '',
    termsAccepted: false,
    privacyPolicyAccepted: false,
    marketingConsent: false,
  });
  
  const [step, setStep] = useState(1);
  const { signUp, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.termsAccepted || !formData.privacyPolicyAccepted) {
      toast({
        title: "Agreement required",
        description: "Please accept the Terms of Service and Privacy Policy to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        countryOfResidence: formData.countryOfResidence,
        dateOfBirth: formData.dateOfBirth,
        termsAccepted: formData.termsAccepted,
        privacyPolicyAccepted: formData.privacyPolicyAccepted,
        marketingConsent: formData.marketingConsent,
      });

      if (error) {
        toast({
          title: "Registration failed",
          description: error.message || "Please try again or contact support.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration successful!",
          description: "Please check your email to verify your account.",
        });
        navigate('/login');
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.phoneNumber) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <CardTitle className="text-2xl font-bold text-emerald-600">
            Join Banqa
          </CardTitle>
          <CardDescription>
            Step {step} of 3 - Create your account to start financial services across Africa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full legal name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+234 123 456 7890"
                    required
                  />
                </div>
                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  Continue
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="countryOfResidence">Country of Residence *</Label>
                  <Select onValueChange={(value) => handleSelectChange('countryOfResidence', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    Continue
                  </Button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password">Create Password *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="termsAccepted"
                      checked={formData.termsAccepted}
                      onCheckedChange={(checked) => handleCheckboxChange('termsAccepted', checked as boolean)}
                    />
                    <Label htmlFor="termsAccepted" className="text-sm">
                      I accept the <Link to="/terms" className="text-emerald-600 hover:underline">Terms of Service</Link> *
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="privacyPolicyAccepted"
                      checked={formData.privacyPolicyAccepted}
                      onCheckedChange={(checked) => handleCheckboxChange('privacyPolicyAccepted', checked as boolean)}
                    />
                    <Label htmlFor="privacyPolicyAccepted" className="text-sm">
                      I accept the <Link to="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</Link> *
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="marketingConsent"
                      checked={formData.marketingConsent}
                      onCheckedChange={(checked) => handleCheckboxChange('marketingConsent', checked as boolean)}
                    />
                    <Label htmlFor="marketingConsent" className="text-sm">
                      I agree to receive marketing communications
                    </Label>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </div>
              </>
            )}
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
