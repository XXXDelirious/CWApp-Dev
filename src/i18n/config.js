import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import language resources
import en from './locales/en.json';
import hi from './locales/hi.json';
import bn from './locales/bn.json';
import kn from './locales/kn.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import gu from './locales/gu.json';
import mr from './locales/mr.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  bn: { translation: bn },
  kn: { translation: kn },
  ta: { translation: ta },
  te: { translation: te },
  gu: { translation: gu },
  mr: { translation: mr },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
