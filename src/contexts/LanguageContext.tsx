import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, getTranslation, getDirection } from '../translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: any;
  direction: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Get saved language from localStorage
    const savedLanguage = localStorage.getItem('app-language');
    return (savedLanguage as Language) || 'auto';
  });

  // Apply language changes to document
  useEffect(() => {
    const direction = getDirection(language);
    const root = document.documentElement;
    
    // Set language attribute
    root.setAttribute('lang', language === 'auto' ? 'ar' : language);
    
    // Set direction attribute
    root.setAttribute('dir', direction);
    
    // Apply direction to body as well
    document.body.setAttribute('dir', direction);
    
    // Save language to localStorage
    localStorage.setItem('app-language', language);
  }, [language]);

  const t = getTranslation(language);
  const direction = getDirection(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, direction }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 