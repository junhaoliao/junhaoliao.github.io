import { expect, test } from "@playwright/test";
import en from "../public/locales/en/translation.json" with { type: "json" };
import fr from "../public/locales/fr/translation.json" with { type: "json" };
import zh from "../public/locales/zh-CN/translation.json" with { type: "json" };
import zhHant from "../public/locales/zh-HK/translation.json" with { type: "json" };

const locales = [
  { locale: "en", dictionary: en },
  { locale: "fr", dictionary: fr },
  { locale: "zh", dictionary: zh },
  { locale: "zh-Hant", dictionary: zhHant },
];

for (const { locale, dictionary } of locales) {
  test(`${locale}: exported HTML is localized before JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    for (const path of [`/${locale}/`, `/${locale}/blog/`, `/${locale}/blog/hello-world-2026/`]) {
      await page.goto(`http://127.0.0.1:48762${path}`);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("nav")).toContainText(dictionary.nav.experience);
      if (path === `/${locale}/`) {
        await expect(page.locator("h1")).toHaveText(dictionary.hero.name);
        await expect(page.locator("#hero")).toContainText(dictionary.hero.cta);
      } else if (path.endsWith("hello-world-2026/")) {
        await expect(page.locator("article")).toContainText(dictionary.blog.published);
      } else {
        await expect(page.locator("main")).toContainText(dictionary.blog.subtitle);
      }
    }
    await context.close();
  });
}

test("locale navigation and browser history keep content, URL and preference aligned", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/en/blog/hello-world-2026/");
  for (const { locale, dictionary } of locales.slice(1)) {
    await page.locator("article").getByRole("link", { name: locale === "fr" ? "Français" : locale === "zh" ? "简体中文" : "繁體中文" }).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/blog/hello-world-2026/`));
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.locator("nav")).toContainText(dictionary.nav.experience);
    await expect(page.locator("article")).toContainText(dictionary.blog.published);
  }
  await page.goBack();
  await expect(page.locator("nav")).toContainText(zh.nav.experience);
  await expect.poll(() => page.evaluate(() => localStorage.getItem("junhao-lang"))).toBe("zh-CN");
  expect(errors).toEqual([]);
});

test("a missing article translation links to the original available locale", async ({ page }) => {
  await page.goto("/fr/blog/");
  const fallback = page.locator('main a[href="/en/blog/python-releases/"]');
  await expect(fallback).toHaveCount(1);
  await fallback.click();
  await expect(page.locator("h1")).toHaveText("Python Releases");
});

test("blocked preference storage does not break a localized page", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new DOMException("Storage blocked", "SecurityError"); };
  });
  await page.goto("/fr/blog/");
  await expect(page.locator("nav")).toContainText(fr.nav.experience);
  await page.getByRole("button", { name: "FR — Change language" }).first().click();
  await expect(page.getByRole("menuitemradio", { name: "English" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("root redirect honors a stored language without an English detour", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("junhao-lang", "zh-CN"));
  const visited: string[] = [];
  page.on("request", (request) => {
    if (request.isNavigationRequest()) visited.push(new URL(request.url()).pathname);
  });
  await page.goto("/");
  await expect(page).toHaveURL(/\/zh\/$/);
  await expect(page.locator("h1")).toHaveText(zh.hero.name);
  expect(visited).not.toContain("/en/");
});

test("root redirect detects the browser locale when storage is blocked", async ({ browser }) => {
  const context = await browser.newContext({ locale: "fr-CA" });
  await context.addInitScript(() => {
    Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Blocked", "SecurityError"); } });
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:48762/");
  await expect(page).toHaveURL(/\/fr\/$/);
  await expect(page.locator("nav")).toContainText(fr.nav.experience);
  await context.close();
});

test("root keeps its no-JavaScript English fallback", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:48762/");
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator("h1")).toHaveText(en.hero.name);
  await context.close();
});

test("exported 404 retains its English language declaration", async ({ request }) => {
  const response = await request.get("/404.html");
  const html = await response.text();
  expect(html).toMatch(/<html\b[^>]*\blang="en"/);
  expect(html).toContain("This page could not be found.");
});
