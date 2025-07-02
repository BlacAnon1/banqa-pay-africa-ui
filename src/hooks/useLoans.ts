
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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

interface LoanApplication {
  id: string;
  provider_id: string;
  amount: number;
  tenure_months: number;
  interest_rate: number;
  monthly_payment: number;
  purpose: string;
  employment_status: string;
  monthly_income: number;
  status: string;
  created_at: string;
  loan_providers: LoanProvider;
}

export const useLoans = () => {
  const [loanProviders, setLoanProviders] = useState<LoanProvider[]>([]);
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch loan providers
        const { data: providers, error: providersError } = await supabase
          .from('loan_providers')
          .select('*')
          .eq('is_active', true);

        if (providersError) {
          console.error('Error fetching loan providers:', providersError);
        } else {
          // Transform the data to match our interface
          const transformedProviders = providers?.map(provider => ({
            ...provider,
            countries_supported: Array.isArray(provider.countries_supported) 
              ? provider.countries_supported as string[]
              : typeof provider.countries_supported === 'string'
              ? [provider.countries_supported]
              : ['NG'],
            kyc_requirements: Array.isArray(provider.kyc_requirements)
              ? provider.kyc_requirements as string[]
              : typeof provider.kyc_requirements === 'string'
              ? [provider.kyc_requirements]
              : ['national_id', 'bank_statement', 'proof_of_income']
          })) || [];
          
          setLoanProviders(transformedProviders);
        }

        // Fetch user's loan applications if authenticated
        if (profile?.id) {
          const { data: applications, error: applicationsError } = await supabase
            .from('loan_applications')
            .select(`
              *,
              loan_providers (*)
            `)
            .eq('user_id', profile.id)
            .order('created_at', { ascending: false });

          if (applicationsError) {
            console.error('Error fetching loan applications:', applicationsError);
          } else {
            // Transform the nested loan_providers data
            const transformedApplications = applications?.map(app => ({
              ...app,
              loan_providers: {
                ...app.loan_providers,
                countries_supported: Array.isArray(app.loan_providers.countries_supported)
                  ? app.loan_providers.countries_supported as string[]
                  : typeof app.loan_providers.countries_supported === 'string'
                  ? [app.loan_providers.countries_supported]
                  : ['NG'],
                kyc_requirements: Array.isArray(app.loan_providers.kyc_requirements)
                  ? app.loan_providers.kyc_requirements as string[]
                  : typeof app.loan_providers.kyc_requirements === 'string'
                  ? [app.loan_providers.kyc_requirements]
                  : ['national_id', 'bank_statement', 'proof_of_income']
              }
            })) || [];
            
            setLoanApplications(transformedApplications);
          }
        }
      } catch (error) {
        console.error('Error fetching loan data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile?.id]);

  const submitLoanApplication = async (applicationData: any) => {
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .insert({
          user_id: profile?.id,
          ...applicationData
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Refresh applications
      const { data: applications } = await supabase
        .from('loan_applications')
        .select(`
          *,
          loan_providers (*)
        `)
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false });

      // Transform the data similar to above
      const transformedApplications = applications?.map(app => ({
        ...app,
        loan_providers: {
          ...app.loan_providers,
          countries_supported: Array.isArray(app.loan_providers.countries_supported)
            ? app.loan_providers.countries_supported as string[]
            : typeof app.loan_providers.countries_supported === 'string'
            ? [app.loan_providers.countries_supported]
            : ['NG'],
          kyc_requirements: Array.isArray(app.loan_providers.kyc_requirements)
            ? app.loan_providers.kyc_requirements as string[]
            : typeof app.loan_providers.kyc_requirements === 'string'
            ? [app.loan_providers.kyc_requirements]
            : ['national_id', 'bank_statement', 'proof_of_income']
        }
      })) || [];

      setLoanApplications(transformedApplications);
      return data;
    } catch (error) {
      console.error('Error submitting loan application:', error);
      throw error;
    }
  };

  return {
    loanProviders,
    loanApplications,
    loading,
    submitLoanApplication
  };
};
