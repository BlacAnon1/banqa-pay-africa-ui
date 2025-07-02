
import { translations } from '@/data/translations';

export const useTranslation = (language: string) => {
  const t = (key: string, vars: { [key: string]: string | number } = {}) => {
    console.log('useTranslation: Translating key:', key, 'for language:', language);
    
    const keys = key.split('.');
    let translation: any = translations[language as keyof typeof translations];

    for (const k of keys) {
      translation = translation?.[k];
    }

    // If translation not found, try English fallback
    if (!translation) {
      console.log('useTranslation: Translation not found, falling back to English');
      let fallback: any = translations['en'];
      for (const k of keys) {
        fallback = fallback?.[k];
      }
      translation = fallback;
    }

    // If still no translation found, return a clean fallback
    if (!translation) {
      console.log('useTranslation: No translation found, using fallback');
      // Extract the last part of the key and make it user-friendly
      const lastKey = keys[keys.length - 1];
      translation = lastKey.charAt(0).toUpperCase() + lastKey.slice(1).replace(/([A-Z])/g, ' $1');
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
