import { getAllPosts } from "@/lib/blog";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import EducationSection from "@/components/EducationSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default async function Home() {
  // Fetch 3 latest posts at build time (default locale — content shown as-is)
  const posts = (await getAllPosts()).slice(0, 3);

  return (
    <main>
      <Navbar />
      <HeroSection />
      <SkillsSection />
      <ProjectsSection />
      <EducationSection />
      <BlogSection posts={posts} />
      <ContactSection />
      <Footer />
    </main>
  );
}
