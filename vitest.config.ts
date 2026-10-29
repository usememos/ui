import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['packages/*/test/**/*.test.{ts,tsx}'],
    // Process CSS, so the tests can read stylesheets with ?raw.
    css: true,
  },
});
