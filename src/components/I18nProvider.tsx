"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { ResourceLanguage } from "i18next";
import { I18nextProvider } from "react-i18next";
import { createLocaleI18n } from "@/i18n/config";
import { STORAGE_KEY } from "@/lib/locales";

const I18nProvider = ({ children, language, dictionary }: {
  children: ReactNode;
  language: string;
  dictionary: ResourceLanguage;
}) => {
  // The locale layout keys this provider by URL locale, including client navigation.
  const [i18n] = useState(() => createLocaleI18n(language, dictionary));

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Browsing and switching languages also work when storage is unavailable.
    }
  }, [language]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default I18nProvider;
