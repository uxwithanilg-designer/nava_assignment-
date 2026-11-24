import { defineConfig, devices } from '@playwright/test';

/**
 * Visual QA: screenshot every route at 1440×900 (1x) and diff it against the Figma baselines in qa/figma.
 * Set BASE_URL to reuse a running dev server; otherwise `npm run dev` is started on port 5173.
 */
const baseURL = process.env.BASE_URL ?? 'http://localhost:5173';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  timeout: 60_000,
  use: {
    baseURL,
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } }],
  webServer: process.env.BASE_URL
    ? undefined
    : { command: 'npm run dev', url: baseURL, reuseExistingServer: true, timeout: 60_000 },
});
