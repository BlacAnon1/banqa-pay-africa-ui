
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { AfricanLogo } from '@/components/ui/AfricanLogo';

export const WelcomeSection = () => {
  const { t } = useLanguage();
  const { profile } = useAuth();

  return (
    <div className="cultural-card bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-2xl border border-primary/10">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold text-foreground">
            {t('dashboard.welcome')}, {profile?.full_name?.split(' ')[0] || t('common.friend')}!
          </h1>
          <AfricanLogo size="md" variant="icon" />
        </div>
        <p className="text-lg text-muted-foreground font-medium">
          {t('dashboard.subtitle')}
        </p>
      </div>
    </div>
  );
};
