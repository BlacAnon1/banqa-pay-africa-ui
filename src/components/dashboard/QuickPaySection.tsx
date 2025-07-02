
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Zap, Droplets, Wifi, Smartphone, CreditCard, Shield, GraduationCap, Banknote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuickPayPreferences } from '@/hooks/useQuickPayPreferences';
import { AirtimeForm } from '@/components/bills/AirtimeForm';
import { DataForm } from '@/components/bills/DataForm';
import { ElectricityForm } from '@/components/bills/ElectricityForm';
import { WaterForm } from '@/components/bills/WaterForm';
import { InternetForm } from '@/components/bills/InternetForm';
import { TVForm } from '@/components/bills/TVForm';
import { GiftCardForm } from '@/components/bills/GiftCardForm';

interface QuickPaySectionProps {
  onCustomize: () => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Zap, Droplets, Wifi, Smartphone, CreditCard, Shield, 
  GraduationCap, Banknote
};

export const QuickPaySection = ({ onCustomize }: QuickPaySectionProps) => {
  const { t } = useLanguage();
  const { preferences, loading: preferencesLoading } = useQuickPayPreferences();
  const [selectedService, setSelectedService] = useState('');

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || Banknote;
  };

  const getServiceDisplayName = (serviceName: string) => {
    // Handle special cases for core services
    if (serviceName === 'airtime') return 'Airtime';
    if (serviceName === 'data') return 'Data Bundle';
    return t(serviceName);
  };

  const handleServiceClick = (serviceName: string) => {
    console.log('QuickPay service clicked:', serviceName);
    setSelectedService(serviceName);
  };

  const handleBack = () => {
    setSelectedService('');
  };

  // If a service is selected, show the form
  if (selectedService) {
    return (
      <Card className="lg:col-span-2 cultural-card border-primary/20">
        <CardContent className="p-6">
          {selectedService === 'airtime' && <AirtimeForm onBack={handleBack} />}
          {selectedService === 'data' && <DataForm onBack={handleBack} />}
          {selectedService === 'bills.electricity' && <ElectricityForm onBack={handleBack} />}
          {selectedService === 'bills.water' && <WaterForm onBack={handleBack} />}
          {selectedService === 'bills.internet' && <InternetForm onBack={handleBack} />}
          {selectedService === 'bills.tv' && <TVForm onBack={handleBack} />}
          {selectedService === 'bills.giftcard' && <GiftCardForm onBack={handleBack} />}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2 cultural-card border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-primary">{t('dashboard.quickPay')}</CardTitle>
            <CardDescription className="text-base">{t('dashboard.quickPaySubtitle')}</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={onCustomize}
          >
            <Settings className="h-4 w-4" />
            Customize
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {preferencesLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : preferences.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No Quick Pay services configured yet.</p>
            <Button
              variant="outline"
              onClick={onCustomize}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Customize Quick Pay
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {preferences.map((preference) => {
              const IconComponent = getIconComponent(preference.service_icon);
              
              return (
                <Button
                  key={preference.id}
                  variant="outline"
                  className="h-24 flex flex-col gap-3 hover:bg-primary/5 hover:border-primary rounded-xl cultural-card transition-all duration-300 hover:scale-105"
                  onClick={() => handleServiceClick(preference.service_name)}
                >
                  <div className={`w-10 h-10 rounded-full ${preference.service_color} flex items-center justify-center shadow-md`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-center leading-tight">
                    {getServiceDisplayName(preference.service_name)}
                  </span>
                </Button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
