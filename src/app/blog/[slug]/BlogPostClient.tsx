"use client";

import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import type { Post } from "@/lib/blog";

interface Props {
  variants: Record<string, Post>;
}

export default function BlogPostClient({ variants }: Props) {
  const { i18n, t } = useTranslation();

  // Try current language, then "default"
  const post =
    variants[i18n.language] ??
    variants["default"] ??
    Object.values(variants)[0];

  if (!post) return null;

  return (
    <article>
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {t("blog.published")} {post.date}
          </span>
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}
