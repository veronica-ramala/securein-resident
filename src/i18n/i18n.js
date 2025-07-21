import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { translations } from '../../localization/translations';

// Get device language and check if we support it
const getDeviceLanguage = () => {
  try {
    const deviceLanguage = Localization.locale || 'en-US';
    
    // Extract language code (e.g., 'en-US' -> 'en', 'hi-IN' -> 'hi')
    const languageCode = deviceLanguage.split('-')[0];
    
    // Check if we have translations for this language
    if (translations[languageCode]) {
      return languageCode;
    }
    
    // Fallback to English
    return 'en';
  } catch (error) {
    console.warn('Error getting device language:', error);
    return 'en';
  }
};

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: getDeviceLanguage(), // auto-detect language
    fallbackLng: 'en',
    resources: {
      en: { translation: translations.en },
      hi: { translation: translations.hi },
      te: { translation: translations.te },
      es: { translation: translations.es },
      fr: { translation: translations.fr },
      de: { translation: translations.de },
      it: { translation: translations.it },
    },
    interpolation: {
      escapeValue: false // React already does escaping
    },
    // Enable namespace support for nested translations
    ns: ['translation'],
    defaultNS: 'translation',
  })
  .catch((error) => {
    console.warn('i18n initialization error:', error);
  });

export default i18n;