
import { QuickPayService } from '@/types/quickPay';

// Default services that new users will have
export const DEFAULT_SERVICES: QuickPayService[] = [
  { name: 'airtime', icon: 'Smartphone', color: 'bg-green-500', type: 'telecom' },
  { name: 'data', icon: 'Wifi', color: 'bg-blue-500', type: 'telecom' },
  { name: 'bills.electricity', icon: 'Zap', color: 'bg-yellow-500', type: 'utility' },
  { name: 'bills.water', icon: 'Droplets', color: 'bg-blue-400', type: 'utility' },
];
