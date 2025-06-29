import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, vars?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
}

const translations = {
  en: {
    company: {
      name: 'Banqa',
      tagline: 'Financial Freedom for Africa',
    },
    nav: {
      dashboard: 'Dashboard',
      payBills: 'Pay Bills',
      history: 'History',
      wallet: 'Wallet',
      support: 'Support',
    },
    dashboard: {
      welcome: 'Welcome',
      subtitle: 'Your financial hub for seamless transactions and bill payments.',
      balance: 'Wallet Balance',
      billsPaid: 'Bills Paid',
      totalSpent: 'Total Spent',
      thisMonth: 'This Month',
      upcomingBills: 'Upcoming Bills',
      dueSoon: 'Due Soon',
      quickPay: 'Quick Pay',
      quickPaySubtitle: 'Pay your bills faster',
      recentTransactions: 'Recent Transactions',
      recentTransactionsSubtitle: 'Your latest transactions',
      addFunds: 'Add Funds',
      needsAttention: 'Needs Attention',
      noTransactions: 'No recent transactions',
      startPaying: 'Start Paying Bills',
      pendingBills: 'Pending Bills',
    },
    bills: {
      electricity: 'Electricity Bill',
      internet: 'Internet Bill',
      water: 'Water Bill',
      tv: 'TV Subscription',
      airtime: 'Airtime Recharge',
      insurance: 'Insurance Premium',
      school: 'School Fees',
      taxes: 'Taxes',
    },
    countries: {
      nigeria: 'Nigeria',
      kenya: 'Kenya',
      ghana: 'Ghana',
      southafrica: 'South Africa',
      egypt: 'Egypt',
    },
    status: {
      due: 'Due',
      upcoming: 'Upcoming',
      completed: 'Completed',
      failed: 'Failed',
      pending: 'Pending',
    },
    common: {
      user: 'User',
      friend: 'Friend',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      confirm: 'Confirm',
    },
    nav: {
      mainMenu: 'Main Menu',
      logout: 'Logout',
    },
    history: {
      title: 'Transaction History',
      subtitle: 'View and manage your payment history',
      filterTitle: 'Filter Transactions',
      searchPlaceholder: 'Search by service, provider, or reference...',
      filterPlaceholder: 'Filter by status',
      allStatus: 'All Status',
      export: 'Export',
      recentTransactions: 'Recent Transactions',
      showingResults: 'Showing {count} of {total} transactions',
      transaction: 'Transaction',
      banqa: 'Banqa',
      reference: 'Reference',
      noTransactions: 'No transactions found',
    },
  },
  fr: {
    company: {
      name: 'Banqa',
      tagline: 'La liberté financière pour l\'Afrique',
    },
    nav: {
      dashboard: 'Tableau de bord',
      payBills: 'Payer les factures',
      history: 'Historique',
      wallet: 'Portefeuille',
      support: 'Support',
    },
    dashboard: {
      welcome: 'Bienvenue',
      subtitle: 'Votre centre financier pour des transactions et des paiements de factures transparents.',
      balance: 'Solde du portefeuille',
      billsPaid: 'Factures payées',
      totalSpent: 'Total dépensé',
      thisMonth: 'Ce mois-ci',
      upcomingBills: 'Factures à venir',
      dueSoon: 'Bientôt dû',
      quickPay: 'Paiement rapide',
      quickPaySubtitle: 'Payez vos factures plus rapidement',
      recentTransactions: 'Transactions récentes',
      recentTransactionsSubtitle: 'Vos dernières transactions',
      addFunds: 'Ajouter des Fonds',
      needsAttention: 'Nécessite une Attention',
      noTransactions: 'Aucune transaction récente',
      startPaying: 'Commencer à Payer',
      pendingBills: 'Factures en Attente',
    },
    bills: {
      electricity: 'Facture d\'électricité',
      internet: 'Facture Internet',
      water: 'Facture d\'eau',
      tv: 'Abonnement TV',
      airtime: 'Recharge de temps d\'antenne',
      insurance: 'Prime d\'assurance',
      school: 'Frais de scolarité',
      taxes: 'Taxes',
    },
    countries: {
      nigeria: 'Nigéria',
      kenya: 'Kenya',
      ghana: 'Ghana',
      southafrica: 'Afrique du Sud',
      egypt: 'Égypte',
    },
    status: {
      due: 'Dû',
      upcoming: 'À venir',
      completed: 'Terminé',
      failed: 'Échoué',
      pending: 'En attente',
    },
    common: {
      user: 'Utilisateur',
      friend: 'Ami',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      cancel: 'Annuler',
      save: 'Enregistrer',
      edit: 'Modifier',
      delete: 'Supprimer',
      confirm: 'Confirmer',
    },
    nav: {
      mainMenu: 'Menu Principal',
      logout: 'Déconnexion',
    },
    history: {
      title: 'Historique des Transactions',
      subtitle: 'Consultez et gérez votre historique de paiement',
      filterTitle: 'Filtrer les Transactions',
      searchPlaceholder: 'Rechercher par service, fournisseur ou référence...',
      filterPlaceholder: 'Filtrer par statut',
      allStatus: 'Tous les Statuts',
      export: 'Exporter',
      recentTransactions: 'Transactions Récentes',
      showingResults: 'Affichage de {count} sur {total} transactions',
      transaction: 'Transaction',
      banqa: 'Banqa',
      reference: 'Référence',
      noTransactions: 'Aucune transaction trouvée',
    },
  },
  sw: {
    company: {
      name: 'Banqa',
      tagline: 'Uhuru wa Kifedha kwa Afrika',
    },
    nav: {
      dashboard: 'Dashibodi',
      payBills: 'Lipa Bili',
      history: 'Historia',
      wallet: 'Pochi',
      support: 'Msaada',
    },
    dashboard: {
      welcome: 'Karibu',
      subtitle: 'Kitovu chako cha kifedha kwa shughuli na malipo ya bili bila mshono.',
      balance: 'Salio la Pochi',
      billsPaid: 'Bili Zilizolipwa',
      totalSpent: 'Jumla Iliyotumika',
      thisMonth: 'Mwezi Huu',
      upcomingBills: 'Bili Zinazokuja',
      dueSoon: 'Inakaribia',
      quickPay: 'Malipo ya Haraka',
      quickPaySubtitle: 'Lipa bili zako haraka zaidi',
      recentTransactions: 'Shughuli za Hivi Karibuni',
      recentTransactionsSubtitle: 'Shughuli zako za hivi karibuni',
      addFunds: 'Ongeza Fedha',
      needsAttention: 'Inahitaji Umakini',
      noTransactions: 'Hakuna shughuli za hivi karibuni',
      startPaying: 'Anza Kulipa',
      pendingBills: 'Bili Zinazongoja',
    },
    bills: {
      electricity: 'Bili ya Umeme',
      internet: 'Bili ya Mtandao',
      water: 'Bili ya Maji',
      tv: 'Usajili wa TV',
      airtime: 'Ujazaji wa Muda wa Maongezi',
      insurance: 'Malipo ya Bima',
      school: 'Ada za Shule',
      taxes: 'Kodi',
    },
    countries: {
      nigeria: 'Nigeria',
      kenya: 'Kenya',
      ghana: 'Ghana',
      southafrica: 'Afrika Kusini',
      egypt: 'Misri',
    },
    status: {
      due: 'Inastahili',
      upcoming: 'Inakuja',
      completed: 'Imekamilika',
      failed: 'Imeishindikana',
      pending: 'Inasubiriwa',
    },
    common: {
      user: 'Mtumiaji',
      friend: 'Rafiki',
      loading: 'Inapakia...',
      error: 'Kosa',
      success: 'Mafanikio',
      cancel: 'Ghairi',
      save: 'Hifadhi',
      edit: 'Hariri',
      delete: 'Futa',
      confirm: 'Thibitisha',
    },
    nav: {
      mainMenu: 'Menyu Kuu',
      logout: 'Ondoka',
    },
    history: {
      title: 'Historia ya Shughuli',
      subtitle: 'Angalia na udhibiti historia yako ya malipo',
      filterTitle: 'Chuja Shughuli',
      searchPlaceholder: 'Tafuta kwa huduma, mtoa huduma, au rejeleo...',
      filterPlaceholder: 'Chuja kwa hali',
      allStatus: 'Hali Zote',
      export: 'Hamisha',
      recentTransactions: 'Shughuli za Hivi Karibuni',
      showingResults: 'Inaonyesha {count} kati ya shughuli {total}',
      transaction: 'Shughuli',
      banqa: 'Banqa',
      reference: 'Rejeleo',
      noTransactions: 'Hakuna shughuli zilizopatikana',
    },
  },
  ha: {
    company: {
      name: 'Banqa',
      tagline: 'Yancin Kuɗi ga Afirka',
    },
    nav: {
      dashboard: 'Dashboard',
      payBills: 'Biyan Kuɗi',
      history: 'Tarihi',
      wallet: 'Wallet',
      support: 'Taimako',
    },
    dashboard: {
      welcome: 'Barka da zuwa',
      subtitle: 'Cibiyar ku ta kuɗi don ma'amaloli marasa matsala da biyan kuɗi.',
      balance: 'Wallet Balance',
      billsPaid: 'Kuɗaɗen da Aka Biya',
      totalSpent: 'Jimlar Kuɗin da Aka Kashe',
      thisMonth: 'Wannan Watan',
      upcomingBills: 'Kuɗaɗen da Ke Tafe',
      dueSoon: 'Nan Ba da Jimawa Ba',
      quickPay: 'Biyan Kuɗi Mai Sauri',
      quickPaySubtitle: 'Biya kuɗin ku da sauri',
      recentTransactions: 'Ma'amaloli na Kwanan Nan',
      recentTransactionsSubtitle: 'Ma'amalolin ku na ƙarshe',
      addFunds: 'Kara Kudi',
      needsAttention: 'Yana Bukatar Kulawa',
      noTransactions: 'Babu wani ciniki na baya-bayan nan',
      startPaying: 'Fara Biyan Kudade',
      pendingBills: 'Kudaden da Suke Jira',
    },
    bills: {
      electricity: 'Kuɗin Lantarki',
      internet: 'Kuɗin Intanet',
      water: 'Kuɗin Ruwa',
      tv: 'Biyan Kuɗin TV',
      airtime: 'Sake Cajin Lokacin Magana',
      insurance: 'Kuɗin Inshora',
      school: 'Kuɗin Makaranta',
      taxes: 'Haraji',
    },
    countries: {
      nigeria: 'Najeriya',
      kenya: 'Kenya',
      ghana: 'Ghana',
      southafrica: 'Afirka ta Kudu',
      egypt: 'Masar',
    },
    status: {
      due: 'Ya Kamata',
      upcoming: 'Mai Zuwa',
      completed: 'An Kammala',
      failed: 'Ya Gagara',
      pending: 'Ana Jira',
    },
    common: {
      user: 'Mai amfani',
      friend: 'Aboki',
      loading: 'Ana loadawa...',
      error: 'Kuskure',
      success: 'Nasara',
      cancel: 'Soke',
      save: 'Ajiye',
      edit: 'Gyara',
      delete: 'Share',
      confirm: 'Tabbatar',
    },
    nav: {
      mainMenu: 'Babban Menu',
      logout: 'Fita',
    },
    history: {
      title: 'Tarihin Ma\'amala',
      subtitle: 'Duba da sarrafa tarihin biyan ku',
      filterTitle: 'Tace Ma\'amaloli',
      searchPlaceholder: 'Bincika ta hanyar sabis, mai bada sabis, ko tunani...',
      filterPlaceholder: 'Tace ta matsayi',
      allStatus: 'Duk Matsayi',
      export: 'Fitarwa',
      recentTransactions: 'Ma\'amaloli na Kwanan Nan',
      showingResults: 'Nuna {count} na ma\'amaloli {total}',
      transaction: 'Ma\'amala',
      banqa: 'Banqa',
      reference: 'Nuni',
      noTransactions: 'Babu ma\'amaloli da aka samo',
    },
  },
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string, vars: { [key: string]: string | number } = {}) => {
    let translation = translations[language as keyof typeof translations]?.[key];

    if (!translation) {
      translation = translations['en'][key];
      if (!translation) {
        return key;
      }
    }

    Object.entries(vars).forEach(([key, value]) => {
      translation = translation!.replace(`{${key}}`, String(value));
    });

    return translation || key;
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
