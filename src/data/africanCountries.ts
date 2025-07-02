
export interface AfricanCountry {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  region: string;
  languages: string[];
  phoneCode: string;
}

export const africanCountries: AfricanCountry[] = [
  // North Africa
  {
    code: 'DZ',
    name: 'Algeria',
    currency: 'DZD',
    currencySymbol: 'د.ج',
    region: 'North Africa',
    languages: ['ar', 'fr'],
    phoneCode: '+213'
  },
  {
    code: 'EG',
    name: 'Egypt',
    currency: 'EGP',
    currencySymbol: 'E£',
    region: 'North Africa',
    languages: ['ar', 'en'],
    phoneCode: '+20'
  },
  {
    code: 'LY',
    name: 'Libya',
    currency: 'LYD',
    currencySymbol: 'ل.د',
    region: 'North Africa',
    languages: ['ar'],
    phoneCode: '+218'
  },
  {
    code: 'MA',
    name: 'Morocco',
    currency: 'MAD',
    currencySymbol: 'DH',
    region: 'North Africa',
    languages: ['ar', 'fr'],
    phoneCode: '+212'
  },
  {
    code: 'SD',
    name: 'Sudan',
    currency: 'SDG',
    currencySymbol: 'ج.س',
    region: 'North Africa',
    languages: ['ar', 'en'],
    phoneCode: '+249'
  },
  {
    code: 'TN',
    name: 'Tunisia',
    currency: 'TND',
    currencySymbol: 'د.ت',
    region: 'North Africa',
    languages: ['ar', 'fr'],
    phoneCode: '+216'
  },

  // West Africa
  {
    code: 'BJ',
    name: 'Benin',
    currency: 'XOF',
    currencySymbol: 'CFA',
    region: 'West Africa',
    languages: ['fr'],
    phoneCode: '+229'
  },
  {
    code: 'BF',
    name: 'Burkina Faso',
    currency: 'XOF',
    currencySymbol: 'CFA',
    region: 'West Africa',
    languages: ['fr'],
    phoneCode: '+226'
  },
  {
    code: 'CV',
    name: 'Cape Verde',
    currency: 'CVE',
    currencySymbol: '$',
    region: 'West Africa',
    languages: ['pt'],
    phoneCode: '+238'
  },
  {
    code: 'CI',
    name: 'Ivory Coast',
    currency: 'XOF',
    currencySymbol: 'CFA',
    region: 'West Africa',
    languages: ['fr'],
    phoneCode: '+225'
  },
  {
    code: 'GM',
    name: 'Gambia',
    currency: 'GMD',
    currencySymbol: 'D',
    region: 'West Africa',
    languages: ['en'],
    phoneCode: '+220'
  },
  {
    code: 'GH',
    name: 'Ghana',
    currency: 'GHS',
    currencySymbol: '₵',
    region: 'West Africa',
    languages: ['en'],
    phoneCode: '+233'
  },
  {
    code: 'GN',
    name: 'Guinea',
    currency: 'GNF',
    currencySymbol: 'FG',
    region: 'West Africa',
    languages: ['fr'],
    phoneCode: '+224'
  },
  {
    code: 'GW',
    name: 'Guinea-Bissau',
    currency: 'XOF',
    currencySymbol: 'CFA',
    region: 'West Africa',
    languages: ['pt'],
    phoneCode: '+245'
  },
  {
    code: 'LR',
    name: 'Liberia',
    currency: 'LRD',
    currencySymbol: '$',
    region: 'West Africa',
    languages: ['en'],
    phoneCode: '+231'
  },
  {
    code: 'ML',
    name: 'Mali',
    currency: 'XOF',
    currencySymbol: 'CFA',
    region: 'West Africa',
    languages: ['fr'],
    phoneCode: '+223'
  },
  {
    code: 'MR',
    name: 'Mauritania',
    currency: 'MRU',
    currencySymbol: 'UM',
    region: 'West Africa',
    languages: ['ar', 'fr'],
    phoneCode: '+222'
  },
  {
    code: 'NE',
    name: 'Niger',
    currency: 'XOF',
    currencySymbol: 'CFA',
    region: 'West Africa',
    languages: ['fr', 'ha'],
    phoneCode: '+227'
  },
  {
    code: 'NG',
    name: 'Nigeria',
    currency: 'NGN',
    currencySymbol: '₦',
    region: 'West Africa',
    languages: ['en', 'ha', 'yo'],
    phoneCode: '+234'
  },
  {
    code: 'SN',
    name: 'Senegal',
    currency: 'XOF',
    currencySymbol: 'CFA',
    region: 'West Africa',
    languages: ['fr'],
    phoneCode: '+221'
  },
  {
    code: 'SL',
    name: 'Sierra Leone',
    currency: 'SLL',
    currencySymbol: 'Le',
    region: 'West Africa',
    languages: ['en'],
    phoneCode: '+232'
  },
  {
    code: 'TG',
    name: 'Togo',
    currency: 'XOF',
    currencySymbol: 'CFA',
    region: 'West Africa',
    languages: ['fr'],
    phoneCode: '+228'
  },

  // East Africa
  {
    code: 'BI',
    name: 'Burundi',
    currency: 'BIF',
    currencySymbol: 'FBu',
    region: 'East Africa',
    languages: ['fr', 'sw'],
    phoneCode: '+257'
  },
  {
    code: 'KM',
    name: 'Comoros',
    currency: 'KMF',
    currencySymbol: 'CF',
    region: 'East Africa',
    languages: ['ar', 'fr'],
    phoneCode: '+269'
  },
  {
    code: 'DJ',
    name: 'Djibouti',
    currency: 'DJF',
    currencySymbol: 'Fdj',
    region: 'East Africa',
    languages: ['ar', 'fr'],
    phoneCode: '+253'
  },
  {
    code: 'ER',
    name: 'Eritrea',
    currency: 'ERN',
    currencySymbol: 'Nfk',
    region: 'East Africa',
    languages: ['ar', 'en'],
    phoneCode: '+291'
  },
  {
    code: 'ET',
    name: 'Ethiopia',
    currency: 'ETB',
    currencySymbol: 'Br',
    region: 'East Africa',
    languages: ['am', 'en'],
    phoneCode: '+251'
  },
  {
    code: 'KE',
    name: 'Kenya',
    currency: 'KES',
    currencySymbol: 'KSh',
    region: 'East Africa',
    languages: ['en', 'sw'],
    phoneCode: '+254'
  },
  {
    code: 'MG',
    name: 'Madagascar',
    currency: 'MGA',
    currencySymbol: 'Ar',
    region: 'East Africa',
    languages: ['mg', 'fr'],
    phoneCode: '+261'
  },
  {
    code: 'MW',
    name: 'Malawi',
    currency: 'MWK',
    currencySymbol: 'MK',
    region: 'East Africa',
    languages: ['en'],
    phoneCode: '+265'
  },
  {
    code: 'MU',
    name: 'Mauritius',
    currency: 'MUR',
    currencySymbol: '₨',
    region: 'East Africa',
    languages: ['en', 'fr'],
    phoneCode: '+230'
  },
  {
    code: 'MZ',
    name: 'Mozambique',
    currency: 'MZN',
    currencySymbol: 'MT',
    region: 'East Africa',
    languages: ['pt'],
    phoneCode: '+258'
  },
  {
    code: 'RW',
    name: 'Rwanda',
    currency: 'RWF',
    currencySymbol: 'RF',
    region: 'East Africa',
    languages: ['rw', 'fr', 'en'],
    phoneCode: '+250'
  },
  {
    code: 'SC',
    name: 'Seychelles',
    currency: 'SCR',
    currencySymbol: '₨',
    region: 'East Africa',
    languages: ['en', 'fr'],
    phoneCode: '+248'
  },
  {
    code: 'SO',
    name: 'Somalia',
    currency: 'SOS',
    currencySymbol: 'S',
    region: 'East Africa',
    languages: ['so', 'ar'],
    phoneCode: '+252'
  },
  {
    code: 'SS',
    name: 'South Sudan',
    currency: 'SSP',
    currencySymbol: '£',
    region: 'East Africa',
    languages: ['en', 'ar'],
    phoneCode: '+211'
  },
  {
    code: 'TZ',
    name: 'Tanzania',
    currency: 'TZS',
    currencySymbol: 'TSh',
    region: 'East Africa',
    languages: ['sw', 'en'],
    phoneCode: '+255'
  },
  {
    code: 'UG',
    name: 'Uganda',
    currency: 'UGX',
    currencySymbol: 'USh',
    region: 'East Africa',
    languages: ['en', 'sw'],
    phoneCode: '+256'
  },
  {
    code: 'ZM',
    name: 'Zambia',
    currency: 'ZMW',
    currencySymbol: 'ZK',
    region: 'East Africa',
    languages: ['en'],
    phoneCode: '+260'
  },
  {
    code: 'ZW',
    name: 'Zimbabwe',
    currency: 'ZWL',
    currencySymbol: '$',
    region: 'East Africa',
    languages: ['en'],
    phoneCode: '+263'
  },

  // Central Africa
  {
    code: 'AO',
    name: 'Angola',
    currency: 'AOA',
    currencySymbol: 'Kz',
    region: 'Central Africa',
    languages: ['pt'],
    phoneCode: '+244'
  },
  {
    code: 'CM',
    name: 'Cameroon',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    region: 'Central Africa',
    languages: ['fr', 'en'],
    phoneCode: '+237'
  },
  {
    code: 'CF',
    name: 'Central African Republic',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    region: 'Central Africa',
    languages: ['fr'],
    phoneCode: '+236'
  },
  {
    code: 'TD',
    name: 'Chad',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    region: 'Central Africa',
    languages: ['fr', 'ar'],
    phoneCode: '+235'
  },
  {
    code: 'CG',
    name: 'Congo',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    region: 'Central Africa',
    languages: ['fr'],
    phoneCode: '+242'
  },
  {
    code: 'CD',
    name: 'Democratic Republic of Congo',
    currency: 'CDF',
    currencySymbol: 'FC',
    region: 'Central Africa',
    languages: ['fr'],
    phoneCode: '+243'
  },
  {
    code: 'GQ',
    name: 'Equatorial Guinea',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    region: 'Central Africa',
    languages: ['es', 'fr'],
    phoneCode: '+240'
  },
  {
    code: 'GA',
    name: 'Gabon',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    region: 'Central Africa',
    languages: ['fr'],
    phoneCode: '+241'
  },
  {
    code: 'ST',
    name: 'São Tomé and Príncipe',
    currency: 'STN',
    currencySymbol: 'Db',
    region: 'Central Africa',
    languages: ['pt'],
    phoneCode: '+239'
  },

  // Southern Africa
  {
    code: 'BW',
    name: 'Botswana',
    currency: 'BWP',
    currencySymbol: 'P',
    region: 'Southern Africa',
    languages: ['en'],
    phoneCode: '+267'
  },
  {
    code: 'SZ',
    name: 'Eswatini',
    currency: 'SZL',
    currencySymbol: 'L',
    region: 'Southern Africa',
    languages: ['en'],
    phoneCode: '+268'
  },
  {
    code: 'LS',
    name: 'Lesotho',
    currency: 'LSL',
    currencySymbol: 'L',
    region: 'Southern Africa',
    languages: ['en'],
    phoneCode: '+266'
  },
  {
    code: 'NA',
    name: 'Namibia',
    currency: 'NAD',
    currencySymbol: '$',
    region: 'Southern Africa',
    languages: ['en'],
    phoneCode: '+264'
  },
  {
    code: 'ZA',
    name: 'South Africa',
    currency: 'ZAR',
    currencySymbol: 'R',
    region: 'Southern Africa',
    languages: ['en', 'af'],
    phoneCode: '+27'
  }
];

export const getCountryByCode = (code: string): AfricanCountry | undefined => {
  return africanCountries.find(country => country.code === code);
};

export const getCountriesByRegion = (region: string): AfricanCountry[] => {
  return africanCountries.filter(country => country.region === region);
};

export const getCountriesByLanguage = (language: string): AfricanCountry[] => {
  return africanCountries.filter(country => country.languages.includes(language));
};

export const getAllRegions = (): string[] => {
  return [...new Set(africanCountries.map(country => country.region))];
};

export const getAllCurrencies = (): string[] => {
  return [...new Set(africanCountries.map(country => country.currency))];
};
