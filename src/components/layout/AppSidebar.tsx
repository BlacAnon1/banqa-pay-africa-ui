
import { NavLink, useLocation } from 'react-router-dom';
import { Home, CreditCard, History, Wallet, HeadphonesIcon, LogOut } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { BanqaLogo } from '@/components/ui/BanqaLogo';
import { AfricanLogo } from '@/components/ui/AfricanLogo';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const navigationItems = [
  { title: 'nav.dashboard', url: '/dashboard', icon: Home },
  { title: 'nav.payBills', url: '/pay-bills', icon: CreditCard },
  { title: 'nav.history', url: '/history', icon: History },
  { title: 'nav.wallet', url: '/wallet', icon: Wallet },
  { title: 'nav.support', url: '/support', icon: HeadphonesIcon },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { t } = useLanguage();
  const { signOut } = useAuth();
  
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-64'} collapsible="offcanvas">
      <SidebarHeader className="p-4">
        <AfricanLogo 
          size={collapsed ? 'sm' : 'md'} 
          variant={collapsed ? 'icon' : 'full'} 
        />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-semibold">
            {!collapsed && t('nav.mainMenu')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-primary/10 text-primary border-l-4 border-primary shadow-sm font-semibold'
                            : 'hover:bg-muted hover:text-primary'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span className="font-medium">{t(item.title)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button
          variant="ghost"
          onClick={signOut}
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="font-medium">{t('nav.logout')}</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
