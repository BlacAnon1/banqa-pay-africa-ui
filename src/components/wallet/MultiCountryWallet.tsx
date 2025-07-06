
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Wallet, ArrowUpDown, Eye, EyeOff } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { africanCountries } from '@/data/africanCountries';
import { useMultiCountryWallets } from '@/hooks/useMultiCountryWallets';

const currencyMap: { [key: string]: { symbol: string; name: string } } = {
  NGN: { symbol: '₦', name: 'Nigerian Naira' },
  GHS: { symbol: '₵', name: 'Ghanaian Cedi' },
  KES: { symbol: 'KSh', name: 'Kenyan Shilling' },
  ZAR: { symbol: 'R', name: 'South African Rand' },
  EGP: { symbol: 'E£', name: 'Egyptian Pound' },
  MAD: { symbol: 'DH', name: 'Moroccan Dirham' },
  TND: { symbol: 'DT', name: 'Tunisian Dinar' },
  DZD: { symbol: 'DA', name: 'Algerian Dinar' },
  ETB: { symbol: 'Br', name: 'Ethiopian Birr' },
  UGX: { symbol: 'USh', name: 'Ugandan Shilling' },
  TZS: { symbol: 'TSh', name: 'Tanzanian Shilling' },
  RWF: { symbol: 'FRw', name: 'Rwandan Franc' }
};

export const MultiCountryWallet: React.FC = () => {
  const { wallets, loading, addWallet } = useMultiCountryWallets();
  const [showBalances, setShowBalances] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('');

  const getCurrencyForCountry = (countryCode: string): string => {
    const currencyMapping: { [key: string]: string } = {
      'NG': 'NGN', 'GH': 'GHS', 'KE': 'KES', 'ZA': 'ZAR',
      'EG': 'EGP', 'MA': 'MAD', 'TN': 'TND', 'DZ': 'DZD',
      'ET': 'ETB', 'UG': 'UGX', 'TZ': 'TZS', 'RW': 'RWF'
    };
    return currencyMapping[countryCode] || 'USD';
  };

  const getCountryFlag = (countryCode: string): string => {
    const flagEmojis: { [key: string]: string } = {
      'NG': '🇳🇬', 'GH': '🇬🇭', 'KE': '🇰🇪', 'ZA': '🇿🇦',
      'EG': '🇪🇬', 'MA': '🇲🇦', 'TN': '🇹🇳', 'DZ': '🇩🇿',
      'ET': '🇪🇹', 'UG': '🇺🇬', 'TZ': '🇹🇿', 'RW': '🇷🇼'
    };
    return flagEmojis[countryCode] || '🏳️';
  };

  const getTotalBalanceInNGN = () => {
    return wallets.reduce((total, wallet) => {
      return total + (wallet.balance * wallet.exchangeRate);
    }, 0);
  };

  const handleAddWallet = async () => {
    if (!selectedCountry) return;

    const country = africanCountries.find(c => c.code === selectedCountry);
    if (!country) return;

    const currencyCode = getCurrencyForCountry(selectedCountry);
    const currencyInfo = currencyMap[currencyCode] || { symbol: currencyCode, name: currencyCode };

    await addWallet(selectedCountry, country.name, currencyCode, currencyInfo.symbol);
    setSelectedCountry('');
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

      {wallets.length > 0 && (
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
      )}

      {wallets.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No wallets yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first multi-country wallet to get started.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
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
      )}

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
            <Button onClick={handleAddWallet} disabled={!selectedCountry}>
              Add Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
