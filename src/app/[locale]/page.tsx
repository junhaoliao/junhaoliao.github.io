import { getLocalizedPostIndex } from "@/lib/blog";
import { URL_LOCALES, URL_TO_I18N, type UrlLocale } from "@/lib/locales";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export function generateStaticParams() {
  return URL_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const languages: Record<string, string> = {};
  for (const loc of URL_LOCALES) {
    languages[URL_TO_I18N[loc]] = `/${loc}/`;
  }

  return {
    title: "Junhao Liao - Junhao's Personal Website",
    description:
      "Junhao Liao \u2014 Software Developer at YScope Inc. Based in Toronto, Canada.",
    alternates: {
      languages,
    },
  };
}

export default async function LocaleHome() {
  const posts = await getLocalizedPostIndex(3);

  return (
    <main>
      <Navbar />
      <HeroSection />
      <ExperienceSection />
      <SkillsSection />
      <ProjectsSection />
      <BlogSection posts={posts} />
      <ContactSection />
      <Footer />
    </main>
  );
}
