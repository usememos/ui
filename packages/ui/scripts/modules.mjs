// Builds the package's JavaScript: one ES module per source file, so an app's
// bundler drops the components it doesn't import. A single bundled file turns
// each `export * as Menu` into an object built at load time, which keeps every
// component in every app. Used by build.mjs and by test/modules.test.ts.
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { build } from 'esbuild';

/** Builds every module in srcDir into outDir, minified, with source maps. */
export async function buildModules(srcDir, outDir) {
  await build({
    entryPoints: sourceFiles(srcDir),
    outdir: outDir,
    outbase: srcDir,
    bundle: true,
    // Each file stays a file: packages and the package's own modules are imports, not inlined code.
    packages: 'external',
    plugins: [keepRelativeImports()],
    format: 'esm',
    target: 'es2022',
    jsx: 'automatic',
    // An app's bundler minifies again either way; the maps keep stack traces readable.
    minify: true,
    sourcemap: true,
    // Components use hooks, so React Server Components must load them as client code.
    banner: { js: "'use client';" },
    logLevel: 'warning',
  });
}

/** The package's TypeScript modules, without declaration files. */
function sourceFiles(dir) {
  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((name) => /\.tsx?$/.test(name) && !name.endsWith('.d.ts'))
    .map((name) => join(dir, name));
}

/**
 * Leaves each relative import in place as an external module, rewritten to
 * the file it builds to (`./size` to `./size.js`, `../button` to
 * `../button/index.js`), so the output also loads under Node's ESM rules.
 */
function keepRelativeImports() {
  return {
    name: 'keep-relative-imports',
    setup(build) {
      build.onResolve({ filter: /^\.\.?\// }, ({ path, resolveDir, kind }) => {
        if (kind === 'entry-point') return undefined;
        const base = join(resolveDir, path);
        for (const ext of ['.ts', '.tsx']) if (existsSync(base + ext)) return { path: `${path}.js`, external: true };
        for (const ext of ['.ts', '.tsx']) if (existsSync(join(base, `index${ext}`))) return { path: `${path}/index.js`, external: true };
        throw new Error(`Can't resolve ${path} from ${resolveDir}`);
      });
    },
  };
}
