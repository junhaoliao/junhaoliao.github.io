import { URL_LOCALES } from "@/lib/locales";
import LocaleSync from "./LocaleSync";

export const dynamicParams = false;

export function generateStaticParams() {
  return URL_LOCALES.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <>
      <LocaleSync params={params} />
      {children}
    </>
  );
}
