// Builds the published package into dist/: an ES module, the stylesheets
// and type declarations. Run with `npm run build`.
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const pkg = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(pkg, 'dist');
const src = (p) => join(pkg, 'src', p);

rmSync(dist, { recursive: true, force: true });

// The published files are minified, with source maps beside them for
// readable stack traces. An app's bundler minifies them again either way.
const shared = { bundle: true, format: 'esm', target: 'es2022', minify: true, sourcemap: true, logLevel: 'warning' };

await build({
  ...shared,
  entryPoints: [src('index.ts')],
  outfile: join(dist, 'index.js'),
  jsx: 'automatic',
  external: ['react', 'react/*', 'react-dom'],
});

// tokens.css and styles.css ship separately, so an app can load the tokens alone.
// styles.css imports foundation.css and each component's stylesheet; esbuild
// inlines them. The Inter files that tokens.css points at keep their names.
for (const file of ['tokens.css', 'styles.css']) {
  await build({ ...shared, entryPoints: [src(`styles/${file}`)], outfile: join(dist, file), sourcemap: false, loader: { '.woff2': 'file' }, assetNames: '[name]' });
}
copyFileSync(src('fonts/OFL.txt'), join(dist, 'OFL.txt'));

execFileSync('npx', ['tsc', '-p', join(pkg, 'tsconfig.build.json')], { stdio: 'inherit' });
addExtensions(join(dist, 'types'));

// npm packs README and LICENSE from the package folder; both live at the repo root.
for (const file of ['README.md', 'LICENSE']) copyFileSync(join(pkg, '../..', file), join(pkg, file));

/**
 * tsc keeps relative imports as written (`./size`). Rewrite them to the
 * files they resolve to (`./size.js`, `./button/index.js`), so the types also
 * load under "moduleResolution": "node16" and "nodenext".
 */
function addExtensions(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      addExtensions(path);
      continue;
    }
    if (!name.endsWith('.d.ts')) continue;
    const text = readFileSync(path, 'utf8').replace(/(from\s+|import\()(['"])(\.{1,2}\/[^'"]*)\2/g, (whole, lead, quote, spec) => {
      const base = join(dirname(path), spec);
      if (existsSync(`${base}.d.ts`)) return `${lead}${quote}${spec}.js${quote}`;
      if (existsSync(join(base, 'index.d.ts'))) return `${lead}${quote}${spec}/index.js${quote}`;
      return whole;
    });
    writeFileSync(path, text);
  }
}
