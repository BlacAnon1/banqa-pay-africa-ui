
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, AlertCircle } from 'lucide-react';

const ProfileCompletion = () => {
  const { profile, updateProfile, loading, refreshProfile } = useAuth();
  const [formData, setFormData] = useState({
    gender: '',
    nationality: '',
    state_province: '',
    city: '',
    address_line_1: '',
    address_line_2: '',
    postal_code: '',
    occupation: '',
    employer: '',
    monthly_income: '',
    source_of_funds: '',
  });

  const [step, setStep] = useState(1);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Real-time profile updates
  useEffect(() => {
    if (!profile?.id) return;

    const channel = supabase
      .channel('profile_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${profile.id}`
        },
        () => {
          refreshProfile();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, refreshProfile]);

  useEffect(() => {
    if (profile) {
      setFormData({
        gender: profile.gender || '',
        nationality: profile.nationality || '',
        state_province: profile.state_province || '',
        city: profile.city || '',
        address_line_1: profile.address_line_1 || '',
        address_line_2: profile.address_line_2 || '',
        postal_code: profile.postal_code || '',
        occupation: profile.occupation || '',
        employer: profile.employer || '',
        monthly_income: profile.monthly_income?.toString() || '',
        source_of_funds: profile.source_of_funds || '',
      });

      // Calculate completion percentage - match KYCOnboarding logic
      const requiredFields = [
        profile.full_name, profile.phone_number, profile.date_of_birth,
        profile.address_line_1, profile.city, profile.country_of_residence,
        profile.occupation, profile.employer, profile.monthly_income
      ];
      const completedRequired = requiredFields.filter(field => field && field.toString().trim() !== '').length;
      
      const optionalFields = [
        profile.gender, profile.nationality, profile.state_province,
        profile.address_line_2, profile.postal_code, profile.source_of_funds
      ];
      const completedOptional = optionalFields.filter(field => field && field.toString().trim() !== '').length;
      
      // 80% for required fields + 20% for optional fields (same as KYCOnboarding)
      const basePercentage = (completedRequired / requiredFields.length) * 80;
      const bonusPercentage = (completedOptional / optionalFields.length) * 20;
      
      console.log('ProfileCompletion calculation:', {
        completedRequired,
        requiredFields: requiredFields.length,
        completedOptional,
        optionalFields: optionalFields.length,
        basePercentage,
        bonusPercentage,
        total: Math.round(basePercentage + bonusPercentage)
      });
      
      setCompletionPercentage(Math.round(basePercentage + bonusPercentage));
    }
  }, [profile]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const updateData = {
        ...formData,
        monthly_income: formData.monthly_income ? parseFloat(formData.monthly_income) : undefined,
        profile_completed: completionPercentage >= 80
      };

      const { error } = await updateProfile(updateData);
      
      if (error) {
        toast({
          title: "Update failed",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });
        
        // Auto-advance step if this was successful and we're not on the last step
        if (step < 3) {
          setStep(step + 1);
        }
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isStepComplete = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return !!(formData.gender && formData.nationality);
      case 2:
        return !!(formData.state_province && formData.city && formData.address_line_1);
      case 3:
        return !!(formData.occupation && formData.employer && formData.monthly_income && formData.source_of_funds);
      default:
        return false;
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Complete Your Profile
                {completionPercentage === 100 && <CheckCircle className="h-5 w-5 text-green-500" />}
              </CardTitle>
              <CardDescription>
                Complete your profile to access all Banqa features including cards, accounts, and crypto services.
              </CardDescription>
            </div>
            {completionPercentage >= 80 && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle className="h-4 w-4" />
                Profile Complete
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Profile Completion</span>
              <span className={completionPercentage >= 80 ? 'text-green-600 font-semibold' : ''}>
                {Math.round(completionPercentage)}%
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  {isStepComplete(1) && <CheckCircle className="h-5 w-5 text-green-500" />}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={(value) => handleSelectChange('gender', value)} value={formData.gender}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                      id="nationality"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      placeholder="Enter your nationality"
                    />
                  </div>
                </div>

                <Button type="button" onClick={nextStep} className="w-full">
                  Continue
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Address Information</h3>
                  {isStepComplete(2) && <CheckCircle className="h-5 w-5 text-green-500" />}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state_province">State/Province</Label>
                    <Input
                      id="state_province"
                      name="state_province"
                      value={formData.state_province}
                      onChange={handleChange}
                      placeholder="Enter state or province"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address_line_1">Address Line 1</Label>
                  <Input
                    id="address_line_1"
                    name="address_line_1"
                    value={formData.address_line_1}
                    onChange={handleChange}
                    placeholder="Enter your street address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
                  <Input
                    id="address_line_2"
                    name="address_line_2"
                    value={formData.address_line_2}
                    onChange={handleChange}
                    placeholder="Apartment, suite, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    placeholder="Enter postal code"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button type="button" onClick={prevStep} variant="outline" className="flex-1">
                    Back
                  </Button>
                  <Button type="button" onClick={nextStep} className="flex-1">
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Employment & Financial Information</h3>
                  {isStepComplete(3) && <CheckCircle className="h-5 w-5 text-green-500" />}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    placeholder="Enter your occupation"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employer">Employer</Label>
                  <Input
                    id="employer"
                    name="employer"
                    value={formData.employer}
                    onChange={handleChange}
                    placeholder="Enter your employer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthly_income">Monthly Income (USD)</Label>
                  <Input
                    id="monthly_income"
                    name="monthly_income"
                    type="number"
                    value={formData.monthly_income}
                    onChange={handleChange}
                    placeholder="Enter your monthly income"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source_of_funds">Source of Funds</Label>
                  <Select onValueChange={(value) => handleSelectChange('source_of_funds', value)} value={formData.source_of_funds}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source of funds" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salary">Salary/Employment</SelectItem>
                      <SelectItem value="business">Business Income</SelectItem>
                      <SelectItem value="investments">Investments</SelectItem>
                      <SelectItem value="inheritance">Inheritance</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex space-x-2">
                  <Button type="button" onClick={prevStep} variant="outline" className="flex-1">
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading || isSaving}>
                    {(loading || isSaving) ? 'Updating...' : 'Update Profile'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCompletion;
