import { getAllPosts } from "@/lib/blog";
import { URL_LOCALES, URL_TO_I18N, type UrlLocale } from "@/lib/locales";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogListClient from "./BlogListClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
}

export function generateMetadata(): Metadata {
  const languages: Record<string, string> = {};
  for (const loc of URL_LOCALES) {
    languages[URL_TO_I18N[loc]] = `/${loc}/blog/`;
  }

  return {
    title: "Blog — Junhao Liao",
    description: "Projects, tips and life moments from Junhao Liao.",
    alternates: {
      languages,
    },
  };
}

export default async function LocalizedBlogListPage({ params }: Props) {
  const { locale } = await params;
  const i18nCode = URL_TO_I18N[locale as UrlLocale] ?? "en";
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
}
