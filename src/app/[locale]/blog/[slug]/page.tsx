import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllSlugs, getAllLocaleVariants } from "@/lib/blog";
import { URL_LOCALES, URL_TO_I18N, type UrlLocale } from "@/lib/locales";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogPostClient from "./BlogPostClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  const params: { locale: string; slug: string }[] = [];

  for (const slug of slugs) {
    const variants = await getAllLocaleVariants(slug);
    for (const urlLocale of URL_LOCALES) {
      if (variants[URL_TO_I18N[urlLocale]]) {
        params.push({ locale: urlLocale, slug });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const i18nCode = URL_TO_I18N[locale as UrlLocale] ?? "en";
  const variants = await getAllLocaleVariants(slug);
  const post = variants[i18nCode];
  if (!post) return {};

  const languages: Record<string, string> = {};
  for (const urlLoc of URL_LOCALES) {
    if (variants[URL_TO_I18N[urlLoc]]) {
      languages[URL_TO_I18N[urlLoc]] = `/${urlLoc}/blog/${slug}/`;
    }
  }

  return {
    title: `${post.title} — Junhao Liao`,
    description: post.description,
    alternates: {
      languages,
    },
  };
}

export default async function LocalizedBlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const i18nCode = URL_TO_I18N[locale as UrlLocale] ?? "en";
  const variants = await getAllLocaleVariants(slug);
  const post = variants[i18nCode];

  if (!post) {
    notFound();
  }

  const availableUrlLocales: string[] = [];
  for (const urlLoc of URL_LOCALES) {
    if (variants[URL_TO_I18N[urlLoc]]) {
      availableUrlLocales.push(urlLoc);
    }
  }

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
}
