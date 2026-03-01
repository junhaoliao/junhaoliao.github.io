import { URL_LOCALES } from "@/lib/locales";
import LocaleSync from "./LocaleSync";

export const dynamicParams = false;

export const generateStaticParams = () => {
  return URL_LOCALES.map((locale) => ({ locale }));
};

const LocaleLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  return (
    <>
      <LocaleSync params={params} />
      {children}
    </>
  );
};

export default LocaleLayout;
