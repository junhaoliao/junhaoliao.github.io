import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllSlugs, getAllLocaleVariants } from "@/lib/blog";
import { DEFAULT_LOCALE, URL_LOCALES, URL_TO_I18N, buildLanguageAlternates, type UrlLocale } from "@/lib/locales";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogPostClient from "./BlogPostClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export const generateStaticParams = async ({
  params,
}: {
  params: { locale: string };
}) => {
  const { locale } = params;
  const i18nCode = URL_TO_I18N[locale as UrlLocale] ?? DEFAULT_LOCALE;
  const slugs = getAllSlugs();
  const result: { slug: string }[] = [];

  for (const slug of slugs) {
    const variants = await getAllLocaleVariants(slug);
    if (variants[i18nCode]) {
      result.push({ slug });
    }
  }

  return result;
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale, slug } = await params;
  const i18nCode = URL_TO_I18N[locale as UrlLocale] ?? DEFAULT_LOCALE;
  const variants = await getAllLocaleVariants(slug);
  const post = variants[i18nCode];
  if (!post) return {};

  const available = new Set(Object.keys(variants));

  return {
    title: `${post.title} — Junhao Liao`,
    description: post.description,
    alternates: {
      canonical: `/${locale}/blog/${slug}/`,
      languages: buildLanguageAlternates((loc) => `/${loc}/blog/${slug}/`, available),
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
    },
  };
};

const LocalizedBlogPostPage = async ({ params }: Props) => {
  const { locale, slug } = await params;
  const i18nCode = URL_TO_I18N[locale as UrlLocale] ?? DEFAULT_LOCALE;
  const variants = await getAllLocaleVariants(slug);
  const post = variants[i18nCode];

  if (!post) {
    notFound();
  }

  const availableUrlLocales: UrlLocale[] = URL_LOCALES.filter(
    (loc) => variants[URL_TO_I18N[loc]],
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/${locale}/blog/`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
          <BlogPostClient
            post={post}
            urlLocale={locale}
            slug={slug}
            availableUrlLocales={availableUrlLocales}
          />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LocalizedBlogPostPage;
