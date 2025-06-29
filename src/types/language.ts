
export interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, vars?: { [key: string]: string | number }) => string;
}

export interface LanguageProviderProps {
  children: React.ReactNode;
}
