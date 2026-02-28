/**
 * Post-build script: generates legacy redirects and sitemap.xml for the static export.
 *
 * Next.js's sitemap.ts convention doesn't support `output: "export"`,
 * so sitemap generation is handled here alongside redirect generation.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const OUT_DIR = path.join(process.cwd(), "out");
const BASE_URL = "https://junhao.ca";

// Keep in sync with src/lib/locales.ts
const URL_LOCALES = ["en", "fr", "zh", "zh-Hant"];
const URL_TO_I18N = { en: "en", fr: "fr", zh: "zh-CN", "zh-Hant": "zh-HK" };
const LOCALE_SUFFIXES = { en: ".en", fr: ".fr", "zh-CN": ".zh-CN", "zh-HK": ".zh-HK" };

function redirectHtml(targetPath) {
  const absUrl = `${BASE_URL}${targetPath}`;
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=${targetPath}">
<link rel="canonical" href="${absUrl}">
<title>Redirecting...</title>
</head>
<body>
<p>Redirecting to <a href="${targetPath}">${targetPath}</a>...</p>
</body>
</html>`;
}

/**
 * Generate static HTML redirects from old WordPress date-based URLs
 * to the new locale-prefixed blog URLs.
 *
 * /{YYYY}/{MM}/{DD}/{slug}/ -> /en/blog/{slug}/
 * /zh/{YYYY}/{MM}/{DD}/{slug}/ -> /zh/blog/{slug}/
 */
function generateRedirects(slugs) {
  let count = 0;

  for (const slug of slugs) {
    const indexFile = path.join(BLOG_DIR, slug, "index.md");
    if (!fs.existsSync(indexFile)) continue;

    const { data } = matter(fs.readFileSync(indexFile, "utf8"));
    if (!data.date) continue;

    const date = new Date(data.date);
    const yyyy = String(date.getFullYear());
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    const enDir = path.join(OUT_DIR, yyyy, mm, dd, slug);
    fs.mkdirSync(enDir, { recursive: true });
    fs.writeFileSync(
      path.join(enDir, "index.html"),
      redirectHtml(`/en/blog/${slug}/`),
    );
    count++;

    const zhDir = path.join(OUT_DIR, "zh", yyyy, mm, dd, slug);
    fs.mkdirSync(zhDir, { recursive: true });
    fs.writeFileSync(
      path.join(zhDir, "index.html"),
      redirectHtml(`/zh/blog/${slug}/`),
    );
    count++;
  }

  console.log(`Generated ${count} redirect files.`);
}

/** Generate sitemap.xml listing all locale-prefixed pages. */
function generateSitemap(slugs) {
  const urls = [];

  for (const locale of URL_LOCALES) {
    urls.push(`${BASE_URL}/${locale}/`);
    urls.push(`${BASE_URL}/${locale}/blog/`);
  }

  for (const slug of slugs) {
    const dir = path.join(BLOG_DIR, slug);
    const indexFile = path.join(dir, "index.md");
    let originalLang = "en";
    if (fs.existsSync(indexFile)) {
      const { data } = matter(fs.readFileSync(indexFile, "utf8"));
      originalLang = data.lang ?? "en";
    }

    for (const locale of URL_LOCALES) {
      const i18nCode = URL_TO_I18N[locale];
      const suffix = LOCALE_SUFFIXES[i18nCode];
      if (suffix && fs.existsSync(path.join(dir, `index${suffix}.md`))) {
        urls.push(`${BASE_URL}/${locale}/blog/${slug}/`);
      } else if (originalLang === i18nCode) {
        urls.push(`${BASE_URL}/${locale}/blog/${slug}/`);
      }
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>`;
  fs.writeFileSync(path.join(OUT_DIR, "sitemap.xml"), xml);
  console.log(`Generated sitemap.xml with ${urls.length} URLs.`);
}

function main() {
  if (!fs.existsSync(OUT_DIR)) {
    console.error("Error: out/ directory not found. Run `next build` first.");
    process.exit(1);
  }

  const slugs = fs
    .readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  generateRedirects(slugs);
  generateSitemap(slugs);
}

main();
