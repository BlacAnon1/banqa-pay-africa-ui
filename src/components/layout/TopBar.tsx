
import { useState } from 'react';
import { Globe, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AfricanLogo } from '@/components/ui/AfricanLogo';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { africanCountries } from '@/data/africanCountries';

// Get flag emoji for country codes
const getCountryFlag = (countryCode: string): string => {
  const flagEmojis: { [key: string]: string } = {
    'DZ': '🇩🇿', 'AO': '🇦🇴', 'BJ': '🇧🇯', 'BW': '🇧🇼', 'BF': '🇧🇫',
    'BI': '🇧🇮', 'CM': '🇨🇲', 'CV': '🇨🇻', 'CF': '🇨🇫', 'TD': '🇹🇩',
    'KM': '🇰🇲', 'CG': '🇨🇬', 'CD': '🇨🇩', 'DJ': '🇩🇯', 'EG': '🇪🇬',
    'GQ': '🇬🇶', 'ER': '🇪🇷', 'SZ': '🇸🇿', 'ET': '🇪🇹', 'GA': '🇬🇦',
    'GM': '🇬🇲', 'GH': '🇬🇭', 'GN': '🇬🇳', 'GW': '🇬🇼', 'CI': '🇨🇮',
    'KE': '🇰🇪', 'LS': '🇱🇸', 'LR': '🇱🇷', 'LY': '🇱🇾', 'MG': '🇲🇬',
    'MW': '🇲🇼', 'ML': '🇲🇱', 'MR': '🇲🇷', 'MU': '🇲🇺', 'MA': '🇲🇦',
    'MZ': '🇲🇿', 'NA': '🇳🇦', 'NE': '🇳🇪', 'NG': '🇳🇬', 'RW': '🇷🇼',
    'ST': '🇸🇹', 'SN': '🇸🇳', 'SC': '🇸🇨', 'SL': '🇸🇱', 'SO': '🇸🇴',
    'ZA': '🇿🇦', 'SS': '🇸🇸', 'SD': '🇸🇩', 'TZ': '🇹🇿', 'TG': '🇹🇬',
    'TN': '🇹🇳', 'UG': '🇺🇬', 'ZM': '🇿🇲', 'ZW': '🇿🇼'
  };
  return flagEmojis[countryCode] || '🏳️';
};

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
  { code: 'yo', name: 'Yorùbá', flag: '🇳🇬' },
];

export function TopBar() {
  // Start with Nigeria as default
  const [selectedCountry, setSelectedCountry] = useState(africanCountries.find(c => c.code === 'NG') || africanCountries[0]);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { profile } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 african-pattern-bg">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="hover:bg-primary/10 hover:text-primary rounded-lg transition-colors" />
          <div className="md:hidden">
            <AfricanLogo size="sm" variant="icon" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Country Selector - Now shows all African countries */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:border-primary rounded-xl">
                <span className="text-lg">{getCountryFlag(selectedCountry.code)}</span>
                <span className="hidden sm:inline font-medium">{selectedCountry.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur border-primary/20 rounded-xl max-h-96 overflow-y-auto">
              {africanCountries.map((country) => (
                <DropdownMenuItem
                  key={country.code}
                  onClick={() => setSelectedCountry(country)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 cursor-pointer"
                >
                  <span className="text-lg">{getCountryFlag(country.code)}</span>
                  <span className="font-medium">{country.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:border-primary rounded-xl">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">
                  {languages.find(lang => lang.code === language)?.flag}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur border-primary/20 rounded-xl">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as any)}
                  className={`flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 cursor-pointer ${
                    language === lang.code ? 'bg-primary/5 text-primary' : ''
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Real-time Notifications */}
          <NotificationCenter />

          {/* Theme Toggle */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleTheme}
            className="border-primary/20 hover:border-primary rounded-xl"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-foreground">
                {profile?.full_name || t('common.user')}
              </p>
              <p className="text-xs text-muted-foreground">{profile?.email}</p>
            </div>
            <div className="w-10 h-10 banqa-gradient rounded-full flex items-center justify-center shadow-lg cultural-card">
              <span className="text-white font-bold text-sm">
                {profile?.full_name?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
