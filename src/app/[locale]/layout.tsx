import { notFound } from "next/navigation";
import DocumentLayout from "@/components/DocumentLayout";
import { URL_LOCALES, type UrlLocale } from "@/lib/locales";

export { metadata } from "@/components/DocumentLayout";

export const dynamicParams = false;

export const generateStaticParams = () => {
  return URL_LOCALES.map((locale) => ({ locale }));
};

const LocaleLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  if (!URL_LOCALES.includes(locale as UrlLocale)) notFound();
  const urlLocale = locale as UrlLocale;

  return (
    <DocumentLayout locale={urlLocale}>
      {children}
    </DocumentLayout>
  );
};

export default LocaleLayout;
