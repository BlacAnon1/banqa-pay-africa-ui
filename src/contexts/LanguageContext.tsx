
import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'fr' | 'sw' | 'ha';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.payBills': 'Pay Bills',
    'nav.history': 'Transaction History',
    'nav.wallet': 'My Wallet',
    'nav.support': 'Customer Support',
    
    // Authentication
    'auth.login': 'Sign In',
    'auth.register': 'Create Account',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.fullName': 'Full Name',
    'auth.phoneNumber': 'Phone Number',
    'auth.welcome': 'Welcome to Banqa',
    'auth.subtitle': 'Pay Africa with Confidence',
    'auth.loginSubtitle': 'Access your digital wallet',
    'auth.registerSubtitle': 'Join thousands of satisfied customers',
    
    // Common
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.confirm': 'Confirm',
    'common.close': 'Close',
    
    // Dashboard
    'dashboard.welcome': 'Karibu',
    'dashboard.subtitle': 'Your financial journey across Africa',
    'dashboard.balance': 'Wallet Balance',
    'dashboard.totalSpent': 'Total Spent',
    'dashboard.billsPaid': 'Bills Paid',
    'dashboard.upcomingBills': 'Upcoming Bills',
    'dashboard.quickPay': 'Quick Pay',
    'dashboard.quickPaySubtitle': 'Pay your most used services',
    'dashboard.recentTransactions': 'Recent Transactions',
    'dashboard.recentTransactionsSubtitle': 'Your latest payments',
    'dashboard.thisMonth': 'This month',
    'dashboard.dueSoon': 'Due soon',
    
    // Bills & Services
    'bills.electricity': 'Electricity',
    'bills.water': 'Water Bills',
    'bills.internet': 'Internet & WiFi',
    'bills.taxes': 'Government Taxes',
    'bills.waste': 'Waste Management',
    'bills.tv': 'TV Subscription',
    'bills.airtime': 'Airtime & Data',
    'bills.flight': 'Flight Booking',
    'bills.insurance': 'Insurance',
    'bills.school': 'School Fees',
    
    // Transaction Status
    'status.completed': 'Completed',
    'status.pending': 'Pending',
    'status.failed': 'Failed',
    'status.due': 'Due',
    'status.upcoming': 'Upcoming',
    
    // Countries
    'countries.nigeria': 'Nigeria',
    'countries.kenya': 'Kenya',
    'countries.ghana': 'Ghana',
    'countries.southafrica': 'South Africa',
    'countries.egypt': 'Egypt',
    
    // Company
    'company.name': 'Banqa',
    'company.tagline': 'Pay Africa',
    'company.description': 'Your trusted partner for digital payments across Africa',
  },
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de bord',
    'nav.payBills': 'Payer les factures',
    'nav.history': 'Historique des transactions',
    'nav.wallet': 'Mon portefeuille',
    'nav.support': 'Support client',
    
    // Authentication
    'auth.login': 'Se connecter',
    'auth.register': 'Créer un compte',
    'auth.email': 'Adresse e-mail',
    'auth.password': 'Mot de passe',
    'auth.confirmPassword': 'Confirmer le mot de passe',
    'auth.fullName': 'Nom complet',
    'auth.phoneNumber': 'Numéro de téléphone',
    'auth.welcome': 'Bienvenue chez Banqa',
    'auth.subtitle': 'Payez l\'Afrique en toute confiance',
    'auth.loginSubtitle': 'Accédez à votre portefeuille numérique',
    'auth.registerSubtitle': 'Rejoignez des milliers de clients satisfaits',
    
    // Common
    'common.submit': 'Soumettre',
    'common.cancel': 'Annuler',
    'common.loading': 'Chargement...',
    'common.save': 'Enregistrer',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.confirm': 'Confirmer',
    'common.close': 'Fermer',
    
    // Dashboard
    'dashboard.welcome': 'Karibu',
    'dashboard.subtitle': 'Votre parcours financier à travers l\'Afrique',
    'dashboard.balance': 'Solde du portefeuille',
    'dashboard.totalSpent': 'Total dépensé',
    'dashboard.billsPaid': 'Factures payées',
    'dashboard.upcomingBills': 'Factures à venir',
    'dashboard.quickPay': 'Paiement rapide',
    'dashboard.quickPaySubtitle': 'Payez vos services les plus utilisés',
    'dashboard.recentTransactions': 'Transactions récentes',
    'dashboard.recentTransactionsSubtitle': 'Vos derniers paiements',
    'dashboard.thisMonth': 'Ce mois-ci',
    'dashboard.dueSoon': 'Bientôt dû',
    
    // Bills & Services
    'bills.electricity': 'Électricité',
    'bills.water': 'Factures d\'eau',
    'bills.internet': 'Internet et WiFi',
    'bills.taxes': 'Taxes gouvernementales',
    'bills.waste': 'Gestion des déchets',
    'bills.tv': 'Abonnement TV',
    'bills.airtime': 'Crédit et données',
    'bills.flight': 'Réservation de vol',
    'bills.insurance': 'Assurance',
    'bills.school': 'Frais de scolarité',
    
    // Transaction Status
    'status.completed': 'Terminé',
    'status.pending': 'En attente',
    'status.failed': 'Échoué',
    'status.due': 'Dû',
    'status.upcoming': 'À venir',
    
    // Countries
    'countries.nigeria': 'Nigeria',
    'countries.kenya': 'Kenya',
    'countries.ghana': 'Ghana',
    'countries.southafrica': 'Afrique du Sud',
    'countries.egypt': 'Égypte',
    
    // Company
    'company.name': 'Banqa',
    'company.tagline': 'Payez l\'Afrique',
    'company.description': 'Votre partenaire de confiance pour les paiements numériques en Afrique',
  },
  sw: {
    // Navigation
    'nav.dashboard': 'Dashibodi',
    'nav.payBills': 'Lipa Bili',
    'nav.history': 'Historia ya Miamala',
    'nav.wallet': 'Mkoba Wangu',
    'nav.support': 'Huduma kwa Wateja',
    
    // Authentication
    'auth.login': 'Ingia',
    'auth.register': 'Fungua Akaunti',
    'auth.email': 'Barua pepe',
    'auth.password': 'Nenosiri',
    'auth.confirmPassword': 'Thibitisha nenosiri',
    'auth.fullName': 'Jina kamili',
    'auth.phoneNumber': 'Nambari ya simu',
    'auth.welcome': 'Karibu Banqa',
    'auth.subtitle': 'Lipa Afrika kwa Ujasiri',
    'auth.loginSubtitle': 'Ingia kwenye mkoba wako wa kidijitali',
    'auth.registerSubtitle': 'Jiunge na maelfu ya wateja wenye furaha',
    
    // Common
    'common.submit': 'Wasilisha',
    'common.cancel': 'Ghairi',
    'common.loading': 'Inapakia...',
    'common.save': 'Hifadhi',
    'common.edit': 'Hariri',
    'common.delete': 'Futa',
    'common.confirm': 'Thibitisha',
    'common.close': 'Funga',
    
    // Dashboard
    'dashboard.welcome': 'Karibu',
    'dashboard.subtitle': 'Safari yako ya kifedha kupitia Afrika',
    'dashboard.balance': 'Salio la Mkoba',
    'dashboard.totalSpent': 'Jumla Iliyotumika',
    'dashboard.billsPaid': 'Bili Zilizolipiwa',
    'dashboard.upcomingBills': 'Bili Zijazo',
    'dashboard.quickPay': 'Malipo ya Haraka',
    'dashboard.quickPaySubtitle': 'Lipa huduma zako za mara kwa mara',
    'dashboard.recentTransactions': 'Miamala ya Hivi Karibuni',
    'dashboard.recentTransactionsSubtitle': 'Malipo yako ya mwisho',
    'dashboard.thisMonth': 'Mwezi huu',
    'dashboard.dueSoon': 'Itadaiwa hivi karibuni',
    
    // Bills & Services
    'bills.electricity': 'Umeme',
    'bills.water': 'Bili za Maji',
    'bills.internet': 'Mtandao na WiFi',
    'bills.taxes': 'Kodi za Serikali',
    'bills.waste': 'Usimamizi wa Taka',
    'bills.tv': 'Ujazo wa TV',
    'bills.airtime': 'Muda wa anga na Data',
    'bills.flight': 'Uhifadhi wa Ndege',
    'bills.insurance': 'Bima',
    'bills.school': 'Ada za Shule',
    
    // Transaction Status
    'status.completed': 'Imekamilika',
    'status.pending': 'Inasubiri',
    'status.failed': 'Imeshindwa',
    'status.due': 'Inadaiwa',
    'status.upcoming': 'Ijayo',
    
    // Countries
    'countries.nigeria': 'Nigeria',
    'countries.kenya': 'Kenya',
    'countries.ghana': 'Ghana',
    'countries.southafrica': 'Afrika Kusini',
    'countries.egypt': 'Misri',
    
    // Company
    'company.name': 'Banqa',
    'company.tagline': 'Lipa Afrika',
    'company.description': 'Mshirika wako wa kuaminika kwa malipo ya kidijitali Afrika nzima',
  },
  ha: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.payBills': 'Biyan Kudade',
    'nav.history': 'Tarihin Ma\'amala',
    'nav.wallet': 'Jakata',
    'nav.support': 'Tallafin Abokai',
    
    // Authentication
    'auth.login': 'Shiga',
    'auth.register': 'Bude Asusun',
    'auth.email': 'Adireshin Imel',
    'auth.password': 'Kalmar Sirri',
    'auth.confirmPassword': 'Tabbatar da kalmar sirri',
    'auth.fullName': 'Cikakken Suna',
    'auth.phoneNumber': 'Lambar Waya',
    'auth.welcome': 'Maraba da Banqa',
    'auth.subtitle': 'Biyan Afrika da Kwarin Gwiwa',
    'auth.loginSubtitle': 'Shiga cikin jakar kudin dijital',
    'auth.registerSubtitle': 'Shiga cikin dubban abokan ciniki masu jin dadi',
    
    // Common
    'common.submit': 'Aikawa',
    'common.cancel': 'Soke',
    'common.loading': 'Ana lodawa...',
    'common.save': 'Adana',
    'common.edit': 'Gyara',
    'common.delete': 'Share',
    'common.confirm': 'Tabbata',
    'common.close': 'Rufe',
    
    // Dashboard
    'dashboard.welcome': 'Karibu',
    'dashboard.subtitle': 'Tafiyar ku ta kudin cikin Afrika',
    'dashboard.balance': 'Ma\'aunin Jaka',
    'dashboard.totalSpent': 'Jimlar Kashe',
    'dashboard.billsPaid': 'Kudaden da aka Biya',
    'dashboard.upcomingBills': 'Kudaden da za su Zo',
    'dashboard.quickPay': 'Biyan Gaggawa',
    'dashboard.quickPaySubtitle': 'Biya ayyukan da kuke amfani da su',
    'dashboard.recentTransactions': 'Ma\'amaloli na Kwanan nan',
    'dashboard.recentTransactionsSubtitle': 'Biyan kudin ku na baya-bayan nan',
    'dashboard.thisMonth': 'Wannan wata',
    'dashboard.dueSoon': 'Zai kamata nan ba da jimawa ba',
    
    // Bills & Services
    'bills.electricity': 'Wutar Lantarki',
    'bills.water': 'Kudaden Ruwa',
    'bills.internet': 'Intanet da WiFi',
    'bills.taxes': 'Harajin Gwamnati',
    'bills.waste': 'Sarrafa Datti',
    'bills.tv': 'Biyan TV',
    'bills.airtime': 'Lokacin Iska da Bayanai',
    'bills.flight': 'Ajiyar Jirgin Sama',
    'bills.insurance': 'Inshora',
    'bills.school': 'Kudin Makaranta',
    
    // Transaction Status
    'status.completed': 'An Gama',
    'status.pending': 'Yana Jira',
    'status.failed': 'Ya Kasa',
    'status.due': 'Ya Wajaba',
    'status.upcoming': 'Mai Zuwa',
    
    // Countries
    'countries.nigeria': 'Najeriya',
    'countries.kenya': 'Kenya',
    'countries.ghana': 'Ghana',
    'countries.southafrica': 'Afirka ta Kudu',
    'countries.egypt': 'Masar',
    
    // Company
    'company.name': 'Banqa',
    'company.tagline': 'Biyan Afrika',
    'company.description': 'Abokin ciniki mai amana don biyan kudin dijital a duk faɗin Afrika',
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
