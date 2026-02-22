"use client";

import { type ReactNode, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { SUPPORTED_LANGS } from "@/i18n/config";

const STORAGE_KEY = "junhao-lang";

function detectLanguage(): string {
  // 1. Check localStorage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && (SUPPORTED_LANGS as readonly string[]).includes(stored)) {
    return stored;
  }

  // 2. Check browser languages
  for (const lang of navigator.languages ?? [navigator.language]) {
    const exact = lang;
    const prefix = lang.split("-")[0];
    if ((SUPPORTED_LANGS as readonly string[]).includes(exact)) return exact;
    if ((SUPPORTED_LANGS as readonly string[]).includes(prefix)) return prefix;
  }

  return "en";
}

export default function I18nProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const detected = detectLanguage();
    if (detected !== i18n.language) {
      i18n.changeLanguage(detected);
    }

    // Persist language changes to localStorage
    const handleChange = (lng: string) => {
      localStorage.setItem(STORAGE_KEY, lng);
    };
    i18n.on("languageChanged", handleChange);
    return () => i18n.off("languageChanged", handleChange);
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
