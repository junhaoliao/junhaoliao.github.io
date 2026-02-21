import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllSlugs, getAllLocaleVariants } from "@/lib/blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogPostClient from "./BlogPostClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const variants = await getAllLocaleVariants(slug);
  const defaultPost = variants["default"] ?? Object.values(variants)[0];
  if (!defaultPost) return {};
  return {
    title: `${defaultPost.title} — Junhao Liao`,
    description: defaultPost.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const variants = await getAllLocaleVariants(slug);

  if (Object.keys(variants).length === 0) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
          {/* Client component handles locale-aware content display */}
          <BlogPostClient variants={variants} />
        </div>
      </main>
      <Footer />
    </>
  );
}
