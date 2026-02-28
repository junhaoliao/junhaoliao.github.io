/** URL slug <-> i18n code mapping for locale-prefixed routes. */

export const URL_LOCALES = ["en", "fr", "zh", "zh-Hant"] as const;
export type UrlLocale = (typeof URL_LOCALES)[number];

/** Map a URL slug to the internal i18n / content code. */
export const URL_TO_I18N: Record<UrlLocale, string> = {
  en: "en",
  fr: "fr",
  zh: "zh-CN",
  "zh-Hant": "zh-HK",
};

/** Reverse map: i18n code -> URL slug. */
export const I18N_TO_URL: Record<string, UrlLocale> = {
  en: "en",
  fr: "fr",
  "zh-CN": "zh",
  "zh-HK": "zh-Hant",
};

/** Human-readable labels keyed by URL slug. */
export const LOCALE_LABELS: Record<UrlLocale, string> = {
  en: "English",
  fr: "Fran\u00e7ais",
  zh: "\u7b80\u4f53\u4e2d\u6587",
  "zh-Hant": "\u7e41\u9ad4\u4e2d\u6587",
};

export const STORAGE_KEY = "junhao-lang";

/** Regex to extract the locale prefix from a pathname. Longer slugs first. */
const sorted = [...URL_LOCALES].sort((a, b) => b.length - a.length);
export const LOCALE_RE = new RegExp(`^\\/(${sorted.join("|")})(\\/|$)`);

/** Parse URL locale and home-page flag from a Next.js pathname. */
export function parseLocalePath(pathname: string): {
  urlLocale: UrlLocale;
  isHome: boolean;
} {
  const match = pathname.match(LOCALE_RE);
  const urlLocale = (match ? match[1] : "en") as UrlLocale;
  const isHome = pathname === `/${urlLocale}` || pathname === `/${urlLocale}/`;
  return { urlLocale, isHome };
}
