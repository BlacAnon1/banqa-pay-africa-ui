
import { translations } from '@/data/translations';

export const useTranslation = (language: string) => {
  const t = (key: string, vars: { [key: string]: string | number } = {}) => {
    console.log('useTranslation: Translating key:', key, 'for language:', language);
    
    const keys = key.split('.');
    let translation: any = translations[language as keyof typeof translations];

    for (const k of keys) {
      translation = translation?.[k];
    }

    if (!translation) {
      console.log('useTranslation: Translation not found, falling back to English');
      let fallback: any = translations['en'];
      for (const k of keys) {
        fallback = fallback?.[k];
      }
      translation = fallback || key;
    }

    if (typeof translation === 'string') {
      Object.entries(vars).forEach(([key, value]) => {
        translation = translation!.replace(`{${key}}`, String(value));
      });
    }

    console.log('useTranslation: Final translation result:', translation);
    return translation || key;
  };

  return { t };
};
