
import { useState } from 'react';
import { Bell, Globe, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const countries = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'ha', name: 'Hausa' },
];

export function TopBar() {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { profile } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
        </div>

        <div className="flex items-center gap-4">
          {/* Country Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <span className="text-lg">{selectedCountry.flag}</span>
                <span className="hidden sm:inline">{selectedCountry.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {countries.map((country) => (
                <DropdownMenuItem
                  key={country.code}
                  onClick={() => setSelectedCountry(country)}
                  className="flex items-center gap-2"
                >
                  <span className="text-lg">{country.flag}</span>
                  <span>{country.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as any)}
                  className={language === lang.code ? 'bg-muted' : ''}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="outline" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-2 -right-2 px-1 py-0 text-xs h-5 w-5 rounded-full bg-emerald-500">
              3
            </Badge>
          </Button>

          {/* Theme Toggle */}
          <Button variant="outline" size="sm" onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-muted-foreground">{profile?.email}</p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {profile?.full_name?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
