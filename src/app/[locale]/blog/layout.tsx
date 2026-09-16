import I18nProvider from "@/components/I18nProvider";
import { getDictionary } from "@/i18n/dictionaries";
import { URL_TO_INTERNAL, type UrlLocale } from "@/lib/locales";

const BlogLayout = async ({ children, params }: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const dictionary = getDictionary(locale as UrlLocale);
  return (
    <I18nProvider
      key={locale}
      language={URL_TO_INTERNAL[locale as UrlLocale]}
      dictionary={{ nav: dictionary.nav, blog: dictionary.blog, footer: dictionary.footer }}
    >
      {children}
    </I18nProvider>
  );
};

export default BlogLayout;
