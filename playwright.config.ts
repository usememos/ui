import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:5189',
    launchOptions: process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    // Run locally before a release (needs those browsers installed).
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  // The playground, built and served as static files. It is built on every
  // run, so it never serves old code. `npm run dev` uses another port.
  webServer: {
    command: 'npx vite build --config playground/vite.config.ts --logLevel warn && npx vite preview --config playground/vite.config.ts --port 5189 --strictPort',
    url: 'http://localhost:5189',
    reuseExistingServer: true,
  },
});
