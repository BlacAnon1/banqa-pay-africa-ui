
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
      console.log('useLoans: Starting to fetch data...');
      try {
        // Fetch loan providers
        console.log('useLoans: Fetching loan providers...');
        const { data: providers, error: providersError } = await supabase
          .from('loan_providers')
          .select('*')
          .eq('is_active', true);

        if (providersError) {
          console.error('Error fetching loan providers:', providersError);
        } else {
          console.log('useLoans: Raw providers data:', providers);
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
          
          console.log('useLoans: Transformed providers:', transformedProviders);
          setLoanProviders(transformedProviders);
        }

        // Fetch user's loan applications if authenticated
        if (profile?.id) {
          console.log('useLoans: Fetching loan applications for user:', profile.id);
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
            console.log('useLoans: Raw applications data:', applications);
            // Transform the nested loan_providers data
            const transformedApplications = applications?.map(app => ({
              ...app,
              loan_providers: {
                ...app.loan_providers,
                countries_supported: Array.isArray(app.loan_providers?.countries_supported)
                  ? app.loan_providers.countries_supported as string[]
                  : typeof app.loan_providers?.countries_supported === 'string'
                  ? [app.loan_providers.countries_supported]
                  : ['NG'],
                kyc_requirements: Array.isArray(app.loan_providers?.kyc_requirements)
                  ? app.loan_providers.kyc_requirements as string[]
                  : typeof app.loan_providers?.kyc_requirements === 'string'
                  ? [app.loan_providers.kyc_requirements]
                  : ['national_id', 'bank_statement', 'proof_of_income']
              }
            })) || [];
            
            console.log('useLoans: Transformed applications:', transformedApplications);
            setLoanApplications(transformedApplications);
          }
        } else {
          console.log('useLoans: No user profile, skipping applications fetch');
        }
      } catch (error) {
        console.error('Error fetching loan data:', error);
      } finally {
        console.log('useLoans: Setting loading to false');
        setLoading(false);
      }
    };

    fetchData();
  }, [profile?.id]);

  const submitLoanApplication = async (applicationData: any) => {
    console.log('useLoans: Submitting loan application:', applicationData);
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
        console.error('Error submitting loan application:', error);
        throw error;
      }

      console.log('useLoans: Loan application submitted successfully:', data);

      // Trigger real-time loan processing
      setTimeout(async () => {
        try {
          console.log('Processing loan application in background...');
          await supabase.functions.invoke('process_loan_application', {
            body: { application_id: data.id }
          });
        } catch (processError) {
          console.error('Error processing loan application:', processError);
        }
      }, 2000); // Process after 2 seconds to simulate real-world delay

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
          countries_supported: Array.isArray(app.loan_providers?.countries_supported)
            ? app.loan_providers.countries_supported as string[]
            : typeof app.loan_providers?.countries_supported === 'string'
            ? [app.loan_providers.countries_supported]
            : ['NG'],
          kyc_requirements: Array.isArray(app.loan_providers?.kyc_requirements)
            ? app.loan_providers.kyc_requirements as string[]
            : typeof app.loan_providers?.kyc_requirements === 'string'
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

  console.log('useLoans: Returning data:', { loanProviders: loanProviders.length, loanApplications: loanApplications.length, loading });

  return {
    loanProviders,
    loanApplications,
    loading,
    submitLoanApplication
  };
};
