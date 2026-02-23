"use client";

import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Languages } from "lucide-react";
import type { Post } from "@/lib/blog";

const LOCALE_LABELS: Record<string, string> = {
  default: "English",
  en: "English",
  fr: "Français",
  "zh-CN": "简体中文",
  "zh-HK": "繁體中文",
};

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

  const availableLocales = Object.keys(variants).filter(
    (locale) => locale !== post.locale,
  );

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

        {availableLocales.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5">
              <Languages className="h-4 w-4" />
              {t("blog.translations")}:
            </span>
            {availableLocales.map((locale) => (
              <button
                key={locale}
                onClick={() => i18n.changeLanguage(locale === "default" ? "en" : locale)}
                className="underline underline-offset-2 hover:opacity-80 transition-opacity"
              >
                {LOCALE_LABELS[locale] ?? locale}
              </button>
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
}
