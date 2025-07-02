
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Zap, Droplets, Wifi, Receipt, Trash2, Tv, Smartphone, Gift, 
  Car, Home, Heart, GraduationCap, Shield, Plane, Bus, Train,
  Fuel, Building, Phone, CreditCard, Banknote, Users, Baby,
  Stethoscope, Briefcase, MapPin, ShoppingCart, Wrench, Gamepad2,
  Radio, Newspaper, Camera, Music, Coffee, Pizza, Shirt, Scissors,
  Dumbbell, Book, PaintBucket, Truck, Calculator, Globe,
  Headphones, Clock, FileText, Star, Package, Target
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
    { id: 'airtime', name: 'Airtime & Data', icon: Smartphone, color: 'bg-primary', description: 'Mobile airtime & data bundles', active: true },
    { id: 'data', name: 'Data Bundles', icon: Wifi, color: 'bg-primary', description: 'Mobile data packages', active: true },
    { id: 'electricity', name: t('bills.electricity'), icon: Zap, color: 'bg-accent', description: 'Power utilities', active: true },
    { id: 'water', name: t('bills.water'), icon: Droplets, color: 'bg-primary', description: 'Water utilities', active: true },
    { id: 'internet', name: t('bills.internet'), icon: Wifi, color: 'bg-secondary', description: 'Internet & broadband', active: true },
    { id: 'tv', name: t('bills.tv'), icon: Tv, color: 'bg-primary', description: 'TV subscriptions', active: true },
    { id: 'gift_cards', name: 'Gift Cards', icon: Gift, color: 'bg-accent', description: 'Digital gift cards', active: true },
    
    // Transportation
    { id: 'fuel', name: 'Fuel Payment', icon: Fuel, color: 'bg-secondary', description: 'Petrol stations & fuel cards', active: false },
    { id: 'transport', name: 'Public Transport', icon: Bus, color: 'bg-destructive', description: 'Bus, taxi & metro cards', active: false },
    { id: 'flight', name: 'Flight Booking', icon: Plane, color: 'bg-primary', description: 'Airline tickets & bookings', active: false },
    { id: 'train', name: 'Train Tickets', icon: Train, color: 'bg-primary', description: 'Railway bookings', active: false },
    { id: 'ride_hailing', name: 'Ride Hailing', icon: Car, color: 'bg-muted', description: 'Uber, Bolt, taxi services', active: false },
    { id: 'logistics', name: 'Logistics & Delivery', icon: Truck, color: 'bg-secondary', description: 'Package delivery services', active: false },
    
    // Financial Services
    { id: 'insurance', name: 'Insurance', icon: Shield, color: 'bg-primary', description: 'Health, auto & life insurance', active: false },
    { id: 'loans', name: 'Loan Payments', icon: CreditCard, color: 'bg-muted', description: 'Bank loans & microfinance', active: false },
    { id: 'savings', name: 'Savings Plans', icon: Banknote, color: 'bg-primary', description: 'Investment & savings schemes', active: false },
    { id: 'pension', name: 'Pension Fund', icon: Users, color: 'bg-muted', description: 'Retirement savings', active: false },
    { id: 'accounting', name: 'Accounting Services', icon: Calculator, color: 'bg-primary', description: 'Bookkeeping & tax services', active: false },
    
    // Education & Healthcare
    { id: 'school', name: 'School Fees', icon: GraduationCap, color: 'bg-primary', description: 'Tuition & educational fees', active: false },
    { id: 'healthcare', name: 'Healthcare', icon: Heart, color: 'bg-destructive', description: 'Hospital bills & medical', active: false },
    { id: 'pharmacy', name: 'Pharmacy', icon: Stethoscope, color: 'bg-primary', description: 'Medication & prescriptions', active: false },
    { id: 'childcare', name: 'Childcare', icon: Baby, color: 'bg-accent', description: 'Daycare & nursery fees', active: false },
    { id: 'books', name: 'Books & Learning', icon: Book, color: 'bg-secondary', description: 'Educational materials', active: false },
    
    // Government & Legal
    { id: 'taxes', name: 'Tax Payments', icon: Receipt, color: 'bg-accent', description: 'Income tax & VAT', active: false },
    { id: 'government', name: 'Government Services', icon: Building, color: 'bg-primary', description: 'Licenses, permits & fines', active: false },
    { id: 'legal', name: 'Legal Services', icon: Briefcase, color: 'bg-secondary', description: 'Court fees & legal payments', active: false },
    { id: 'documents', name: 'Document Services', icon: FileText, color: 'bg-muted', description: 'Certification & notary', active: false },
    
    // Home & Property
    { id: 'rent', name: 'Rent Payments', icon: Home, color: 'bg-orange-600', description: 'House rent & property', active: false },
    { id: 'property_tax', name: 'Property Tax', icon: MapPin, color: 'bg-yellow-600', description: 'Land & property taxes', active: false },
    { id: 'waste', name: 'Waste Management', icon: Trash2, color: 'bg-green-700', description: 'Garbage collection fees', active: false },
    { id: 'maintenance', name: 'Home Services', icon: Wrench, color: 'bg-gray-600', description: 'Repairs & maintenance', active: false },
    { id: 'cleaning', name: 'Cleaning Services', icon: Scissors, color: 'bg-blue-300', description: 'House cleaning & laundry', active: false },
    { id: 'painting', name: 'Painting Services', icon: PaintBucket, color: 'bg-yellow-400', description: 'Home painting & decoration', active: false },
    
    // Entertainment & Media
    { id: 'streaming', name: 'Streaming Services', icon: Tv, color: 'bg-red-600', description: 'Netflix, streaming platforms', active: false },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2, color: 'bg-violet-500', description: 'Game credits & subscriptions', active: false },
    { id: 'music', name: 'Music Streaming', icon: Music, color: 'bg-green-500', description: 'Spotify, music platforms', active: false },
    { id: 'radio', name: 'Radio Services', icon: Radio, color: 'bg-amber-600', description: 'Radio subscriptions', active: false },
    { id: 'news', name: 'News & Magazines', icon: Newspaper, color: 'bg-slate-600', description: 'Digital subscriptions', active: false },
    { id: 'events', name: 'Event Tickets', icon: Star, color: 'bg-purple-500', description: 'Concert & event tickets', active: false },
    
    // Communication
    { id: 'postpaid', name: 'Postpaid Bills', icon: Phone, color: 'bg-blue-700', description: 'Monthly phone bills', active: false },
    { id: 'landline', name: 'Landline', icon: Phone, color: 'bg-gray-700', description: 'Fixed line services', active: false },
    { id: 'voip', name: 'VoIP Services', icon: Headphones, color: 'bg-teal-600', description: 'Internet calling services', active: false },
    
    // Shopping & Retail
    { id: 'ecommerce', name: 'E-commerce', icon: ShoppingCart, color: 'bg-orange-400', description: 'Online shopping payments', active: false },
    { id: 'groceries', name: 'Grocery Bills', icon: ShoppingCart, color: 'bg-green-600', description: 'Supermarket & grocery', active: false },
    { id: 'fashion', name: 'Fashion & Clothing', icon: Shirt, color: 'bg-pink-600', description: 'Clothing & accessories', active: false },
    { id: 'marketplace', name: 'Marketplace Fees', icon: Package, color: 'bg-yellow-500', description: 'Seller fees & commissions', active: false },
    
    // Food & Dining
    { id: 'restaurants', name: 'Restaurant Bills', icon: Pizza, color: 'bg-red-500', description: 'Dining & food delivery', active: false },
    { id: 'coffee', name: 'Coffee Shops', icon: Coffee, color: 'bg-amber-800', description: 'Café subscriptions & bills', active: false },
    
    // Health & Fitness
    { id: 'gym', name: 'Gym Membership', icon: Dumbbell, color: 'bg-red-700', description: 'Fitness & gym fees', active: false },
    
    // Security & Technology
    { id: 'security', name: 'Security Services', icon: Shield, color: 'bg-red-700', description: 'Alarm systems & security', active: false },
    { id: 'cloud', name: 'Cloud Services', icon: Camera, color: 'bg-sky-600', description: 'Cloud storage & tech services', active: false },
    { id: 'domains', name: 'Domain & Hosting', icon: Globe, color: 'bg-blue-800', description: 'Web hosting & domains', active: false },
    
    // Professional Services
    { id: 'consulting', name: 'Consulting', icon: Target, color: 'bg-indigo-700', description: 'Business consulting fees', active: false },
    { id: 'freelance', name: 'Freelance Services', icon: Clock, color: 'bg-purple-400', description: 'Freelancer payments', active: false },
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
        <p className="text-muted-foreground">Choose from 50+ services and pay your bills instantly</p>
      </div>

      {!selectedService ? (
        <div className="space-y-8">
          {/* Active Services */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Available Services ({activeServices.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {activeServices.map((service) => (
                <Card
                  key={service.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 hover:border-primary/20"
                  onClick={() => handleServiceSelect(service.id)}
                >
                  <CardHeader className="text-center pb-2">
                    <div className={`w-12 h-12 rounded-full ${service.color} flex items-center justify-center mx-auto mb-2`}>
                      <service.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-base font-semibold">{service.name}</CardTitle>
                    <CardDescription className="text-xs">{service.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Coming Soon Services */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Coming Soon ({comingSoonServices.length} more services)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {comingSoonServices.map((service) => (
                <Card
                  key={service.id}
                  className="opacity-60 cursor-not-allowed hover:opacity-70 transition-opacity"
                >
                  <CardHeader className="text-center py-3">
                    <div className={`w-8 h-8 rounded-full ${service.color} flex items-center justify-center mx-auto mb-1`}>
                      <service.icon className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xs font-medium">{service.name}</CardTitle>
                    <div className="text-xs text-muted-foreground font-medium">Soon</div>
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
