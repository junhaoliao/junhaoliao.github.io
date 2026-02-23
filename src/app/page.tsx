import { getLocalizedPostIndex } from "@/lib/blog";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default async function Home() {
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
