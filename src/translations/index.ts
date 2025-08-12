import { arTranslations } from './ar';
import { enTranslations } from './en';

export type Language = 'ar' | 'en' | 'auto';

export const translations = {
  ar: arTranslations,
  en: enTranslations
};

export const getTranslation = (language: Language) => {
  if (language === 'auto') {
    // Default to Arabic for auto
    return arTranslations;
  }
  return translations[language] || arTranslations;
};

export const getDirection = (language: Language) => {
  if (language === 'auto') {
    // Default to RTL for auto
    return 'rtl';
  }
  return language === 'en' ? 'ltr' : 'rtl';
}; 