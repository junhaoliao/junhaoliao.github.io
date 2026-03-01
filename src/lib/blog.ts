import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { DEFAULT_LOCALE, LOCALE_SUFFIXES } from "@/lib/locales";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  lastModified?: string;
  description: string;
  tags: string[];
  /** The locale this content was loaded from (may differ from requested locale on fallback) */
  locale: string;
}

export interface Post extends PostMeta {
  contentHtml: string;
}

/** Parse frontmatter only (no markdown rendering). */
const parseFrontmatter = (filePath: string) => {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  return {
    lang: data.lang as string | undefined,
    meta: {
      title: (data.title as string) ?? "Untitled",
      date: (data.date as string) ?? "",
      lastModified: data.lastModified as string | undefined,
      description: (data.description as string) ?? "",
      tags: (data.tags as string[]) ?? [],
    },
  };
};

/** Parse and render a single markdown file. */
const parseFile = async (filePath: string): Promise<{ lang?: string; meta: Omit<PostMeta, "slug" | "locale">; contentHtml: string }> => {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight)
    .use(rehypeSlug)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return {
    lang: data.lang as string | undefined,
    meta: {
      title: data.title ?? "Untitled",
      date: data.date ?? "",
      lastModified: data.lastModified,
      description: data.description ?? "",
      tags: data.tags ?? [],
    },
    contentHtml: processed.toString(),
  };
};

/** Get all unique slugs — each subdirectory in the blog directory is a slug. */
export const getAllSlugs = (): string[] => {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
};

/** Get all posts' metadata sorted by date descending. Prefers the given locale, falls back to any available. */
export const getAllPosts = async (locale?: string): Promise<PostMeta[]> => {
  const slugs = getAllSlugs();
  const key = locale ?? DEFAULT_LOCALE;

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const meta = getPostMeta(slug, key) ?? getPostMeta(slug);
      if (!meta) return null;
      return meta;
    }),
  );

  return posts
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
};

/**
 * Get metadata for a single post in a specific locale, using frontmatter only (no markdown rendering).
 * If locale is omitted, returns the original language (index.md).
 */
const getPostMeta = (slug: string, locale?: string): PostMeta | null => {
  const dir = path.join(BLOG_DIR, slug);

  if (locale) {
    // Try the suffixed file first
    const suffix = LOCALE_SUFFIXES[locale];
    if (suffix) {
      const file = path.join(dir, `index${suffix}.md`);
      if (fs.existsSync(file)) {
        const { meta } = parseFrontmatter(file);
        return { slug, locale, ...meta };
      }
    }

    // Check if index.md's lang matches the requested locale
    const defaultFile = path.join(dir, "index.md");
    if (fs.existsSync(defaultFile)) {
      const { lang, meta } = parseFrontmatter(defaultFile);
      const originalLang = lang ?? DEFAULT_LOCALE;
      if (originalLang === locale) {
        return { slug, locale: originalLang, ...meta };
      }
    }

    return null;
  }

  // No locale specified — return index.md in its original language
  const defaultFile = path.join(dir, "index.md");
  if (fs.existsSync(defaultFile)) {
    const { lang, meta } = parseFrontmatter(defaultFile);
    const originalLang = lang ?? DEFAULT_LOCALE;
    return { slug, locale: originalLang, ...meta };
  }

  return null;
};

// Build-time cache for getAllLocaleVariants (keyed by slug).
const variantsCache = new Map<string, Promise<Record<string, Post>>>();

/**
 * Get all available locale variants for a slug.
 * Used at build time to embed all translations in the static page.
 * Results are cached per slug for the lifetime of the build process.
 */
export const getAllLocaleVariants = (slug: string): Promise<Record<string, Post>> => {
  let cached = variantsCache.get(slug);
  if (!cached) {
    cached = getAllLocaleVariantsUncached(slug);
    variantsCache.set(slug, cached);
  }
  return cached;
};

const getAllLocaleVariantsUncached = async (slug: string): Promise<Record<string, Post>> => {
  const dir = path.join(BLOG_DIR, slug);
  const variants: Record<string, Post> = {};

  // index.md is the original language. Its `lang` frontmatter field declares
  // which language it is (defaults to "en" if absent).
  const defaultFile = path.join(dir, "index.md");
  if (fs.existsSync(defaultFile)) {
    const { lang, meta, contentHtml } = await parseFile(defaultFile);
    const originalLang = lang ?? DEFAULT_LOCALE;
    variants[originalLang] = { slug, locale: originalLang, contentHtml, ...meta };
  }

  for (const [locale, suffix] of Object.entries(LOCALE_SUFFIXES)) {
    const file = path.join(dir, `index${suffix}.md`);
    if (fs.existsSync(file)) {
      const { meta, contentHtml } = await parseFile(file);
      variants[locale] = { slug, locale, contentHtml, ...meta };
    }
  }

  return variants;
};

/**
 * Build a locale-indexed post listing for the home page.
 * Each entry maps locale → PostMeta so the client component can pick the
 * active language at render time. Sorted by date descending.
 */
export const getLocalizedPostIndex = async (limit?: number): Promise<Record<string, PostMeta>[]> => {
  const slugs = getAllSlugs();
  const index = await Promise.all(
    slugs.map(async (slug) => {
      const variants = await getAllLocaleVariants(slug);
      const metaMap: Record<string, PostMeta> = {};
      for (const [locale, post] of Object.entries(variants)) {
        metaMap[locale] = {
          slug: post.slug,
          title: post.title,
          date: post.date,
          lastModified: post.lastModified,
          description: post.description,
          tags: post.tags,
          locale: post.locale,
        };
      }
      return metaMap;
    }),
  );

  index.sort((a, b) => {
    const dateA = Object.values(a)[0].date;
    const dateB = Object.values(b)[0].date;
    return dateA < dateB ? 1 : -1;
  });

  return limit ? index.slice(0, limit) : index;
};
