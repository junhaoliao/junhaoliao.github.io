import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { createLocaleI18n } from "../src/i18n/config.ts";

test("initial dictionaries and concurrent instances are isolated", () => {
  const english = createLocaleI18n("en", { greeting: "Hello", details: { name: "English" } });
  const french = createLocaleI18n("fr", { greeting: "Bonjour", details: { name: "Français" } });
  expect(english.isInitialized).toBe(true);
  expect(french.isInitialized).toBe(true);
  expect(english.t("greeting")).toBe("Hello");
  expect(french.t("greeting")).toBe("Bonjour");
  expect(english.t("details", { returnObjects: true })).toEqual({ name: "English" });
  expect(french.t("details", { returnObjects: true })).toEqual({ name: "Français" });
  expect(Object.keys(french.services.resourceStore.data)).toEqual(["fr"]);
});

test("blog loads no homepage dictionary or animation code", () => {
  const html = fs.readFileSync("out/fr/blog/index.html", "utf8");
  const scripts = [...html.matchAll(/<script[^>]+src="([^"?]+)[^"]*"/g)]
    .map((match) => match[1])
    .filter((src) => src.startsWith("/_next/"));
  expect(scripts.length).toBeGreaterThan(0);
  const javascript = scripts.map((src) => fs.readFileSync(path.join("out", src), "utf8")).join("\n");
  for (const content of [html, javascript]) {
    expect(content).not.toContain("Contributeur de");
    expect(content).not.toContain("Get in Touch");
    expect(content).not.toContain("ScrollTrigger");
  }
  expect(html).toContain("Expérience");
});

test("homepage serializes summaries only for the selected locale", () => {
  const html = fs.readFileSync("out/fr/index.html", "utf8");
  expect(html).toContain("Bonjour le monde 2026");
  expect(html).not.toContain("你好世界 2026");
  expect(html).not.toContain("Hello World 2026");
});
