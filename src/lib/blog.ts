import fs from "fs";
import path from "path";
import { cache } from "react";
import matter from "gray-matter";
import { DEFAULT_LOCALE, LOCALE_SUFFIXES } from "@/lib/locales";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  lastModified?: string;
  description: string;
  tags: string[];
  /** The locale this content was loaded from (may differ from requested locale on fallback). */
  locale: string;
}

export interface Post extends PostMeta {
  contentHtml: string;
}

/** Read frontmatter and Markdown source without rendering or syntax highlighting. */
const readSource = cache((filePath: string) => {
  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
  return {
    lang: (data.lang as string | undefined) ?? DEFAULT_LOCALE,
    content,
    meta: {
      title: (data.title as string) ?? "Untitled",
      date: (data.date as string) ?? "",
      lastModified: data.lastModified as string | undefined,
      description: (data.description as string) ?? "",
      tags: (data.tags as string[]) ?? [],
    },
  };
});

/** Discover available translations, with the original language first for fallback. */
const getPostSources = cache((slug: string) => {
  const dir = path.join(BLOG_DIR, slug);
  const sources: Record<string, ReturnType<typeof readSource>> = {};
  const original = path.join(dir, "index.md");
  if (fs.existsSync(original)) {
    const source = readSource(original);
    sources[source.lang] = source;
  }
  for (const [locale, suffix] of Object.entries(LOCALE_SUFFIXES)) {
    const file = path.join(dir, `index${suffix}.md`);
    if (fs.existsSync(file)) sources[locale] = readSource(file);
  }
  return sources;
});

/** Get all unique slugs — each subdirectory in the blog directory is a slug. */
export const getAllSlugs = (): string[] => {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
};

/** Metadata for route generation, alternates and listings; never renders Markdown. */
export const getPostMetaVariants = cache((slug: string): Record<string, PostMeta> => {
  return Object.fromEntries(
    Object.entries(getPostSources(slug)).map(([locale, source]) => [
      locale,
      { slug, locale, ...source.meta },
    ]),
  );
});

/** Get posts sorted newest first, preferring the requested locale then the original. */
export const getAllPosts = (locale: string = DEFAULT_LOCALE): PostMeta[] => {
  const posts = getAllSlugs().flatMap((slug) => {
    const variants = getPostMetaVariants(slug);
    const post = variants[locale] ?? Object.values(variants)[0];
    return post ? [post] : [];
  });
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
};

/** Render only the selected translation, deduplicated within a server render. */
export const getPost = cache(async (slug: string, locale: string): Promise<Post | null> => {
  const source = getPostSources(slug)[locale];
  if (!source) return null;
  const { renderMarkdown } = await import("./markdown");
  return {
    slug,
    locale,
    ...source.meta,
    contentHtml: await renderMarkdown(source.content),
  };
});
