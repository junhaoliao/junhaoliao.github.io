import { createInstance, type ResourceLanguage } from "i18next";

/** Create a render-local instance with all data needed for synchronous hydration. */
export const createLocaleI18n = (language: string, dictionary: ResourceLanguage) => {
  const instance = createInstance();
  // I18nextProvider supplies the instance to useTranslation and Trans. No global
  // language state is shared between concurrent static renders or route trees.
  void instance.init({
    resources: { [language]: { translation: dictionary } },
    lng: language,
    fallbackLng: false, // Missing keys are filled from English on the server.
    initAsync: false,
    ns: ["translation"],
    defaultNS: "translation",
    interpolation: { escapeValue: false },
  });
  return instance;
};
