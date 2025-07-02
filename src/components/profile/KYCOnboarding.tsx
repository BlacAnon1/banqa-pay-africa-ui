
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, FileText, User, MapPin, Briefcase, Camera, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { calculateProfileCompletion, getProfileStepsCompletion } from '@/utils/profileCalculations';

interface KYCStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  required: boolean;
  action?: () => void;
}

interface KYCDocument {
  document_type: string;
  verification_status: string;
}

const KYCOnboarding = () => {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [kycDocuments, setKycDocuments] = useState<KYCDocument[]>([]);
  const [steps, setSteps] = useState<KYCStep[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchKYCDocuments = useCallback(async () => {
    if (!profile?.id) return;

    try {
      const { data, error } = await supabase
        .from('kyc_documents')
        .select('document_type, verification_status')
        .eq('user_id', profile.id);

      if (error) throw error;
      setKycDocuments(data || []);
    } catch (error) {
      console.error('Error fetching KYC documents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch KYC documents. Please try again.",
        variant: "destructive",
      });
    }
  }, [profile?.id]);

  const calculateSteps = useCallback(() => {
    if (!profile) return;

    const stepsCompletion = getProfileStepsCompletion(profile, kycDocuments);

    const newSteps: KYCStep[] = [
      {
        id: 'basic_profile',
        title: 'Complete Basic Profile',
        description: 'Add your personal information, address, and contact details',
        icon: <User className="h-5 w-5" />,
        completed: stepsCompletion.basicProfile,
        required: true,
        action: () => {
          console.log('Navigating to /profile with complete tab');
          navigate('/profile', { state: { tab: 'complete' } });
        }
      },
      {
        id: 'employment_info',
        title: 'Employment Information',
        description: 'Provide your occupation, employer, and income details',
        icon: <Briefcase className="h-5 w-5" />,
        completed: stepsCompletion.employment,
        required: true,
        action: () => {
          console.log('Navigating to /profile with complete tab for employment');
          navigate('/profile', { state: { tab: 'complete' } });
        }
      },
      {
        id: 'identity_document',
        title: 'Identity Verification',
        description: 'Upload your government-issued ID (National ID, Passport, or Driver\'s License)',
        icon: <FileText className="h-5 w-5" />,
        completed: stepsCompletion.identityDoc,
        required: true,
        action: () => {
          console.log('Navigating to /profile with documents tab for identity');
          navigate('/profile', { state: { tab: 'documents' } });
        }
      },
      {
        id: 'address_proof',
        title: 'Address Verification',
        description: 'Upload a utility bill or bank statement as proof of address',
        icon: <MapPin className="h-5 w-5" />,
        completed: stepsCompletion.addressDoc,
        required: true,
        action: () => {
          console.log('Navigating to /profile with documents tab for address');
          navigate('/profile', { state: { tab: 'documents' } });
        }
      },
      {
        id: 'selfie_verification',
        title: 'Selfie Verification',
        description: 'Take a selfie holding your ID for identity confirmation',
        icon: <Camera className="h-5 w-5" />,
        completed: stepsCompletion.selfie,
        required: false,
        action: () => {
          console.log('Navigating to /profile with documents tab for selfie');
          navigate('/profile', { state: { tab: 'documents' } });
        }
      }
    ];

    setSteps(newSteps);

    // Use the shared calculation function
    const percentage = calculateProfileCompletion(profile, kycDocuments);
    setCompletionPercentage(percentage);
    
    console.log('KYCOnboarding calculation:', {
      profile: profile.full_name,
      percentage,
      stepsCompletion
    });
  }, [profile, kycDocuments, navigate]);

  // Real-time updates for profile changes
  useEffect(() => {
    if (!profile?.id) return;

    const profileChannel = supabase
      .channel('profile_changes')
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

    const kycChannel = supabase
      .channel('kyc_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'kyc_documents',
          filter: `user_id=eq.${profile.id}`
        },
        () => {
          fetchKYCDocuments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profileChannel);
      supabase.removeChannel(kycChannel);
    };
  }, [profile?.id, refreshProfile, fetchKYCDocuments]);

  useEffect(() => {
    if (profile) {
      fetchKYCDocuments();
    }
  }, [profile, fetchKYCDocuments]);

  useEffect(() => {
    calculateSteps();
  }, [calculateSteps]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refreshProfile(), fetchKYCDocuments()]);
      toast({
        title: "Refreshed",
        description: "Profile data has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh profile data.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusIcon = (completed: boolean, required: boolean) => {
    if (completed) {
      return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
    }
    if (required) {
      return <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
    }
    return <XCircle className="h-5 w-5 text-muted-foreground" />;
  };

  const getStatusBadge = (completed: boolean, required: boolean) => {
    if (completed) {
      return (
        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
          Completed
        </Badge>
      );
    }
    if (required) {
      return (
        <Badge variant="outline" className="border-amber-500 text-amber-600 dark:border-amber-400 dark:text-amber-400">
          Required
        </Badge>
      );
    }
    return <Badge variant="secondary">Optional</Badge>;
  };

  const getNextStep = () => {
    const nextRequiredStep = steps.find(step => step.required && !step.completed);
    const nextOptionalStep = steps.find(step => !step.required && !step.completed);
    return nextRequiredStep || nextOptionalStep;
  };

  const nextStep = getNextStep();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-primary animate-fade-in">
                Complete Your Profile
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Complete your KYC verification to unlock all Banqa features including loans, cards, and premium services.
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 animate-fade-in">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-foreground">Profile Completion</span>
              <span className="text-2xl font-bold text-primary">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-3 animate-scale-in" />
            
            {completionPercentage === 100 ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center animate-scale-in">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <p className="font-semibold text-green-800 dark:text-green-300">Profile Complete!</p>
                <p className="text-green-600 dark:text-green-400">You now have access to all Banqa features.</p>
              </div>
            ) : nextStep ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 animate-slide-in-right">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Next Step</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {nextStep.icon}
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-300">{nextStep.title}</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">{nextStep.description}</p>
                    </div>
                  </div>
                  {nextStep.action && (
                    <Button onClick={nextStep.action} size="sm" className="hover-scale">
                      Continue
                    </Button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-foreground">Verification Steps</CardTitle>
          <CardDescription className="text-muted-foreground">
            Follow these steps to complete your profile and unlock all features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-all duration-200 hover-scale group">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {index + 1}
                  </div>
                </div>
                <div className="flex items-center space-x-3 flex-1">
                  <div className="text-muted-foreground group-hover:text-primary transition-colors">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-foreground">{step.title}</h4>
                      {getStatusBadge(step.completed, step.required)}
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusIcon(step.completed, step.required)}
                  {step.action && !step.completed && (
                    <Button onClick={step.action} size="sm" variant="outline" className="hover-scale">
                      {step.required ? 'Complete' : 'Add'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-foreground">Benefits of Complete Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors hover-scale">
              <h4 className="font-semibold text-primary">✓ Access to Loans</h4>
              <p className="text-sm text-muted-foreground">Apply for personal and business loans with competitive rates</p>
            </div>
            <div className="space-y-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors hover-scale">
              <h4 className="font-semibold text-primary">✓ Higher Transaction Limits</h4>
              <p className="text-sm text-muted-foreground">Increased daily and monthly transaction limits</p>
            </div>
            <div className="space-y-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors hover-scale">
              <h4 className="font-semibold text-primary">✓ Virtual & Physical Cards</h4>
              <p className="text-sm text-muted-foreground">Request debit and credit cards for online and offline use</p>
            </div>
            <div className="space-y-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors hover-scale">
              <h4 className="font-semibold text-primary">✓ Premium Support</h4>
              <p className="text-sm text-muted-foreground">Priority customer support and dedicated account management</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KYCOnboarding;
