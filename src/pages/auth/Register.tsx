
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.email.trim()) {
      toast({
        title: "Missing information",  
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter your phone number.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.countryOfResidence) {
      toast({
        title: "Missing information",
        description: "Please select your country of residence.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.password) {
      toast({
        title: "Missing information",
        description: "Please create a password.",
        variant: "destructive",
      });
      return false;
    }
    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.termsAccepted || !formData.privacyPolicyAccepted) {
      toast({
        title: "Agreement required",
        description: "Please accept the Terms of Service and Privacy Policy to continue.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep3()) return;

    setIsSubmitting(true);
    
    try {
      console.log('Starting registration process...');
      
      // Create a timeout promise
      const timeoutPromise = new Promise<{ error: any }>((_, reject) => {
        setTimeout(() => reject(new Error('Registration timeout')), 30000); // 30 second timeout
      });
      
      // Race between signup and timeout
      const signUpPromise = signUp({
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

      const result = await Promise.race([signUpPromise, timeoutPromise]);

      if (result.error) {
        console.error('Registration error:', result.error);
        
        let errorMessage = "Please try again or contact support.";
        
        if (result.error.message?.includes('timeout') || result.error.message?.includes('504')) {
          errorMessage = "Registration is taking longer than expected. Please try again in a moment.";
        } else if (result.error.message?.includes('already registered') || result.error.message?.includes('already been registered')) {
          errorMessage = "This email is already registered. Please try logging in instead.";
        } else if (result.error.message?.includes('Invalid email')) {
          errorMessage = "Please enter a valid email address.";
        } else if (result.error.message?.includes('Password')) {
          errorMessage = "Password must be at least 6 characters long.";
        }
        
        toast({
          title: "Registration failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        console.log('Registration successful');
        toast({
          title: "Registration successful!",
          description: "Please check your email to verify your account before signing in.",
        });
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Registration exception:', error);
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error.message?.includes('timeout')) {
        errorMessage = "Registration is taking longer than expected. Please try again in a moment.";
      }
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>
                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={isSubmitting}
                >
                  Continue
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="countryOfResidence">Country of Residence *</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange('countryOfResidence', value)}
                    disabled={isSubmitting}
                  >
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
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="outline"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    disabled={isSubmitting}
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
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      required
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isSubmitting}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="termsAccepted"
                      checked={formData.termsAccepted}
                      onCheckedChange={(checked) => handleCheckboxChange('termsAccepted', checked as boolean)}
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
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
