/**
 * i18n.js — react-i18next configuration.
 * Supports English (en) and Tamil (ta).
 * Language choice persists in localStorage.
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ta from './locales/ta.json';

const SUPPORTED_LANGUAGES = ['en', 'ta'];
const DEFAULT_LANGUAGE = 'en';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ta: { translation: ta },
    },
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: {
      // React already escapes values — no need for i18next escaping.
      escapeValue: false,
    },
    detection: {
      // Check localStorage first, then browser language.
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'mfc_lang',
    },
  });

export { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE };
export default i18n;
