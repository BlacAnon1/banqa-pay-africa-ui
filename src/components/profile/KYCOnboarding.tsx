
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, FileText, User, MapPin, Briefcase, Camera } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

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
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [kycDocuments, setKycDocuments] = useState<KYCDocument[]>([]);
  const [steps, setSteps] = useState<KYCStep[]>([]);

  useEffect(() => {
    if (profile) {
      fetchKYCDocuments();
      calculateSteps();
    }
  }, [profile]);

  const fetchKYCDocuments = async () => {
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
    }
  };

  const calculateSteps = () => {
    if (!profile) return;

    const hasDocument = (docType: string) => 
      kycDocuments.some(doc => doc.document_type === docType);

    const isDocumentApproved = (docType: string) =>
      kycDocuments.some(doc => doc.document_type === docType && doc.verification_status === 'approved');

    const newSteps: KYCStep[] = [
      {
        id: 'basic_profile',
        title: 'Complete Basic Profile',
        description: 'Add your personal information, address, and contact details',
        icon: <User className="h-5 w-5" />,
        completed: !!(profile.full_name && profile.phone_number && profile.date_of_birth && 
                     profile.address_line_1 && profile.city && profile.country_of_residence),
        required: true,
        action: () => navigate('/profile/complete')
      },
      {
        id: 'employment_info',
        title: 'Employment Information',
        description: 'Provide your occupation, employer, and income details',
        icon: <Briefcase className="h-5 w-5" />,
        completed: !!(profile.occupation && profile.employer && profile.monthly_income),
        required: true,
        action: () => navigate('/profile/complete')
      },
      {
        id: 'identity_document',
        title: 'Identity Verification',
        description: 'Upload your government-issued ID (National ID, Passport, or Driver\'s License)',
        icon: <FileText className="h-5 w-5" />,
        completed: isDocumentApproved('national_id') || isDocumentApproved('passport') || isDocumentApproved('drivers_license'),
        required: true,
        action: () => navigate('/kyc/documents')
      },
      {
        id: 'address_proof',
        title: 'Address Verification',
        description: 'Upload a utility bill or bank statement as proof of address',
        icon: <MapPin className="h-5 w-5" />,
        completed: isDocumentApproved('utility_bill') || isDocumentApproved('bank_statement'),
        required: true,
        action: () => navigate('/kyc/documents')
      },
      {
        id: 'selfie_verification',
        title: 'Selfie Verification',
        description: 'Take a selfie holding your ID for identity confirmation',
        icon: <Camera className="h-5 w-5" />,
        completed: isDocumentApproved('selfie'),
        required: false,
        action: () => navigate('/kyc/documents')
      }
    ];

    setSteps(newSteps);

    // Calculate completion percentage
    const requiredSteps = newSteps.filter(step => step.required);
    const completedRequiredSteps = requiredSteps.filter(step => step.completed);
    const allSteps = newSteps;
    const completedAllSteps = allSteps.filter(step => step.completed);
    
    // Base percentage on required steps, bonus for optional steps
    const basePercentage = (completedRequiredSteps.length / requiredSteps.length) * 80;
    const bonusPercentage = ((completedAllSteps.length - completedRequiredSteps.length) / (allSteps.length - requiredSteps.length)) * 20;
    
    setCompletionPercentage(Math.round(basePercentage + bonusPercentage));
  };

  const getStatusIcon = (completed: boolean, required: boolean) => {
    if (completed) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (required) {
      return <Clock className="h-5 w-5 text-orange-500" />;
    }
    return <XCircle className="h-5 w-5 text-gray-400" />;
  };

  const getStatusBadge = (completed: boolean, required: boolean) => {
    if (completed) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
    }
    if (required) {
      return <Badge variant="outline" className="border-orange-500 text-orange-600">Required</Badge>;
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
          <CardTitle className="text-2xl font-bold text-emerald-600">
            Complete Your Profile
          </CardTitle>
          <CardDescription>
            Complete your KYC verification to unlock all Banqa features including loans, cards, and premium services.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Profile Completion</span>
              <span className="text-2xl font-bold text-emerald-600">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
            
            {completionPercentage === 100 ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="font-semibold text-green-800">Profile Complete!</p>
                <p className="text-green-600">You now have access to all Banqa features.</p>
              </div>
            ) : nextStep ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Next Step</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {nextStep.icon}
                    <div>
                      <p className="font-medium text-blue-800">{nextStep.title}</p>
                      <p className="text-sm text-blue-600">{nextStep.description}</p>
                    </div>
                  </div>
                  {nextStep.action && (
                    <Button onClick={nextStep.action} size="sm">
                      Continue
                    </Button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verification Steps</CardTitle>
          <CardDescription>
            Follow these steps to complete your profile and unlock all features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex items-center space-x-3 flex-1">
                  {step.icon}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">{step.title}</h4>
                      {getStatusBadge(step.completed, step.required)}
                    </div>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusIcon(step.completed, step.required)}
                  {step.action && !step.completed && (
                    <Button onClick={step.action} size="sm" variant="outline">
                      {step.required ? 'Complete' : 'Add'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Benefits of Complete Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-emerald-600">✓ Access to Loans</h4>
              <p className="text-sm text-gray-600">Apply for personal and business loans with competitive rates</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-emerald-600">✓ Higher Transaction Limits</h4>
              <p className="text-sm text-gray-600">Increased daily and monthly transaction limits</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-emerald-600">✓ Virtual & Physical Cards</h4>
              <p className="text-sm text-gray-600">Request debit and credit cards for online and offline use</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-emerald-600">✓ Premium Support</h4>
              <p className="text-sm text-gray-600">Priority customer support and dedicated account management</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KYCOnboarding;
