/**
 * Post-build script: generates static HTML redirect files for old WordPress URLs.
 *
 * Old pattern:  /{YYYY}/{MM}/{DD}/{slug}/
 * Chinese:      /zh/{YYYY}/{MM}/{DD}/{slug}/
 *
 * New pattern:  /en/blog/{slug}/
 *               /zh/blog/{slug}/
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const OUT_DIR = path.join(process.cwd(), "out");
const BASE_URL = "https://junhaoliao.github.io";

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

function main() {
  if (!fs.existsSync(OUT_DIR)) {
    console.error("Error: out/ directory not found. Run `next build` first.");
    process.exit(1);
  }

  const slugs = fs
    .readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  let count = 0;

  for (const slug of slugs) {
    const indexFile = path.join(BLOG_DIR, slug, "index.md");
    if (!fs.existsSync(indexFile)) continue;

    const raw = fs.readFileSync(indexFile, "utf8");
    const { data } = matter(raw);
    if (!data.date) continue;

    const date = new Date(data.date);
    const yyyy = String(date.getFullYear());
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    // English redirect: /{YYYY}/{MM}/{DD}/{slug}/ -> /en/blog/{slug}/
    const enDir = path.join(OUT_DIR, yyyy, mm, dd, slug);
    fs.mkdirSync(enDir, { recursive: true });
    fs.writeFileSync(
      path.join(enDir, "index.html"),
      redirectHtml(`/en/blog/${slug}/`),
    );
    count++;

    // Chinese redirect: /zh/{YYYY}/{MM}/{DD}/{slug}/ -> /zh/blog/{slug}/
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

main();
