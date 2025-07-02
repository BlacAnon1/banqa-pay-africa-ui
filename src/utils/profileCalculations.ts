import { UserProfile } from '@/types/auth';

interface KYCDocument {
  document_type: string;
  verification_status: string;
}

/**
 * Calculate profile completion percentage
 * This function ensures consistent calculation across all components
 */
export const calculateProfileCompletion = (
  profile: UserProfile | null, 
  kycDocuments: KYCDocument[] = []
): number => {
  if (!profile) return 0;

  // Required profile fields (60% of total)
  const requiredProfileFields = [
    profile.full_name,
    profile.phone_number, 
    profile.date_of_birth,
    profile.address_line_1,
    profile.city,
    profile.country_of_residence,
  ];
  const completedProfileFields = requiredProfileFields.filter(
    field => field && field.toString().trim() !== ''
  ).length;

  // Required employment fields (20% of total)
  const requiredEmploymentFields = [
    profile.occupation,
    profile.employer,
    profile.monthly_income,
  ];
  const completedEmploymentFields = requiredEmploymentFields.filter(
    field => field && field.toString().trim() !== ''
  ).length;

  // Optional profile fields (10% of total)
  const optionalFields = [
    profile.gender,
    profile.nationality,
    profile.state_province,
    profile.address_line_2,
    profile.postal_code,
    profile.source_of_funds,
  ];
  const completedOptionalFields = optionalFields.filter(
    field => field && field.toString().trim() !== ''
  ).length;

  // KYC document verification (10% of total)
  const isDocumentApproved = (docType: string) =>
    kycDocuments.some(doc => 
      doc.document_type === docType && doc.verification_status === 'approved'
    );

  const requiredDocuments = ['national_id', 'passport', 'drivers_license']; // Identity
  const hasIdentityDoc = requiredDocuments.some(docType => isDocumentApproved(docType));
  
  const addressDocuments = ['utility_bill', 'bank_statement']; // Address proof
  const hasAddressDoc = addressDocuments.some(docType => isDocumentApproved(docType));

  const kycCompletionScore = (hasIdentityDoc ? 0.5 : 0) + (hasAddressDoc ? 0.5 : 0);

  // Calculate weighted percentage
  const profilePercentage = (completedProfileFields / requiredProfileFields.length) * 60;
  const employmentPercentage = (completedEmploymentFields / requiredEmploymentFields.length) * 20;
  const optionalPercentage = (completedOptionalFields / optionalFields.length) * 10;
  const kycPercentage = kycCompletionScore * 10;

  const totalPercentage = profilePercentage + employmentPercentage + optionalPercentage + kycPercentage;

  return Math.round(totalPercentage);
};

/**
 * Get completion status for profile steps
 */
export const getProfileStepsCompletion = (profile: UserProfile | null, kycDocuments: KYCDocument[] = []) => {
  if (!profile) return { basicProfile: false, employment: false, kycDocuments: false };

  const isDocumentApproved = (docType: string) =>
    kycDocuments.some(doc => 
      doc.document_type === docType && doc.verification_status === 'approved'
    );

  return {
    basicProfile: !!(profile.full_name && profile.phone_number && profile.date_of_birth && 
                     profile.address_line_1 && profile.city && profile.country_of_residence),
    employment: !!(profile.occupation && profile.employer && profile.monthly_income),
    identityDoc: isDocumentApproved('national_id') || isDocumentApproved('passport') || isDocumentApproved('drivers_license'),
    addressDoc: isDocumentApproved('utility_bill') || isDocumentApproved('bank_statement'),
    selfie: isDocumentApproved('selfie')
  };
};