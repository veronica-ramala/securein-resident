import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import i18n from '../src/i18n/i18n';

interface LocalizationContextType {
  currentLanguage: string;
  setLanguage: (languageCode: string) => Promise<void>;
  t: (key: string, options?: any) => string;
  isRTL: boolean;
  availableLanguages: Array<{
    code: string;
    name: string;
    nativeName: string;
  }>;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t: i18nT, i18n: i18nInstance } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    try {
      return i18nInstance?.language || 'en';
    } catch (error) {
      console.warn('Error getting i18n language:', error);
      return 'en';
    }
  });

  const availableLanguages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  ];

  useEffect(() => {
    loadSavedLanguage();
    
    // Listen for language changes
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);
    };
    
    i18nInstance.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18nInstance.off('languageChanged', handleLanguageChange);
    };
  }, [i18nInstance]);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (savedLanguage && availableLanguages.find(lang => lang.code === savedLanguage)) {
        await i18nInstance.changeLanguage(savedLanguage);
        setCurrentLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading saved language:', error);
    }
  };

  const setLanguage = async (languageCode: string) => {
    try {
      await AsyncStorage.setItem('selectedLanguage', languageCode);
      await i18nInstance.changeLanguage(languageCode);
      setCurrentLanguage(languageCode);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: string, options?: any): string => {
    try {
      const translation = i18nT(key, options);
      return typeof translation === 'string' ? translation : key;
    } catch (error) {
      console.warn('Translation error for key:', key, error);
      return key;
    }
  };

  const isRTL = currentLanguage === 'ar'; // Arabic is RTL

  return (
    <LocalizationContext.Provider value={{ 
      currentLanguage, 
      setLanguage, 
      t, 
      isRTL, 
      availableLanguages 
    }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    console.warn('useLocalization must be used within a LocalizationProvider');
    // Return a fallback context
    return {
      currentLanguage: 'en',
      setLanguage: async () => {},
      t: (key: string) => key,
      isRTL: false,
      availableLanguages: [{ code: 'en', name: 'English', nativeName: 'English' }]
    };
  }
  return context;
};