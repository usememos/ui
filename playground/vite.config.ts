import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const src = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  root: src('.'),
  esbuild: { jsx: 'automatic' },
  resolve: {
    alias: {
      // The playground runs on the source, not the build.
      '@usememos/ui/tokens.css': src('../packages/ui/src/styles/tokens.css'),
      '@usememos/ui/styles.css': src('../packages/ui/src/styles/styles.css'),
      '@usememos/ui': src('../packages/ui/src/index.ts'),
    },
  },
  build: {
    // The browser tests run against this build (see playwright.config.ts).
    // Unminified, so a failure's stack and the CSS read the same as the source.
    minify: false,
    cssMinify: false,
    rollupOptions: {
      // index.html renders every component; interop.html loads them inside an app's CSS.
      input: { index: src('index.html'), interop: src('interop.html') },
      // lucide-react marks its modules "use client", which only means something to server components.
      onwarn(warning, warn) {
        if (warning.code !== 'MODULE_LEVEL_DIRECTIVE') warn(warning);
      },
    },
  },
});
