import { getAllSlugs, getAllLocaleVariants } from "@/lib/blog";
import { URL_LOCALES, URL_TO_I18N } from "@/lib/locales";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = "https://junhaoliao.github.io";

export default async function sitemap(): Promise<MetadataRoute["sitemap"]> {
  const entries: MetadataRoute["sitemap"] = [];

  // Home pages
  for (const locale of URL_LOCALES) {
    entries.push({ url: `${BASE_URL}/${locale}/` });
  }

  // Blog list pages
  for (const locale of URL_LOCALES) {
    entries.push({ url: `${BASE_URL}/${locale}/blog/` });
  }

  // Individual blog posts
  const slugs = getAllSlugs();
  for (const slug of slugs) {
    const variants = await getAllLocaleVariants(slug);
    for (const locale of URL_LOCALES) {
      const i18nCode = URL_TO_I18N[locale];
      if (variants[i18nCode]) {
        entries.push({ url: `${BASE_URL}/${locale}/blog/${slug}/` });
      }
    }
  }

  return entries;
}
