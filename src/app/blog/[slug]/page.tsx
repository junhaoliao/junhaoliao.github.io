import { getAllSlugs } from "@/lib/blog";
import BlogRedirect from "./BlogRedirect";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function BlogPostRedirectPage({ params }: Props) {
  const { slug } = await params;
  return <BlogRedirect slug={slug} />;
}
