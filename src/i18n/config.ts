"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translations at build time — no HTTP backend, no network requests
import en from "../../public/locales/en/translation.json";
import fr from "../../public/locales/fr/translation.json";
import zhCN from "../../public/locales/zh-CN/translation.json";
import zhHK from "../../public/locales/zh-HK/translation.json";

export const SUPPORTED_LANGS = ["en", "fr", "zh-CN", "zh-HK"] as const;

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  "zh-CN": { translation: zhCN },
  "zh-HK": { translation: zhHK },
};

// Initialize with a fixed language ("en") so SSG HTML always matches the first
// client render. Language detection happens after hydration in I18nProvider.
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    supportedLngs: [...SUPPORTED_LANGS],
    ns: ["translation"],
    defaultNS: "translation",
    interpolation: { escapeValue: false },
  });
}

export default i18n;
