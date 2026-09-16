import { getAllSlugs } from "@/lib/blog";
import BlogRedirect from "./BlogRedirect";

interface Props {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = async () => {
  return getAllSlugs().map((slug) => ({ slug }));
};

const BlogPostRedirectPage = async ({ params }: Props) => {
  const { slug } = await params;
  return <BlogRedirect slug={slug} />;
};

export default BlogPostRedirectPage;
