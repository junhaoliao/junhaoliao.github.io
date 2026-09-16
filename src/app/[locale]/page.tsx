import { getAllPosts } from "@/lib/blog";
import { buildLanguageAlternates, URL_TO_INTERNAL, type UrlLocale } from "@/lib/locales";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import I18nProvider from "@/components/I18nProvider";
import { getDictionary } from "@/i18n/dictionaries";
import type { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  return {
    title: "Junhao Liao - Junhao's Personal Website",
    description:
      "Junhao Liao \u2014 Software Developer at YScope Inc. Based in Toronto, Canada.",
    alternates: {
      canonical: `/${locale}/`,
      languages: buildLanguageAlternates(),
    },
  };
};

const LocaleHome = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const posts = getAllPosts(URL_TO_INTERNAL[locale as UrlLocale]).slice(0, 5);

  return (
    <I18nProvider
      key={locale}
      language={URL_TO_INTERNAL[locale as UrlLocale]}
      dictionary={getDictionary(locale as UrlLocale)}
    >
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
    </I18nProvider>
  );
};

export default LocaleHome;
