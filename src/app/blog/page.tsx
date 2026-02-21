import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";

export const metadata = {
  title: "Blog — Junhao Liao",
  description: "Projects, tips and life moments from Junhao Liao.",
};

export default async function BlogListingPage() {
  const posts = await getAllPosts();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Blog</h1>
          <p className="text-muted-foreground mb-10">Projects, Tips and Life Moments</p>

          {posts.length === 0 ? (
            <p className="text-muted-foreground">No blog posts yet.</p>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}/`} className="block">
                  <Card className="hover:shadow-md transition-shadow duration-300 group">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {post.date}
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-3">{post.description}</p>
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
