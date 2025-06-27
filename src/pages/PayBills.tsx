
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, Droplets, Wifi, Receipt, Trash2, Tv, Smartphone, Plane } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';

const PayBills = () => {
  const { t } = useLanguage();
  const [selectedService, setSelectedService] = useState('');
  const [formData, setFormData] = useState({
    provider: '',
    accountNumber: '',
    amount: '',
    customerName: '',
  });

  const services = [
    { id: 'electricity', name: t('bills.electricity'), icon: Zap, color: 'bg-yellow-500', description: 'Power utilities' },
    { id: 'water', name: t('bills.water'), icon: Droplets, color: 'bg-blue-500', description: 'Water utilities' },
    { id: 'internet', name: t('bills.internet'), icon: Wifi, color: 'bg-purple-500', description: 'Internet & broadband' },
    { id: 'taxes', name: t('bills.taxes'), icon: Receipt, color: 'bg-red-500', description: 'Government taxes' },
    { id: 'waste', name: t('bills.waste'), icon: Trash2, color: 'bg-gray-500', description: 'Waste management' },
    { id: 'tv', name: t('bills.tv'), icon: Tv, color: 'bg-indigo-500', description: 'TV subscriptions' },
    { id: 'airtime', name: t('bills.airtime'), icon: Smartphone, color: 'bg-green-500', description: 'Mobile airtime & data' },
    { id: 'flight', name: t('bills.flight'), icon: Plane, color: 'bg-orange-500', description: 'Flight bookings' },
  ];

  const providers = {
    electricity: ['NEPA/PHCN', 'Ikeja Electric', 'Eko Electricity', 'Abuja Electricity'],
    water: ['Lagos Water Corporation', 'FCT Water Board', 'Kano Water Board'],
    internet: ['MTN', 'Airtel', 'Glo', '9mobile', 'Spectranet', 'Swift'],
    tv: ['DSTV', 'GOTV', 'StarTimes', 'Strong Decoder'],
    airtime: ['MTN', 'Airtel', 'Glo', '9mobile'],
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setFormData({ provider: '', accountNumber: '', amount: '', customerName: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Payment submitted:', { service: selectedService, ...formData });
    // Payment processing logic will be implemented here
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pay Bills</h1>
        <p className="text-muted-foreground">Choose a service and pay your bills instantly</p>
      </div>

      {!selectedService ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedService('')}
                >
                  ← Back
                </Button>
                <div>
                  <CardTitle className="flex items-center gap-3">
                    {(() => {
                      const service = services.find(s => s.id === selectedService);
                      return (
                        <>
                          <div className={`w-10 h-10 rounded-full ${service?.color} flex items-center justify-center`}>
                            {service && <service.icon className="h-5 w-5 text-white" />}
                          </div>
                          Pay {service?.name}
                        </>
                      );
                    })()}
                  </CardTitle>
                  <CardDescription>Enter your payment details below</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {providers[selectedService as keyof typeof providers] && (
                  <div className="space-y-2">
                    <Label htmlFor="provider">Service Provider</Label>
                    <Select value={formData.provider} onValueChange={(value) => setFormData(prev => ({ ...prev, provider: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {providers[selectedService as keyof typeof providers]?.map((provider) => (
                          <SelectItem key={provider} value={provider}>
                            {provider}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">
                    {selectedService === 'electricity' ? 'Meter Number' :
                     selectedService === 'airtime' ? 'Phone Number' :
                     selectedService === 'tv' ? 'Decoder Number' :
                     'Account Number'}
                  </Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                    placeholder={selectedService === 'airtime' ? '+234 123 456 7890' : 'Enter number'}
                    required
                  />
                </div>

                {selectedService !== 'flight' && (
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (₦)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name (Optional)</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="Enter customer name"
                  />
                </div>

                {formData.accountNumber && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Payment Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Service:</span>
                        <Badge variant="outline">{services.find(s => s.id === selectedService)?.name}</Badge>
                      </div>
                      {formData.provider && (
                        <div className="flex justify-between">
                          <span>Provider:</span>
                          <span>{formData.provider}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Account:</span>
                        <span>{formData.accountNumber}</span>
                      </div>
                      {formData.amount && (
                        <div className="flex justify-between font-medium">
                          <span>Amount:</span>
                          <span>₦{formData.amount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={!formData.accountNumber || (!formData.amount && selectedService !== 'flight')}
                >
                  Continue to Payment
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PayBills;
