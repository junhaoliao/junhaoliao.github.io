"use client";

import { useRef } from "react";
import Link from "next/link";
import { formatBlogDate } from "@/lib/dates";
import { useTranslation } from "react-i18next";
import { gsap, useMotionGSAP } from "@/lib/gsap";
import { INTERNAL_TO_URL } from "@/lib/locales";
import { SCROLL_TRIGGERS } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { ArrowRight, CalendarDays } from "lucide-react";
import type { PostMeta } from "@/lib/blog";

interface BlogSectionProps {
  posts: PostMeta[];
}

const BlogSection = ({ posts }: BlogSectionProps) => {
  const { t, i18n } = useTranslation();
  const container = useRef<HTMLElement>(null);
  const urlLocale = INTERNAL_TO_URL[i18n.language] ?? "en";

  useMotionGSAP(
    () => {
      gsap.fromTo(".section-heading",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: container.current, start: SCROLL_TRIGGERS.HEADING, toggleActions: "play none none reverse" },
        },
      );

      if (posts.length === 0) return;

      gsap.fromTo(".blog-card",
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: ".blog-card", start: SCROLL_TRIGGERS.HEADING, toggleActions: "play none none reverse" },
        },
      );
    },
    container,
  );

  return (
    <section id="blog" ref={container} className="py-32 lg:py-40 bg-muted/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="section-heading text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            {t("blog.title")}
          </h2>
          <p className="section-heading text-muted-foreground">{t("blog.subtitle")}</p>
        </div>

        {posts.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{t("blog.no_posts")}</EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {posts.map((post, i) => {
                const linkLocale = INTERNAL_TO_URL[post.locale] ?? urlLocale;
                return (
                  <Link key={post.slug} href={`/${linkLocale}/blog/${post.slug}/`} className={cn("block", i === 0 && "lg:col-span-2")}>
                    <Card className="blog-card h-full hover:shadow-lg transition-shadow duration-300 group">
                      <CardHeader>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <CalendarDays className="size-3.5" />
                          <time dateTime={post.date}>{formatBlogDate(post.date, i18n.language)}</time>
                        </div>
                        <CardTitle className="line-clamp-2">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {post.description}
                        </p>
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary">
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

            <div className="text-center">
              <Link href={`/${urlLocale}/blog/`} className={buttonVariants({ variant: "outline" })}>
                {t("blog.all_posts")}
                <ArrowRight data-icon="inline-end" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
