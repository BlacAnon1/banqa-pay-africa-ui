
import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageContextType, LanguageProviderProps } from '@/types/language';
import { useTranslation } from '@/hooks/useTranslation';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const { t } = useTranslation(language);

  console.log('LanguageProvider rendering with language:', language, 'translation function:', typeof t);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const contextValue = { 
    language, 
    setLanguage, 
    t: (key: string, vars?: { [key: string]: string | number }) => {
      console.log('Translation called for key:', key, 'result:', t(key, vars));
      return t(key, vars);
    }
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    console.error('useLanguage must be used within LanguageProvider');
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
