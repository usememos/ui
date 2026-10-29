import { defineConfig } from '@playwright/test';

const executablePath = process.env.PW_CHROMIUM_PATH;

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:5189',
    launchOptions: executablePath ? { executablePath } : {},
  },
  // Screenshot names leave out the platform: baselines are only ever made and
  // compared on Linux in CI.
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' }, testIgnore: /visual\.spec\.ts/ },
    // Screenshots of every playground section, in CI only (npm run test:visual).
    // Grayscale text antialiasing: Chromium turns subpixel (LCD) text on and
    // off with compositing, which made small popups like the tooltip flaky.
    {
      name: 'visual',
      use: { browserName: 'chromium', viewport: { width: 1000, height: 800 }, launchOptions: { executablePath, args: ['--disable-lcd-text'] } },
      testMatch: /visual\.spec\.ts/,
    },
    // Run locally before a release (needs those browsers installed).
    { name: 'firefox', use: { browserName: 'firefox' }, testIgnore: /visual\.spec\.ts/ },
    { name: 'webkit', use: { browserName: 'webkit' }, testIgnore: /visual\.spec\.ts/ },
  ],
  // The playground, built and served as static files. It is built on every
  // run, so it never serves old code.
  webServer: {
    command: 'npx vite build --config playground/vite.config.ts --logLevel warn && npx vite preview --config playground/vite.config.ts --port 5189 --strictPort',
    url: 'http://localhost:5189',
    reuseExistingServer: true,
  },
});
