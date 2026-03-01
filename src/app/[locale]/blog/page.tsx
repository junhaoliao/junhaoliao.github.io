import { getAllPosts } from "@/lib/blog";
import { DEFAULT_LOCALE, URL_TO_I18N, buildLanguageAlternates, type UrlLocale } from "@/lib/locales";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogListClient from "./BlogListClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
}

export const generateMetadata = (): Metadata => ({
  title: "Blog — Junhao Liao",
  description: "Projects, tips and life moments from Junhao Liao.",
  alternates: {
    languages: buildLanguageAlternates((loc) => `/${loc}/blog/`),
  },
});

const LocalizedBlogListPage = async ({ params }: Props) => {
  const { locale } = await params;
  const i18nCode = URL_TO_I18N[locale as UrlLocale] ?? DEFAULT_LOCALE;
  const posts = await getAllPosts(i18nCode);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogListClient posts={posts} urlLocale={locale} />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LocalizedBlogListPage;
