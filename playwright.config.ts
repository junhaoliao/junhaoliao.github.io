import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  use: {
    baseURL: "http://127.0.0.1:48762",
    browserName: "chromium",
    headless: true,
  },
  webServer: {
    command: "python3 -m http.server 48762 --bind 127.0.0.1 --directory out",
    url: "http://127.0.0.1:48762/en/",
    reuseExistingServer: false,
    stdout: "ignore",
    stderr: "ignore",
  },
});
