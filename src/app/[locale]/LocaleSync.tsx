"use client";

import { use, useEffect } from "react";
import i18n from "@/i18n/config";
import { URL_TO_I18N, STORAGE_KEY, type UrlLocale } from "@/lib/locales";

const LocaleSync = ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = use(params);
  const i18nCode = URL_TO_I18N[locale as UrlLocale] ?? "en";

  useEffect(() => {
    if (i18n.language !== i18nCode) {
      i18n.changeLanguage(i18nCode);
    }
    document.documentElement.lang = locale;
    localStorage.setItem(STORAGE_KEY, i18nCode);
  }, [locale, i18nCode]);

  return null;
};

export default LocaleSync;
