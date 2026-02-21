"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translations at build time — no HTTP backend, no network requests
import en from "../../public/locales/en/translation.json";
import fr from "../../public/locales/fr/translation.json";
import zhCN from "../../public/locales/zh-CN/translation.json";
import zhHK from "../../public/locales/zh-HK/translation.json";

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  "zh-CN": { translation: zhCN },
  "zh-HK": { translation: zhHK },
};

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "en",
      supportedLngs: ["en", "fr", "zh-CN", "zh-HK"],
      ns: ["translation"],
      defaultNS: "translation",
      interpolation: { escapeValue: false },
      detection: {
        order: ["localStorage", "navigator", "htmlTag"],
        lookupLocalStorage: "junhao-lang",
        caches: ["localStorage"],
      },
    });
}

export default i18n;
