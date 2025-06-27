
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

interface Service {
  id: string;
  service_type: string;
  country: string;
  provider_name: string;
  api_endpoint?: string;
  input_fields: Json;
  is_active: boolean;
}

export const useServices = (country?: string) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      let query = supabase
        .from('services')
        .select('*')
        .eq('is_active', true);

      if (country) {
        query = query.eq('country', country);
      }

      const { data, error } = await query.order('service_type').order('provider_name');

      if (error) {
        console.error('Error fetching services:', error);
        return;
      }

      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getServicesByType = (serviceType: string) => {
    return services.filter(s => s.service_type === serviceType);
  };

  const getServiceTypes = () => {
    const types = [...new Set(services.map(s => s.service_type))];
    return types;
  };

  const getInputFields = (service: Service): any[] => {
    // Helper function to safely parse input_fields as an array
    if (Array.isArray(service.input_fields)) {
      return service.input_fields;
    }
    return [];
  };

  useEffect(() => {
    fetchServices();
  }, [country]);

  return {
    services,
    loading,
    fetchServices,
    getServicesByType,
    getServiceTypes,
    getInputFields
  };
};
