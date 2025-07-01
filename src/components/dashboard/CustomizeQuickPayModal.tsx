
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuickPayPreferences, QuickPayService } from '@/hooks/useQuickPayPreferences';
import { 
  Zap, 
  Droplets, 
  Wifi, 
  Smartphone, 
  CreditCard, 
  Shield, 
  GraduationCap, 
  Banknote,
  X,
  Car,
  Home,
  Plane,
  Gift,
  Tv,
  Phone,
  Fuel,
  Receipt
} from 'lucide-react';

interface CustomizeQuickPayModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const availableServices: QuickPayService[] = [
  // Core services (some are defaults)
  { name: 'airtime', icon: 'Smartphone', color: 'bg-green-500', type: 'telecom' },
  { name: 'data', icon: 'Wifi', color: 'bg-blue-500', type: 'telecom' },
  { name: 'bills.electricity', icon: 'Zap', color: 'bg-yellow-500', type: 'utility' },
  { name: 'bills.water', icon: 'Droplets', color: 'bg-blue-400', type: 'utility' },
  
  // Additional services users can add
  { name: 'bills.internet', icon: 'Wifi', color: 'bg-purple-500', type: 'utility' },
  { name: 'bills.tv', icon: 'Tv', color: 'bg-orange-500', type: 'entertainment' },
  { name: 'bills.insurance', icon: 'Shield', color: 'bg-red-500', type: 'financial' },
  { name: 'bills.school', icon: 'GraduationCap', color: 'bg-indigo-500', type: 'education' },
  { name: 'bills.taxes', icon: 'Receipt', color: 'bg-emerald-600', type: 'government' },
  { name: 'bills.fuel', icon: 'Fuel', color: 'bg-gray-600', type: 'transport' },
  { name: 'bills.rent', icon: 'Home', color: 'bg-teal-500', type: 'housing' },
  { name: 'bills.flight', icon: 'Plane', color: 'bg-sky-500', type: 'travel' },
  { name: 'bills.giftcard', icon: 'Gift', color: 'bg-pink-500', type: 'retail' },
  { name: 'postpaid', icon: 'Phone', color: 'bg-blue-700', type: 'telecom' },
];

const iconMap = {
  Zap, Droplets, Wifi, Smartphone, CreditCard, Shield, 
  GraduationCap, Banknote, Car, Home, Plane, Gift, Tv, Phone, Fuel, Receipt
};

export const CustomizeQuickPayModal = ({ open, onOpenChange }: CustomizeQuickPayModalProps) => {
  const { t } = useLanguage();
  const { preferences, addPreference, removePreference } = useQuickPayPreferences();

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap] || Banknote;
  };

  const handleServiceToggle = (service: QuickPayService) => {
    const isAlreadyAdded = preferences.some(p => p.service_name === service.name);
    
    if (isAlreadyAdded) {
      const preference = preferences.find(p => p.service_name === service.name);
      if (preference) {
        removePreference(preference.id);
      }
    } else {
      addPreference(service);
    }
  };

  const isServiceAdded = (serviceName: string) => {
    return preferences.some(p => p.service_name === serviceName);
  };

  const getServiceDisplayName = (serviceName: string) => {
    // Handle special cases for core services
    if (serviceName === 'airtime') return 'Airtime';
    if (serviceName === 'data') return 'Data Bundle';
    return t(serviceName);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Customize Quick Pay
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Available Services</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableServices.map((service) => {
                const IconComponent = getIconComponent(service.icon);
                const isAdded = isServiceAdded(service.name);
                
                return (
                  <Button
                    key={service.name}
                    variant={isAdded ? "default" : "outline"}
                    className={`h-20 flex flex-col gap-2 relative ${
                      isAdded ? 'bg-primary text-primary-foreground' : ''
                    }`}
                    onClick={() => handleServiceToggle(service)}
                  >
                    {isAdded && (
                      <X className="absolute top-1 right-1 h-4 w-4" />
                    )}
                    <div className={`w-8 h-8 rounded-full ${service.color} flex items-center justify-center`}>
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs text-center leading-tight">
                      {getServiceDisplayName(service.name)}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Your Quick Pay Services</h3>
            {preferences.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No services added yet. Select services above to customize your Quick Pay.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {preferences.map((preference) => {
                  const IconComponent = getIconComponent(preference.service_icon);
                  
                  return (
                    <div key={preference.id} className="relative">
                      <div className="h-16 flex flex-col items-center gap-2 p-2 border rounded-lg">
                        <div className={`w-6 h-6 rounded-full ${preference.service_color} flex items-center justify-center`}>
                          <IconComponent className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-xs text-center leading-tight">
                          {getServiceDisplayName(preference.service_name)}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => removePreference(preference.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
