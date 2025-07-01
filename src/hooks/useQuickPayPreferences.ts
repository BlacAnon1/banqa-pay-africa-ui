import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { QuickPayPreference, QuickPayService } from '@/types/quickPay';
import { QuickPayServiceClass } from '@/services/quickPayService';

export const useQuickPayPreferences = () => {
  const [preferences, setPreferences] = useState<QuickPayPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  const { user } = useAuth();

  console.log('useQuickPayPreferences hook called, user:', user?.id);

  const fetchPreferences = async () => {
    if (!user?.id) {
      console.log('No user ID available, skipping fetch');
      setLoading(false);
      return;
    }

    console.log('Fetching preferences for user:', user.id);

    try {
      const data = await QuickPayServiceClass.fetchPreferences(user.id);
      console.log('Fetched preferences:', data);
      setPreferences(data);
      
      // If user has no preferences, initialize with defaults
      if (data.length === 0) {
        console.log('No preferences found, initializing defaults...');
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
    if (!user?.id || hasInitialized) {
      console.log('Skipping initialization:', { userId: user?.id, hasInitialized });
      return;
    }

    console.log('Initializing default services for user:', user.id);

    try {
      const data = await QuickPayServiceClass.initializeDefaultServices(user.id);
      console.log('Initialized default services:', data);
      setPreferences(data);
      setHasInitialized(true);
    } catch (error) {
      console.error('Error initializing default services:', error);
    }
  };

  const addPreference = async (service: QuickPayService) => {
    if (!user?.id) return;

    // Check if service already exists more strictly
    const existingService = preferences.find(p => 
      p.service_name === service.name && p.is_active === true
    );
    
    if (existingService) {
      toast({
        title: "Service Already Added",
        description: "This service is already in your Quick Pay",
        variant: "destructive"
      });
      return;
    }

    try {
      const maxOrder = Math.max(...preferences.map(p => p.display_order), -1);
      const data = await QuickPayServiceClass.addPreference(user.id, service, maxOrder);
      
      setPreferences(prev => [...prev, data]);
      toast({
        title: "Success",
        description: `Service added to Quick Pay`
      });
    } catch (error: any) {
      console.error('Error adding preference:', error);
      
      // Check if it's a duplicate constraint error
      if (error?.code === '23505') {
        toast({
          title: "Service Already Added",
          description: "This service is already in your Quick Pay",
          variant: "destructive"
        });
        // Refresh preferences to ensure UI is in sync
        await fetchPreferences();
      } else {
        toast({
          title: "Error",
          description: "Failed to add service to Quick Pay",
          variant: "destructive"
        });
      }
    }
  };

  const removePreference = async (preferenceId: string) => {
    if (!user?.id) return;

    try {
      await QuickPayServiceClass.removePreference(preferenceId);
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
        await QuickPayServiceClass.updatePreferenceOrder(update.id, update.display_order);
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
    console.log('useQuickPayPreferences useEffect triggered, user.id:', user?.id);
    fetchPreferences();
  }, [user?.id]);

  console.log('useQuickPayPreferences returning:', { preferences: preferences.length, loading });

  return {
    preferences,
    loading,
    addPreference,
    removePreference,
    reorderPreferences,
    refetch: fetchPreferences
  };
};

// Re-export types for backward compatibility
export type { QuickPayPreference, QuickPayService };
