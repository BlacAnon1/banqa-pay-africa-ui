
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Wallet, ArrowUpDown, Eye, EyeOff } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { africanCountries } from '@/data/africanCountries';
import { toast } from '@/hooks/use-toast';

interface CountryWallet {
  id: string;
  country: string;
  countryCode: string;
  currency: string;
  symbol: string;
  balance: number;
  isDefault: boolean;
  exchangeRate: number;
  flag: string;
}

const currencyMap: { [key: string]: { symbol: string; name: string } } = {
  NGN: { symbol: '₦', name: 'Nigerian Naira' },
  GHS: { symbol: '₵', name: 'Ghanaian Cedi' },
  KES: { symbol: 'KSh', name: 'Kenyan Shilling' },
  ZAR: { symbol: 'R', name: 'South African Rand' },
  EGP: { symbol: 'E£', name: 'Egyptian Pound' },
  MAD: { symbol: 'DH', name: 'Moroccan Dirham' },
  TND: { symbol: 'DT', name: 'Tunisian Dinar' },
  // Add more currencies as needed
};

export const MultiCountryWallet: React.FC = () => {
  const [wallets, setWallets] = useState<CountryWallet[]>([]);
  const [showBalances, setShowBalances] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    // Simulate loading wallets
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockWallets: CountryWallet[] = [
      {
        id: '1',
        country: 'Nigeria',
        countryCode: 'NG',
        currency: 'NGN',
        symbol: '₦',
        balance: 125000,
        isDefault: true,
        exchangeRate: 1,
        flag: '🇳🇬'
      },
      {
        id: '2',
        country: 'Ghana',
        countryCode: 'GH',
        currency: 'GHS',
        symbol: '₵',
        balance: 450,
        isDefault: false,
        exchangeRate: 12.5,
        flag: '🇬🇭'
      },
      {
        id: '3',
        country: 'Kenya',
        countryCode: 'KE',
        currency: 'KES',
        symbol: 'KSh',
        balance: 8500,
        isDefault: false,
        exchangeRate: 0.57,
        flag: '🇰🇪'
      }
    ];
    
    setWallets(mockWallets);
    setLoading(false);
  };

  const addNewWallet = async () => {
    if (!selectedCountry) {
      toast({
        title: "Select Country",
        description: "Please select a country to add a new wallet",
        variant: "destructive"
      });
      return;
    }

    const country = africanCountries.find(c => c.code === selectedCountry);
    if (!country) return;

    // Check if wallet already exists
    if (wallets.some(w => w.countryCode === selectedCountry)) {
      toast({
        title: "Wallet Exists",
        description: `You already have a wallet for ${country.name}`,
        variant: "destructive"
      });
      return;
    }

    // Get currency info (you'd typically get this from an API)
    const currencyCode = getCurrencyForCountry(selectedCountry);
    const currencyInfo = currencyMap[currencyCode] || { symbol: currencyCode, name: currencyCode };

    const newWallet: CountryWallet = {
      id: Date.now().toString(),
      country: country.name,
      countryCode: selectedCountry,
      currency: currencyCode,
      symbol: currencyInfo.symbol,
      balance: 0,
      isDefault: false,
      exchangeRate: Math.random() * 2 + 0.5, // Mock exchange rate
      flag: getCountryFlag(selectedCountry)
    };

    setWallets([...wallets, newWallet]);
    setSelectedCountry('');
    
    toast({
      title: "Wallet Added",
      description: `${country.name} wallet created successfully`
    });
  };

  const getCurrencyForCountry = (countryCode: string): string => {
    const currencyMapping: { [key: string]: string } = {
      'NG': 'NGN', 'GH': 'GHS', 'KE': 'KES', 'ZA': 'ZAR',
      'EG': 'EGP', 'MA': 'MAD', 'TN': 'TND',
      // Add more mappings as needed
    };
    return currencyMapping[countryCode] || 'USD';
  };

  const getCountryFlag = (countryCode: string): string => {
    const flagEmojis: { [key: string]: string } = {
      'NG': '🇳🇬', 'GH': '🇬🇭', 'KE': '🇰🇪', 'ZA': '🇿🇦',
      'EG': '🇪🇬', 'MA': '🇲🇦', 'TN': '🇹🇳',
      // Add more flags as needed
    };
    return flagEmojis[countryCode] || '🏳️';
  };

  const getTotalBalanceInNGN = () => {
    return wallets.reduce((total, wallet) => {
      return total + (wallet.balance * wallet.exchangeRate);
    }, 0);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Multi-Country Wallets</h2>
          <p className="text-muted-foreground">Manage funds across African countries</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowBalances(!showBalances)}
        >
          {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>

      {/* Total Balance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Total Balance (NGN Equivalent)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {showBalances ? `₦${getTotalBalanceInNGN().toLocaleString()}` : '****'}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Across {wallets.length} {wallets.length === 1 ? 'wallet' : 'wallets'}
          </p>
        </CardContent>
      </Card>

      {/* Individual Wallets */}
      <div className="grid gap-4">
        {wallets.map((wallet) => (
          <Card key={wallet.id} className={wallet.isDefault ? 'ring-2 ring-primary' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{wallet.flag}</span>
                  <div>
                    <CardTitle className="text-lg">{wallet.country}</CardTitle>
                    <CardDescription>{wallet.currency}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {wallet.isDefault && <Badge variant="secondary">Default</Badge>}
                  <Button variant="outline" size="sm">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {showBalances 
                      ? `${wallet.symbol}${wallet.balance.toLocaleString()}` 
                      : '****'
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ≈ ₦{showBalances ? (wallet.balance * wallet.exchangeRate).toLocaleString() : '****'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Add Funds</Button>
                  <Button variant="outline" size="sm">Convert</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Wallet */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Country Wallet
          </CardTitle>
          <CardDescription>
            Create wallets for different African countries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {africanCountries
                  .filter(country => !wallets.some(w => w.countryCode === country.code))
                  .map(country => (
                    <SelectItem key={country.code} value={country.code}>
                      <div className="flex items-center gap-2">
                        <span>{getCountryFlag(country.code)}</span>
                        <span>{country.name}</span>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button onClick={addNewWallet} disabled={!selectedCountry}>
              Add Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
