
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface InsightData {
  month: string;
  electricity: number;
  water: number;
  internet: number;
  total: number;
}

interface Forecast {
  service: string;
  nextBill: number;
  dueDate: string;
  confidence: number;
}

interface Suggestion {
  type: 'savings' | 'usage' | 'timing';
  title: string;
  description: string;
  potentialSaving: number;
}

export const useSmartInsights = () => {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchInsights = async () => {
    if (!user) return;

    try {
      // Fetch user insights from database
      const { data: insightsData, error: insightsError } = await supabase
        .from('user_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('month_year', { ascending: true });

      if (insightsError) throw insightsError;

      // Process insights data into chart format
      const processedInsights = processInsightsData(insightsData || []);
      setInsights(processedInsights);

      // Fetch forecasts
      const { data: forecastsData, error: forecastsError } = await supabase
        .from('bill_forecasts')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });

      if (forecastsError) throw forecastsError;

      const processedForecasts = forecastsData?.map(forecast => ({
        service: forecast.service_type,
        nextBill: forecast.predicted_amount,
        dueDate: forecast.due_date,
        confidence: forecast.confidence_score
      })) || [];

      setForecasts(processedForecasts);

      // Generate suggestions based on data
      const generatedSuggestions = generateSuggestions(insightsData || []);
      setSuggestions(generatedSuggestions);

    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const processInsightsData = (data: any[]) => {
    const monthlyData: { [key: string]: any } = {};

    data.forEach(insight => {
      const month = new Date(insight.month_year + '-01').toLocaleDateString('en-US', { month: 'short' });
      
      if (!monthlyData[month]) {
        monthlyData[month] = { month, electricity: 0, water: 0, internet: 0, total: 0 };
      }

      monthlyData[month][insight.service_type] = insight.amount_spent;
      monthlyData[month].total += insight.amount_spent;
    });

    return Object.values(monthlyData);
  };

  const generateSuggestions = (data: any[]): Suggestion[] => {
    const suggestions: Suggestion[] = [];

    // Analyze trends and generate suggestions
    if (data.length > 1) {
      const electricityData = data.filter(d => d.service_type === 'electricity');
      if (electricityData.length > 1) {
        const recent = electricityData[electricityData.length - 1];
        const previous = electricityData[electricityData.length - 2];
        
        if (recent.amount_spent > previous.amount_spent * 1.2) {
          suggestions.push({
            type: 'savings',
            title: 'High Electricity Usage Detected',
            description: 'Your electricity usage increased by over 20% this month. Consider using energy-efficient appliances or shifting usage to off-peak hours.',
            potentialSaving: Math.floor((recent.amount_spent - previous.amount_spent) * 0.3)
          });
        }
      }
    }

    return suggestions;
  };

  useEffect(() => {
    fetchInsights();
  }, [user]);

  return { insights, forecasts, suggestions, loading, refetch: fetchInsights };
};
