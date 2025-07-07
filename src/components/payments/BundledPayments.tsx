
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Package, Zap, Droplets, Wifi, Tv, Gift, Calendar, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BundleService {
  type: string;
  name: string;
  icon: React.ReactNode;
  regularPrice: number;
  bundlePrice: number;
  provider: string;
  included: boolean;
}

interface Bundle {
  id: string;
  name: string;
  description: string;
  totalRegularPrice: number;
  bundlePrice: number;
  savings: number;
  savingsPercentage: number;
  services: BundleService[];
  popular?: boolean;
}

const availableBundles: Bundle[] = [
  {
    id: 'essential',
    name: 'Essential Bundle',
    description: 'Basic utilities for every home',
    totalRegularPrice: 45000,
    bundlePrice: 40500,
    savings: 4500,
    savingsPercentage: 10,
    services: [
      {
        type: 'electricity',
        name: 'Electricity',
        icon: <Zap className="h-4 w-4" />,
        regularPrice: 25000,
        bundlePrice: 22500,
        provider: 'AEDC',
        included: true
      },
      {
        type: 'water',
        name: 'Water',
        icon: <Droplets className="h-4 w-4" />,
        regularPrice: 12000,
        bundlePrice: 10800,
        provider: 'Lagos Water',
        included: true
      },
      {
        type: 'internet',
        name: 'Internet',
        icon: <Wifi className="h-4 w-4" />,
        regularPrice: 8000,
        bundlePrice: 7200,
        provider: 'Spectranet',
        included: true
      }
    ]
  },
  {
    id: 'premium',
    name: 'Premium Bundle',
    description: 'Complete home utilities package',
    totalRegularPrice: 65000,
    bundlePrice: 55250,
    savings: 9750,
    savingsPercentage: 15,
    popular: true,
    services: [
      {
        type: 'electricity',
        name: 'Electricity',
        icon: <Zap className="h-4 w-4" />,
        regularPrice: 35000,
        bundlePrice: 29750,
        provider: 'AEDC',
        included: true
      },
      {
        type: 'water',
        name: 'Water',
        icon: <Droplets className="h-4 w-4" />,
        regularPrice: 15000,
        bundlePrice: 12750,
        provider: 'Lagos Water',
        included: true
      },
      {
        type: 'internet',
        name: 'Internet',
        icon: <Wifi className="h-4 w-4" />,
        regularPrice: 10000,
        bundlePrice: 8500,
        provider: 'MTN',
        included: true
      },
      {
        type: 'tv',
        name: 'Cable TV',
        icon: <Tv className="h-4 w-4" />,
        regularPrice: 5000,
        bundlePrice: 4250,
        provider: 'DStv',
        included: true
      }
    ]
  }
];

export const BundledPayments: React.FC = () => {
  const [selectedBundle, setSelectedBundle] = useState<string>('');
  const [customBundle, setCustomBundle] = useState<BundleService[]>([]);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [autoRenewal, setAutoRenewal] = useState(false);

  const calculateCustomBundleSavings = () => {
    const totalRegular = customBundle.reduce((sum, service) => sum + service.regularPrice, 0);
    const bundlePrice = totalRegular * 0.12; // 12% discount for custom bundles
    return { totalRegular, bundlePrice, savings: totalRegular - bundlePrice };
  };

  const toggleServiceInCustomBundle = (service: BundleService) => {
    const exists = customBundle.find(s => s.type === service.type);
    if (exists) {
      setCustomBundle(customBundle.filter(s => s.type !== service.type));
    } else {
      setCustomBundle([...customBundle, { ...service, included: true }]);
    }
  };

  const purchaseBundle = (bundleId: string) => {
    const bundle = availableBundles.find(b => b.id === bundleId);
    if (!bundle) return;

    toast({
      title: "Bundle Purchased",
      description: `${bundle.name} activated! You saved ₦${bundle.savings.toLocaleString()}`,
    });
  };

  const customSavings = calculateCustomBundleSavings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Bundle Payments</h2>
        <p className="text-muted-foreground">Save money by bundling your utility payments</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {availableBundles.map((bundle) => (
          <Card key={bundle.id} className={`relative ${bundle.popular ? 'ring-2 ring-primary' : ''}`}>
            {bundle.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    {bundle.name}
                  </CardTitle>
                  <CardDescription>{bundle.description}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">₦{bundle.bundlePrice.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground line-through">
                    ₦{bundle.totalRegularPrice.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Your Savings</span>
                </div>
                <div className="text-green-800 font-bold">
                  ₦{bundle.savings.toLocaleString()} ({bundle.savingsPercentage}%)
                </div>
              </div>

              <div className="space-y-2">
                {bundle.services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-3">
                      {service.icon}
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-muted-foreground">{service.provider}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₦{service.bundlePrice.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground line-through">
                        ₦{service.regularPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => purchaseBundle(bundle.id)}
                className="w-full"
                variant={bundle.popular ? 'default' : 'outline'}
              >
                Purchase Bundle
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Custom Bundle</CardTitle>
              <CardDescription>Create your own bundle with selected services</CardDescription>
            </div>
            <Switch
              checked={isCustomizing}
              onCheckedChange={setIsCustomizing}
            />
          </div>
        </CardHeader>
        {isCustomizing && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {availableBundles[0].services.concat(availableBundles[1].services.filter(s => s.type === 'tv')).map((service, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    customBundle.find(s => s.type === service.type) 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => toggleServiceInCustomBundle(service)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {service.icon}
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-muted-foreground">{service.provider}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₦{service.regularPrice.toLocaleString()}</div>
                      {customBundle.find(s => s.type === service.type) && (
                        <CheckCircle className="h-4 w-4 text-primary mt-1" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {customBundle.length > 0 && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Regular Total:</span>
                    <span>₦{customSavings.totalRegular.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Bundle Price:</span>
                    <span className="text-lg font-bold">₦{customSavings.bundlePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-green-600">
                    <span className="font-medium">Your Savings:</span>
                    <span className="font-bold">₦{customSavings.savings.toLocaleString()} (12%)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={autoRenewal}
                      onCheckedChange={setAutoRenewal}
                    />
                    <span className="text-sm">Auto-renewal</span>
                  </div>
                  <Button onClick={() => toast({ title: "Custom Bundle Created", description: "Your custom bundle has been activated" })}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Activate Custom Bundle
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};
