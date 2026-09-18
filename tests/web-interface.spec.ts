import { expect, test } from "@playwright/test";

test.use({
  viewport: { width: 1280, height: 900 },
  contextOptions: { reducedMotion: "reduce" },
  colorScheme: "light",
  timezoneId: "America/Los_Angeles",
});

test("section links preserve fragments, modifier clicks and browser history", async ({ page, context }) => {
  await page.goto("/en/");
  const projects = page.getByRole("navigation").getByRole("link", { name: "Projects", exact: true });
  await expect(projects).toHaveAttribute("href", "/en/#projects");
  const popupPromise = context.waitForEvent("page");
  await projects.click({ modifiers: ["ControlOrMeta"] });
  const popup = await popupPromise;
  await popup.waitForURL("**/en/#projects");
  await popup.close();
  await expect(page).toHaveURL(/\/en\/$/);
  await projects.click();
  await expect(page).toHaveURL(/#projects$/);
  await page.getByRole("navigation").getByRole("link", { name: "Blog", exact: true }).click();
  await expect(page).toHaveURL(/#blog$/);
  await page.goBack();
  await expect(page).toHaveURL(/#projects$/);
});

test("contact CTA and QR code are keyboard-operable links", async ({ page }) => {
  await page.goto("/en/");
  const cta = page.getByRole("link", { name: "Get in Touch", exact: true });
  await expect(cta).toHaveAttribute("href", "#contact");
  await cta.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#contact$/);
  const qr = page.getByRole("link", { name: "WeChat QR code" });
  await expect(qr).toHaveAttribute("href", "/images/wechat-qr.webp");
  await qr.hover();
  await expect(page.locator('[data-slot="hover-card-content"] img')).toBeVisible();
  const popupPromise = page.waitForEvent("popup");
  const imageResponse = page.context().waitForEvent("response", response =>
    response.url().endsWith("/images/wechat-qr.webp") && response.request().isNavigationRequest(),
  );
  await qr.focus();
  await page.keyboard.press("Enter");
  const popup = await popupPromise;
  expect((await imageResponse).status()).toBe(200);
  await popup.close();
});

test("mobile section links close the sheet and reach the destination", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const link = page.getByRole("dialog").getByRole("link", { name: "Projects", exact: true });
  await expect(link).toHaveAttribute("href", "/en/#projects");
  await link.click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page).toHaveURL(/#projects$/);
  await expect.poll(() => page.locator("#projects").evaluate(el => Math.round(el.getBoundingClientRect().top))).toBe(80);
});

test("skip link targets main after navigation on home, list, and article", async ({ page }) => {
  for (const path of ["/en/", "/fr/blog/", "/zh/blog/hello-world-2026/"]) {
    await page.goto(path);
    await page.keyboard.press("Tab");
    const skip = page.locator('a[href="#main-content"]');
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("main#main-content")).toBeFocused();
    await expect(page.locator("main nav")).toHaveCount(0);
  }
});

test("reduced motion leaves content visible and cleans up live animations", async ({ page }) => {
  await page.goto("/en/");
  const content = page.locator(".section-heading, .timeline-heading, .tl-item, .skill-row, .category-grid, .featured-card, .project-card, .blog-card, .contact-item");
  await expect.poll(() => content.evaluateAll(elements => elements.every(el => getComputedStyle(el).opacity === "1"))).toBe(true);
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  await expect(page.locator(".hero-scroll")).toHaveCSS("animation-name", "none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.evaluate(() => window.scrollTo({ top: 650, behavior: "instant" }));
  await expect.poll(() => page.locator(".hero-bg").evaluate(el => getComputedStyle(el).transform)).not.toBe("none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".hero-bg")).toHaveCSS("transform", "none");
  await expect(page.locator(".hero-content")).toHaveCSS("opacity", "1");
  await expect.poll(() => content.evaluateAll(elements => elements.every(el => getComputedStyle(el).opacity === "1"))).toBe(true);
});

test("theme metadata follows system, manual override and client navigation", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/en/");
  const colorsMatch = () => page.evaluate(() => {
    const meta = Array.from(document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')).find(el => !el.media || matchMedia(el.media).matches);
    if (!meta) return false;
    const canvas = document.createElement("canvas").getContext("2d")!;
    const rgba = (color: string) => { canvas.fillStyle = color; canvas.fillRect(0, 0, 1, 1); return [...canvas.getImageData(0, 0, 1, 1).data].join(); };
    return rgba(meta.content) === rgba(getComputedStyle(document.body).backgroundColor);
  });
  await expect.poll(colorsMatch).toBe(true);
  await page.getByRole("button", { name: "Switch to light mode" }).filter({visible:true}).click();
  await expect(page.locator("html")).toHaveClass(/light/);
  await expect.poll(colorsMatch).toBe(true);
  await page.reload();
  await expect.poll(colorsMatch).toBe(true);
  await page.locator('a[href="/en/blog/"]').click();
  await expect(page).toHaveURL(/\/en\/blog\/$/);
  await expect.poll(colorsMatch).toBe(true);
});

test("language changes update document language without moving away from the hero", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en/");
  for (const [name, lang] of [["Français", "fr"], ["简体中文", "zh"], ["繁體中文", "zh-Hant"]]) {
    await page.getByRole("button", { name: /Change language/ }).filter({visible:true}).focus();
    await page.keyboard.press("Enter");
    await page.getByRole("menuitemradio", { name, exact: true }).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await page.evaluate(() => new Promise<void>((resolve) => {
      let frames = 0;
      const waitForFrame = () => {
        frames += 1;
        if (frames === 10) resolve();
        else requestAnimationFrame(waitForFrame);
      };
      requestAnimationFrame(waitForFrame);
    }));
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  }
  expect(errors).toEqual([]);
});

test("blog dates are localized and retain their date west of UTC", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const path of ["/fr/#blog", "/fr/blog/", "/fr/blog/hello-world-2026/"]) {
    await page.goto(path);
    await expect(page.locator('time[datetime="2026-02-22"]').first()).toHaveText("22 février 2026");
  }
  for (const [locale, expected] of [["en", "February 22, 2026"], ["zh", "2026年2月22日"], ["zh-Hant", "2026年2月22日"]]) {
    await page.goto(`/${locale}/blog/hello-world-2026/`);
    await expect(page.locator("time").first()).toHaveText(expected);
  }
  await page.goto("/en/blog/python-releases/");
  await expect(page.locator('time[datetime="2026-03-01"]')).toHaveText("March 1, 2026");
  expect(errors).toEqual([]);
});

test("card headings follow the page outline and anchor headings clear the header", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.locator('#projects [data-slot="card-title"]')).toHaveCount(3);
  await expect(page.locator('#projects h3[data-slot="card-title"]')).toHaveCount(3);
  await expect(page.locator('#blog h3[data-slot="card-title"]')).toHaveCount(5);
  await page.goto("/en/blog/");
  await expect(page.locator('h2[data-slot="card-title"]')).not.toHaveCount(0);
  await page.goto("/en/blog/python-releases/#latest-releases");
  await expect.poll(() => page.locator("#latest-releases").evaluate(el => Math.round(el.getBoundingClientRect().top))).toBe(80);
  await expect(page.locator("h1")).toHaveCSS("text-wrap-style", "balance");
});
