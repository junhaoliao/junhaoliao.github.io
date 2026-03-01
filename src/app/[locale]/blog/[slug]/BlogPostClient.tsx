"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Languages } from "lucide-react";
import { LOCALE_LABELS, type UrlLocale } from "@/lib/locales";
import type { Post } from "@/lib/blog";

interface Props {
  post: Post;
  urlLocale: string;
  slug: string;
  availableUrlLocales: string[];
}

const BlogPostClient = ({ post, urlLocale, slug, availableUrlLocales }: Props) => {
  const { t } = useTranslation();

  const otherLocales = availableUrlLocales.filter((l) => l !== urlLocale);

  return (
    <article>
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {t("blog.published")} {post.date}
          </span>
          {post.lastModified && (
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {t("blog.updated")} {post.lastModified}
            </span>
          )}
        </div>

        {otherLocales.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5">
              <Languages className="h-4 w-4" />
              {t("blog.translations")}:
            </span>
            {otherLocales.map((otherUrlLocale) => (
              <Link
                key={otherUrlLocale}
                href={`/${otherUrlLocale}/blog/${slug}/`}
                className="underline underline-offset-2 hover:opacity-80 transition-opacity"
              >
                {LOCALE_LABELS[otherUrlLocale as UrlLocale] ?? otherUrlLocale}
              </Link>
            ))}
          </div>
        )}

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
};

export default BlogPostClient;
