
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
