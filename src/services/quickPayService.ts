
import { supabase } from '@/integrations/supabase/client';
import { QuickPayPreference, QuickPayService } from '@/types/quickPay';
import { DEFAULT_SERVICES } from '@/constants/quickPayDefaults';

export class QuickPayServiceClass {
  static async fetchPreferences(userId: string): Promise<QuickPayPreference[]> {
    const { data, error } = await supabase
      .from('user_quick_pay_preferences')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async initializeDefaultServices(userId: string): Promise<QuickPayPreference[]> {
    const defaultPreferences = DEFAULT_SERVICES.map((service, index) => ({
      user_id: userId,
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
    return data || [];
  }

  static async addPreference(userId: string, service: QuickPayService, maxOrder: number): Promise<QuickPayPreference> {
    const { data, error } = await supabase
      .from('user_quick_pay_preferences')
      .insert({
        user_id: userId,
        service_name: service.name,
        service_icon: service.icon,
        service_color: service.color,
        service_type: service.type,
        display_order: maxOrder + 1
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async removePreference(preferenceId: string): Promise<void> {
    const { error } = await supabase
      .from('user_quick_pay_preferences')
      .update({ is_active: false })
      .eq('id', preferenceId);

    if (error) throw error;
  }

  static async updatePreferenceOrder(preferenceId: string, displayOrder: number): Promise<void> {
    const { error } = await supabase
      .from('user_quick_pay_preferences')
      .update({ display_order: displayOrder })
      .eq('id', preferenceId);

    if (error) throw error;
  }
}
