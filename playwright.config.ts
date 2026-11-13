import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 120000,
  use: {
    actionTimeout: 10000,
    ...devices["iPhone 13"],
    defaultBrowserType: "chromium",
    browserName: "chromium",
    channel: "msedge",
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node scripts/serve-web.mjs",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
  },
});
