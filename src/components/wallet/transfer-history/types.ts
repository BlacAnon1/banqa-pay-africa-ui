
export interface Transfer {
  id: string;
  sender_id: string;
  recipient_id: string;
  amount_sent: number;
  amount_received: number;
  status: string;
  created_at: string;
  reference_number: string;
  description?: string;
  sender_profile?: {
    full_name: string;
    email: string;
    banqa_id: string;
  } | null;
  recipient_profile?: {
    full_name: string;
    email: string;
    banqa_id: string;
  } | null;
}

export interface TransferDisplayInfo {
  type: 'sent' | 'received';
  amount: number;
  icon: any;
  name: string;
  email: string;
  id: string;
  color: string;
}
