
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Zap, Droplets, Wifi, Receipt, Trash2, Tv, Smartphone, Gift, 
  Car, Home, Heart, GraduationCap, Shield, Plane, Bus, Train,
  Fuel, Building, Phone, CreditCard, Banknote, Users, Baby,
  Stethoscope, Briefcase, MapPin, ShoppingCart, Wrench, Gamepad2,
  Radio, Newspaper, Camera, Music
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AirtimeForm } from '@/components/bills/AirtimeForm';
import { DataForm } from '@/components/bills/DataForm';
import { ElectricityForm } from '@/components/bills/ElectricityForm';
import { WaterForm } from '@/components/bills/WaterForm';
import { InternetForm } from '@/components/bills/InternetForm';
import { TVForm } from '@/components/bills/TVForm';
import { GiftCardForm } from '@/components/bills/GiftCardForm';

const PayBills = () => {
  const { t } = useLanguage();
  const [selectedService, setSelectedService] = useState('');

  const services = [
    // Core Services (Active)
    { id: 'airtime', name: 'Airtime & Data', icon: Smartphone, color: 'bg-green-500', description: 'Mobile airtime & data bundles', active: true },
    { id: 'data', name: 'Data Bundles', icon: Wifi, color: 'bg-blue-500', description: 'Mobile data packages', active: true },
    { id: 'electricity', name: t('bills.electricity'), icon: Zap, color: 'bg-yellow-500', description: 'Power utilities', active: true },
    { id: 'water', name: t('bills.water'), icon: Droplets, color: 'bg-blue-400', description: 'Water utilities', active: true },
    { id: 'internet', name: t('bills.internet'), icon: Wifi, color: 'bg-purple-500', description: 'Internet & broadband', active: true },
    { id: 'tv', name: t('bills.tv'), icon: Tv, color: 'bg-indigo-500', description: 'TV subscriptions', active: true },
    { id: 'gift_cards', name: 'Gift Cards', icon: Gift, color: 'bg-pink-500', description: 'Digital gift cards', active: true },
    
    // Transportation
    { id: 'fuel', name: 'Fuel Payment', icon: Fuel, color: 'bg-orange-500', description: 'Petrol stations & fuel cards', active: false },
    { id: 'transport', name: 'Public Transport', icon: Bus, color: 'bg-red-500', description: 'Bus, taxi & metro cards', active: false },
    { id: 'flight', name: 'Flight Booking', icon: Plane, color: 'bg-sky-500', description: 'Airline tickets & bookings', active: false },
    { id: 'train', name: 'Train Tickets', icon: Train, color: 'bg-green-600', description: 'Railway bookings', active: false },
    { id: 'ride_hailing', name: 'Ride Hailing', icon: Car, color: 'bg-black', description: 'Uber, Bolt, taxi services', active: false },
    
    // Financial Services
    { id: 'insurance', name: 'Insurance', icon: Shield, color: 'bg-emerald-500', description: 'Health, auto & life insurance', active: false },
    { id: 'loans', name: 'Loan Payments', icon: CreditCard, color: 'bg-slate-500', description: 'Bank loans & microfinance', active: false },
    { id: 'savings', name: 'Savings Plans', icon: Banknote, color: 'bg-teal-500', description: 'Investment & savings schemes', active: false },
    { id: 'pension', name: 'Pension Fund', icon: Users, color: 'bg-gray-500', description: 'Retirement savings', active: false },
    
    // Education & Healthcare
    { id: 'school', name: 'School Fees', icon: GraduationCap, color: 'bg-blue-600', description: 'Tuition & educational fees', active: false },
    { id: 'healthcare', name: 'Healthcare', icon: Heart, color: 'bg-red-400', description: 'Hospital bills & medical', active: false },
    { id: 'pharmacy', name: 'Pharmacy', icon: Stethoscope, color: 'bg-green-400', description: 'Medication & prescriptions', active: false },
    { id: 'childcare', name: 'Childcare', icon: Baby, color: 'bg-pink-400', description: 'Daycare & nursery fees', active: false },
    
    // Government & Legal
    { id: 'taxes', name: 'Tax Payments', icon: Receipt, color: 'bg-amber-500', description: 'Income tax & VAT', active: false },
    { id: 'government', name: 'Government Services', icon: Building, color: 'bg-indigo-600', description: 'Licenses, permits & fines', active: false },
    { id: 'legal', name: 'Legal Services', icon: Briefcase, color: 'bg-purple-600', description: 'Court fees & legal payments', active: false },
    
    // Home & Property
    { id: 'rent', name: 'Rent Payments', icon: Home, color: 'bg-orange-600', description: 'House rent & property', active: false },
    { id: 'property_tax', name: 'Property Tax', icon: MapPin, color: 'bg-yellow-600', description: 'Land & property taxes', active: false },
    { id: 'waste', name: 'Waste Management', icon: Trash2, color: 'bg-green-700', description: 'Garbage collection fees', active: false },
    { id: 'maintenance', name: 'Home Services', icon: Wrench, color: 'bg-gray-600', description: 'Repairs & maintenance', active: false },
    
    // Entertainment & Media
    { id: 'streaming', name: 'Streaming Services', icon: Tv, color: 'bg-red-600', description: 'Netflix, streaming platforms', active: false },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2, color: 'bg-violet-500', description: 'Game credits & subscriptions', active: false },
    { id: 'music', name: 'Music Streaming', icon: Music, color: 'bg-green-500', description: 'Spotify, music platforms', active: false },
    { id: 'radio', name: 'Radio Services', icon: Radio, color: 'bg-amber-600', description: 'Radio subscriptions', active: false },
    { id: 'news', name: 'News & Magazines', icon: Newspaper, color: 'bg-slate-600', description: 'Digital subscriptions', active: false },
    
    // Communication
    { id: 'postpaid', name: 'Postpaid Bills', icon: Phone, color: 'bg-blue-700', description: 'Monthly phone bills', active: false },
    { id: 'landline', name: 'Landline', icon: Phone, color: 'bg-gray-700', description: 'Fixed line services', active: false },
    
    // Shopping & Retail
    { id: 'ecommerce', name: 'E-commerce', icon: ShoppingCart, color: 'bg-orange-400', description: 'Online shopping payments', active: false },
    { id: 'groceries', name: 'Grocery Bills', icon: ShoppingCart, color: 'bg-green-600', description: 'Supermarket & grocery', active: false },
    
    // Security & Technology
    { id: 'security', name: 'Security Services', icon: Shield, color: 'bg-red-700', description: 'Alarm systems & security', active: false },
    { id: 'cloud', name: 'Cloud Services', icon: Camera, color: 'bg-sky-600', description: 'Cloud storage & tech services', active: false },
  ];

  const handleServiceSelect = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service && !service.active) {
      // Show coming soon message for inactive services
      return;
    }
    setSelectedService(serviceId);
  };

  const handleBack = () => {
    setSelectedService('');
  };

  const activeServices = services.filter(s => s.active);
  const comingSoonServices = services.filter(s => !s.active);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pay Bills</h1>
        <p className="text-muted-foreground">Choose a service and pay your bills instantly</p>
      </div>

      {!selectedService ? (
        <div className="space-y-8">
          {/* Active Services */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Available Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeServices.map((service) => (
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
          </div>

          {/* Coming Soon Services */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Coming Soon</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {comingSoonServices.map((service) => (
                <Card
                  key={service.id}
                  className="opacity-60 cursor-not-allowed"
                >
                  <CardHeader className="text-center py-4">
                    <div className={`w-12 h-12 rounded-full ${service.color} flex items-center justify-center mx-auto mb-2`}>
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-sm">{service.name}</CardTitle>
                    <CardDescription className="text-xs">{service.description}</CardDescription>
                    <div className="text-xs text-muted-foreground font-medium mt-1">Coming Soon</div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {selectedService === 'airtime' && <AirtimeForm onBack={handleBack} />}
          {selectedService === 'data' && <DataForm onBack={handleBack} />}
          {selectedService === 'electricity' && <ElectricityForm onBack={handleBack} />}
          {selectedService === 'water' && <WaterForm onBack={handleBack} />}
          {selectedService === 'internet' && <InternetForm onBack={handleBack} />}
          {selectedService === 'tv' && <TVForm onBack={handleBack} />}
          {selectedService === 'gift_cards' && <GiftCardForm onBack={handleBack} />}
        </div>
      )}
    </div>
  );
};

export default PayBills;
