import "server-only";
import type { ResourceLanguage } from "i18next";
import type { UrlLocale } from "@/lib/locales";
import en from "../../public/locales/en/translation.json";
import fr from "../../public/locales/fr/translation.json";
import zh from "../../public/locales/zh-CN/translation.json";
import zhHant from "../../public/locales/zh-HK/translation.json";

/** Fill missing keys without sending a second, English dictionary to the browser. */
const withFallback = (fallback: ResourceLanguage, translation: ResourceLanguage): ResourceLanguage => {
  const result = { ...fallback, ...translation };
  for (const key of Object.keys(fallback)) {
    const value = translation[key];
    if (value == null) {
      result[key] = fallback[key];
    } else if (typeof value === "object" && !Array.isArray(value) && typeof fallback[key] === "object") {
      result[key] = withFallback(fallback[key], value);
    }
  }
  return result;
};

// These immutable assets are prepared once in the server module. Only the
// selected dictionary crosses the server/client boundary in the locale layout.
const dictionaries: Record<UrlLocale, ResourceLanguage> = {
  en,
  fr: withFallback(en, fr),
  zh: withFallback(en, zh),
  "zh-Hant": withFallback(en, zhHant),
};

export const getDictionary = (locale: UrlLocale) => dictionaries[locale];
