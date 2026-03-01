"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { I18N_TO_URL } from "@/lib/locales";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import type { PostMeta } from "@/lib/blog";

interface Props {
  posts: PostMeta[];
  urlLocale: string;
}

const BlogListClient = ({ posts, urlLocale }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <h1 className="text-4xl font-bold tracking-tight mb-2">{t("blog.title")}</h1>
      <p className="text-muted-foreground mb-10">{t("blog.subtitle")}</p>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">{t("blog.no_posts")}</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => {
            const linkLocale = I18N_TO_URL[post.locale] ?? urlLocale;
            return (
              <Link key={post.slug} href={`/${linkLocale}/blog/${post.slug}/`} className="block">
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
            );
          })}
        </div>
      )}
    </>
  );
};

export default BlogListClient;
