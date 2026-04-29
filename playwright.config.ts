/// <reference types="node" />

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  reporter: "./e2e/step-reporter.ts",
  timeout: 60_000,
  expect: {
    timeout: 8_000
  },
  use: {
    baseURL: "http://127.0.0.1:5175",
    trace: "on-first-retry"
  },
  webServer: [
    {
      command: "PORT=4010 DATABASE_PATH=/tmp/sweetpet-playwright.sqlite npm run dev --workspace server",
      url: "http://127.0.0.1:4010/api/health",
      reuseExistingServer: !process.env.CI,
      timeout: 30_000
    },
    {
      command: "VITE_API_URL=http://127.0.0.1:4010 npm run dev --workspace client -- --host 127.0.0.1 --port 5175",
      url: "http://127.0.0.1:5175",
      reuseExistingServer: !process.env.CI,
      timeout: 30_000
    }
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
