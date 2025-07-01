
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Droplets, Wifi, Receipt, Trash2, Tv, Smartphone, Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AirtimeForm } from '@/components/bills/AirtimeForm';

const PayBills = () => {
  const { t } = useLanguage();
  const [selectedService, setSelectedService] = useState('');

  const services = [
    { id: 'airtime', name: 'Airtime & Data', icon: Smartphone, color: 'bg-green-500', description: 'Mobile airtime & data bundles' },
    { id: 'electricity', name: t('bills.electricity'), icon: Zap, color: 'bg-yellow-500', description: 'Power utilities' },
    { id: 'water', name: t('bills.water'), icon: Droplets, color: 'bg-blue-500', description: 'Water utilities' },
    { id: 'internet', name: t('bills.internet'), icon: Wifi, color: 'bg-purple-500', description: 'Internet & broadband' },
    { id: 'tv', name: t('bills.tv'), icon: Tv, color: 'bg-indigo-500', description: 'TV subscriptions' },
    { id: 'gift_cards', name: 'Gift Cards', icon: Gift, color: 'bg-pink-500', description: 'Digital gift cards' },
  ];

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleBack = () => {
    setSelectedService('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pay Bills</h1>
        <p className="text-muted-foreground">Choose a service and pay your bills instantly</p>
      </div>

      {!selectedService ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <Card
              key={service.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => handleServiceSelect(service.id)}
            >
              <CardHeader className="text-center">
                <div className={`w-16 h-16 rounded-full ${service.color} flex items-center justify-center mx-auto mb-3`}>
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div>
          {selectedService === 'airtime' && <AirtimeForm onBack={handleBack} />}
          {selectedService === 'electricity' && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Electricity bill payment coming soon!</p>
            </div>
          )}
          {selectedService === 'water' && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Water bill payment coming soon!</p>
            </div>
          )}
          {selectedService === 'internet' && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Internet bill payment coming soon!</p>
            </div>
          )}
          {selectedService === 'tv' && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">TV subscription coming soon!</p>
            </div>
          )}
          {selectedService === 'gift_cards' && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Gift cards coming soon!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PayBills;
