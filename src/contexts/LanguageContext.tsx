
import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'fr' | 'sw' | 'ha';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.payBills': 'Pay Bills',
    'nav.history': 'History',
    'nav.wallet': 'Wallet',
    'nav.support': 'Support',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.fullName': 'Full Name',
    'auth.phoneNumber': 'Phone Number',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.loading': 'Loading...',
    'dashboard.welcome': 'Welcome back',
    'dashboard.balance': 'Wallet Balance',
    'bills.electricity': 'Electricity',
    'bills.water': 'Water',
    'bills.internet': 'Internet',
    'bills.taxes': 'Taxes',
    'bills.waste': 'Waste Management',
    'bills.tv': 'TV Subscription',
    'bills.airtime': 'Airtime/Data',
    'bills.flight': 'Flight Booking',
  },
  fr: {
    'nav.dashboard': 'Tableau de bord',
    'nav.payBills': 'Payer les factures',
    'nav.history': 'Historique',
    'nav.wallet': 'Portefeuille',
    'nav.support': 'Support',
    'auth.login': 'Connexion',
    'auth.register': 'S\'inscrire',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.confirmPassword': 'Confirmer le mot de passe',
    'auth.fullName': 'Nom complet',
    'auth.phoneNumber': 'Numéro de téléphone',
    'common.submit': 'Soumettre',
    'common.cancel': 'Annuler',
    'common.loading': 'Chargement...',
    'dashboard.welcome': 'Bon retour',
    'dashboard.balance': 'Solde du portefeuille',
    'bills.electricity': 'Électricité',
    'bills.water': 'Eau',
    'bills.internet': 'Internet',
    'bills.taxes': 'Taxes',
    'bills.waste': 'Gestion des déchets',
    'bills.tv': 'Abonnement TV',
    'bills.airtime': 'Temps d\'antenne/Données',
    'bills.flight': 'Réservation de vol',
  },
  sw: {
    'nav.dashboard': 'Dashibodi',
    'nav.payBills': 'Lipa Bili',
    'nav.history': 'Historia',
    'nav.wallet': 'Mkoba',
    'nav.support': 'Msaada',
    'auth.login': 'Ingia',
    'auth.register': 'Jisajili',
    'auth.email': 'Barua pepe',
    'auth.password': 'Nenosiri',
    'auth.confirmPassword': 'Thibitisha nenosiri',
    'auth.fullName': 'Jina kamili',
    'auth.phoneNumber': 'Nambari ya simu',
    'common.submit': 'Wasilisha',
    'common.cancel': 'Ghairi',
    'common.loading': 'Inapakia...',
    'dashboard.welcome': 'Karibu tena',
    'dashboard.balance': 'Salio la mkoba',
    'bills.electricity': 'Umeme',
    'bills.water': 'Maji',
    'bills.internet': 'Mtandao',
    'bills.taxes': 'Kodi',
    'bills.waste': 'Usimamizi wa taka',
    'bills.tv': 'Ujazo wa TV',
    'bills.airtime': 'Muda wa anga/Data',
    'bills.flight': 'Uhifadhi wa ndege',
  },
  ha: {
    'nav.dashboard': 'Dashboard',
    'nav.payBills': 'Biyan Kudade',
    'nav.history': 'Tarihi',
    'nav.wallet': 'Walat',
    'nav.support': 'Tallafi',
    'auth.login': 'Shiga',
    'auth.register': 'Yi rajista',
    'auth.email': 'Imel',
    'auth.password': 'Kalmar sirri',
    'auth.confirmPassword': 'Tabbatar da kalmar sirri',
    'auth.fullName': 'Cikakken suna',
    'auth.phoneNumber': 'Lambar waya',
    'common.submit': 'Aikawa',
    'common.cancel': 'Soke',
    'common.loading': 'Ana lodawa...',
    'dashboard.welcome': 'Barka da dawowa',
    'dashboard.balance': 'Ma\'auni na walat',
    'bills.electricity': 'Wutar lantarki',
    'bills.water': 'Ruwa',
    'bills.internet': 'Intanet',
    'bills.taxes': 'Haraji',
    'bills.waste': 'Sarrafa datti',
    'bills.tv': 'Biyan TV',
    'bills.airtime': 'Lokacin iska/Data',
    'bills.flight': 'Ajiyar jirgin sama',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
