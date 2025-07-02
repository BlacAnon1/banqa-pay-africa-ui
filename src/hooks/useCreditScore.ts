
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CreditScore {
  id: string;
  score: number;
  grade: string;
  factors: any;
  last_updated: string;
  expires_at: string;
}

export const useCreditScore = () => {
  const [creditScore, setCreditScore] = useState<CreditScore | null>(null);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  const fetchCreditScore = async () => {
    if (!profile?.id) return;

    try {
      // First, try to get existing credit score
      const { data: existingScore } = await supabase
        .from('credit_scores')
        .select('*')
        .eq('user_id', profile.id)
        .maybeSingle();

      if (existingScore && new Date(existingScore.expires_at) > new Date()) {
        setCreditScore(existingScore);
        setLoading(false);
        return;
      }

      // Calculate new credit score
      const { data: calculatedScore, error } = await supabase
        .rpc('calculate_credit_score', { user_id_param: profile.id });

      if (error) {
        console.error('Error calculating credit score:', error);
        setLoading(false);
        return;
      }

      if (calculatedScore && calculatedScore.length > 0) {
        const scoreData = calculatedScore[0];
        
        // Upsert the credit score
        const { data: upsertedScore, error: upsertError } = await supabase
          .from('credit_scores')
          .upsert({
            user_id: profile.id,
            score: scoreData.score,
            grade: scoreData.grade,
            factors: {},
            last_updated: new Date().toISOString(),
            expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
          })
          .select()
          .single();

        if (!upsertError && upsertedScore) {
          setCreditScore(upsertedScore);
        }
      }
    } catch (error) {
      console.error('Error fetching credit score:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditScore();
  }, [profile?.id]);

  return { creditScore, loading, refetch: fetchCreditScore };
};
