
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface QuickPayPreference {
  id: string;
  user_id: string;
  service_name: string;
  service_icon: string;
  service_color: string;
  service_type: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuickPayService {
  name: string;
  icon: string;
  color: string;
  type: string;
}

// Default services that new users will have
const DEFAULT_SERVICES: QuickPayService[] = [
  { name: 'airtime', icon: 'Smartphone', color: 'bg-green-500', type: 'telecom' },
  { name: 'data', icon: 'Wifi', color: 'bg-blue-500', type: 'telecom' },
  { name: 'bills.electricity', icon: 'Zap', color: 'bg-yellow-500', type: 'utility' },
  { name: 'bills.water', icon: 'Droplets', color: 'bg-blue-400', type: 'utility' },
];

export const useQuickPayPreferences = () => {
  const [preferences, setPreferences] = useState<QuickPayPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  const { user } = useAuth();

  const fetchPreferences = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_quick_pay_preferences')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      setPreferences(data || []);
      
      // If user has no preferences, initialize with defaults
      if (!data || data.length === 0) {
        await initializeDefaultServices();
      } else {
        setHasInitialized(true);
      }
    } catch (error) {
      console.error('Error fetching quick pay preferences:', error);
      toast({
        title: "Error",
        description: "Failed to load your quick pay preferences",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultServices = async () => {
    if (!user?.id || hasInitialized) return;

    try {
      const defaultPreferences = DEFAULT_SERVICES.map((service, index) => ({
        user_id: user.id,
        service_name: service.name,
        service_icon: service.icon,
        service_color: service.color,
        service_type: service.type,
        display_order: index
      }));

      const { data, error } = await supabase
        .from('user_quick_pay_preferences')
        .insert(defaultPreferences)
        .select();

      if (error) throw error;

      setPreferences(data || []);
      setHasInitialized(true);
    } catch (error) {
      console.error('Error initializing default services:', error);
    }
  };

  const addPreference = async (service: QuickPayService) => {
    if (!user?.id) return;

    try {
      const maxOrder = Math.max(...preferences.map(p => p.display_order), -1);
      
      const { data, error } = await supabase
        .from('user_quick_pay_preferences')
        .insert({
          user_id: user.id,
          service_name: service.name,
          service_icon: service.icon,
          service_color: service.color,
          service_type: service.type,
          display_order: maxOrder + 1
        })
        .select()
        .single();

      if (error) throw error;

      setPreferences(prev => [...prev, data]);
      toast({
        title: "Success",
        description: `Service added to Quick Pay`
      });
    } catch (error) {
      console.error('Error adding preference:', error);
      toast({
        title: "Error",
        description: "Failed to add service to Quick Pay",
        variant: "destructive"
      });
    }
  };

  const removePreference = async (preferenceId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('user_quick_pay_preferences')
        .update({ is_active: false })
        .eq('id', preferenceId);

      if (error) throw error;

      setPreferences(prev => prev.filter(p => p.id !== preferenceId));
      toast({
        title: "Success",
        description: "Service removed from Quick Pay"
      });
    } catch (error) {
      console.error('Error removing preference:', error);
      toast({
        title: "Error",
        description: "Failed to remove service from Quick Pay",
        variant: "destructive"
      });
    }
  };

  const reorderPreferences = async (newOrder: QuickPayPreference[]) => {
    if (!user?.id) return;

    try {
      const updates = newOrder.map((pref, index) => ({
        id: pref.id,
        display_order: index
      }));

      for (const update of updates) {
        await supabase
          .from('user_quick_pay_preferences')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }

      setPreferences(newOrder);
    } catch (error) {
      console.error('Error reordering preferences:', error);
      toast({
        title: "Error",
        description: "Failed to reorder services",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, [user?.id]);

  return {
    preferences,
    loading,
    addPreference,
    removePreference,
    reorderPreferences,
    refetch: fetchPreferences
  };
};
