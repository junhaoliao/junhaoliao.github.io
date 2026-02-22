import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  /** The locale this content was loaded from (may differ from requested locale on fallback) */
  locale: string;
}

export interface Post extends PostMeta {
  contentHtml: string;
}

/**
 * Supported locales in preference order when choosing a fallback.
 * The default file (no locale suffix) is tried last.
 */
const LOCALE_SUFFIXES: Record<string, string> = {
  "en": ".en",
  "fr": ".fr",
  "zh-CN": ".zh-CN",
  "zh-HK": ".zh-HK",
};

/** Returns the file path to try for a given slug + locale, in order. */
function candidatePaths(slug: string, locale?: string): Array<{ file: string; locale: string }> {
  const candidates: Array<{ file: string; locale: string }> = [];

  if (locale && LOCALE_SUFFIXES[locale]) {
    // Try locale-specific file first
    candidates.push({
      file: path.join(BLOG_DIR, `${slug}${LOCALE_SUFFIXES[locale]}.md`),
      locale,
    });
  }

  // Always fall back to the default (no locale suffix)
  candidates.push({ file: path.join(BLOG_DIR, `${slug}.md`), locale: "default" });

  return candidates;
}

/** Parse and render a single markdown file. */
async function parseFile(filePath: string): Promise<{ meta: Omit<PostMeta, "slug" | "locale">; contentHtml: string }> {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return {
    meta: {
      title: data.title ?? "Untitled",
      date: data.date ?? "",
      description: data.description ?? "",
      tags: data.tags ?? [],
    },
    contentHtml: processed.toString(),
  };
}

/** Get all unique slugs from the blog directory (ignoring locale suffixes). */
export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  const slugs = new Set<string>();
  for (const file of files) {
    // Strip locale suffix and .md extension
    // e.g. "hello-world.fr.md" -> "hello-world"
    // e.g. "hello-world.md" -> "hello-world"
    const name = file.replace(/\.md$/, ""); // "hello-world.fr" or "hello-world"
    const slug = name.replace(/\.(en|fr|zh-CN|zh-HK)$/, ""); // "hello-world"
    slugs.add(slug);
  }

  return Array.from(slugs);
}

/** Get all posts' metadata sorted by date descending. */
export async function getAllPosts(locale?: string): Promise<PostMeta[]> {
  const slugs = getAllSlugs();
  const posts: PostMeta[] = [];

  for (const slug of slugs) {
    const candidates = candidatePaths(slug, locale);
    for (const { file, locale: resolvedLocale } of candidates) {
      if (fs.existsSync(file)) {
        const { meta } = await parseFile(file);
        posts.push({ slug, locale: resolvedLocale, ...meta });
        break;
      }
    }
  }

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Get a single post by slug, with locale fallback. */
export async function getPostBySlug(slug: string, locale?: string): Promise<Post | null> {
  const candidates = candidatePaths(slug, locale);
  for (const { file, locale: resolvedLocale } of candidates) {
    if (fs.existsSync(file)) {
      const { meta, contentHtml } = await parseFile(file);
      return { slug, locale: resolvedLocale, contentHtml, ...meta };
    }
  }
  return null;
}

/**
 * Get all available locale variants for a slug.
 * Used at build time to embed all translations in the static page.
 */
export async function getAllLocaleVariants(slug: string): Promise<Record<string, Post>> {
  const variants: Record<string, Post> = {};

  // Check default (no locale suffix)
  const defaultFile = path.join(BLOG_DIR, `${slug}.md`);
  if (fs.existsSync(defaultFile)) {
    const { meta, contentHtml } = await parseFile(defaultFile);
    variants["default"] = { slug, locale: "default", contentHtml, ...meta };
  }

  // Check each locale
  for (const [locale, suffix] of Object.entries(LOCALE_SUFFIXES)) {
    const file = path.join(BLOG_DIR, `${slug}${suffix}.md`);
    if (fs.existsSync(file)) {
      const { meta, contentHtml } = await parseFile(file);
      variants[locale] = { slug, locale, contentHtml, ...meta };
    }
  }

  return variants;
}

/**
 * Build a locale-indexed post listing for the home page.
 * Each entry maps locale → PostMeta so the client component can pick the
 * active language at render time. Sorted by date descending.
 */
export async function getLocalizedPostIndex(limit?: number): Promise<Record<string, PostMeta>[]> {
  const slugs = getAllSlugs();
  const index = await Promise.all(
    slugs.map(async (slug) => {
      const variants = await getAllLocaleVariants(slug);
      const metaMap: Record<string, PostMeta> = {};
      for (const [locale, { contentHtml: _, ...meta }] of Object.entries(variants)) {
        metaMap[locale] = meta;
      }
      return metaMap;
    }),
  );

  index.sort((a, b) => {
    const dateA = (a["default"] ?? Object.values(a)[0]).date;
    const dateB = (b["default"] ?? Object.values(b)[0]).date;
    return dateA < dateB ? 1 : -1;
  });

  return limit ? index.slice(0, limit) : index;
}
