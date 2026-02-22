"use client";

import { useRef } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays } from "lucide-react";
import type { PostMeta } from "@/lib/blog";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface BlogSectionProps {
  posts: PostMeta[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  const { t } = useTranslation();
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".section-heading", {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".blog-card", {
        opacity: 0,
        y: 50,
        scale: 0.95,
        stagger: 0.12,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".blog-card",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: container },
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
          <p className="text-center text-muted-foreground">{t("blog.no_posts")}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {posts.map((post, i) => (
                <Link key={post.slug} href={`/blog/${post.slug}/`} className={`block ${i === 0 ? "lg:col-span-2" : ""}`}>
                  <Card className="blog-card h-full hover:shadow-lg transition-shadow duration-300 group">
                    <CardHeader>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {post.date}
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
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

            <div className="text-center">
              <Button variant="outline" nativeButton={false} render={<Link href="/blog/" />} className="inline-flex items-center gap-2">
                {t("blog.all_posts")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
