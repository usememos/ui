import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:5189',
    launchOptions: process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
  },
  // Screenshot names leave out the platform: baselines are only ever made and
  // compared on Linux in CI.
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' }, testIgnore: /visual\.spec\.ts/ },
    // Screenshots of every playground section, in CI only (npm run test:visual).
    { name: 'visual', use: { browserName: 'chromium', viewport: { width: 1000, height: 800 } }, testMatch: /visual\.spec\.ts/ },
    // Run locally before a release (needs those browsers installed).
    { name: 'firefox', use: { browserName: 'firefox' }, testIgnore: /visual\.spec\.ts/ },
    { name: 'webkit', use: { browserName: 'webkit' }, testIgnore: /visual\.spec\.ts/ },
  ],
  // The playground, built and served as static files. It is built on every
  // run, so it never serves old code. `npm run dev` uses another port.
  webServer: {
    command: 'npx vite build --config playground/vite.config.ts --logLevel warn && npx vite preview --config playground/vite.config.ts --port 5189 --strictPort',
    url: 'http://localhost:5189',
    reuseExistingServer: true,
  },
});
