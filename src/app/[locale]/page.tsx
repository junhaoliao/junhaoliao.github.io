import { getLocalizedPostIndex } from "@/lib/blog";
import { buildLanguageAlternates } from "@/lib/locales";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const generateMetadata = (): Metadata => ({
  title: "Junhao Liao - Junhao's Personal Website",
  description:
    "Junhao Liao \u2014 Software Developer at YScope Inc. Based in Toronto, Canada.",
  alternates: {
    languages: buildLanguageAlternates(),
  },
});

const LocaleHome = async () => {
  const posts = await getLocalizedPostIndex(5);

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
};

export default LocaleHome;
