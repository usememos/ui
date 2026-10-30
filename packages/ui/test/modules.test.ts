// The published JavaScript tree-shakes: an app that imports one component
// gets that component, not the whole package (scripts/modules.mjs).
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { build } from 'esbuild';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildModules } from '../scripts/modules.mjs';

const pkg = join(__dirname, '..');
let app = '';

/** Package files an app's bundle keeps when the app imports `names`. */
async function bundledFiles(names: string[]) {
  const entry = join(app, `entry-${names.join('-')}.js`);
  writeFileSync(entry, `import { ${names.join(', ')} } from '@usememos/ui';\nconsole.log(${names.join(', ')});\n`);
  const result = await build({
    entryPoints: [entry],
    bundle: true,
    write: false,
    metafile: true,
    format: 'esm',
    external: ['react', 'react/*', 'react-dom', 'lucide-react', '@base-ui/react', '@base-ui/react/*'],
    logLevel: 'silent',
  });
  const output = Object.values(result.metafile.outputs)[0];
  const ui = join(app, 'node_modules/@usememos/ui/dist');
  const kept = Object.entries(output?.inputs ?? {}).filter(([, input]) => input.bytesInOutput > 0);
  return kept.map(([path]) => relative(ui, join(process.cwd(), path))).filter((path) => !path.startsWith('..'));
}

describe('published modules', () => {
  beforeAll(async () => {
    // A stand-in app with the package installed: the built modules and the real package.json, whose sideEffects field matters.
    app = mkdtempSync(join(tmpdir(), 'mu-modules-'));
    const installed = join(app, 'node_modules/@usememos/ui');
    mkdirSync(installed, { recursive: true });
    await buildModules(join(pkg, 'src'), join(installed, 'dist'));
    cpSync(join(pkg, 'package.json'), join(installed, 'package.json'));
  });

  afterAll(() => rmSync(app, { recursive: true, force: true }));

  it('mark every module as client code for React Server Components', () => {
    const index = readFileSync(join(app, 'node_modules/@usememos/ui/dist/index.js'), 'utf8');
    expect(index.startsWith("'use client';")).toBe(true);
  });

  it('keep only Button when an app imports Button', async () => {
    const files = await bundledFiles(['Button']);
    expect(files).toContain('components/button/index.js');
    expect(files.filter((path) => path.startsWith('components/') && !path.startsWith('components/button/'))).toEqual([]);
  });

  it('keep no component when an app imports only themeTokens', async () => {
    const files = await bundledFiles(['themeTokens']);
    expect(files).toContain('theme-tokens.js');
    expect(files.filter((path) => path.startsWith('components/'))).toEqual([]);
  });

  it('keep only the components an app uses through compound parts', async () => {
    const files = await bundledFiles(['Menu', 'Tooltip']);
    const components = [...new Set(files.filter((path) => path.startsWith('components/')).map((path) => path.split('/')[1]))].sort();
    expect(components).toEqual(['menu', 'tooltip']);
  });

  it("share the app's Base UI: an exact peer dependency, and no dependencies", () => {
    const manifest = JSON.parse(readFileSync(join(pkg, 'package.json'), 'utf8'));
    const root = JSON.parse(readFileSync(join(pkg, '../../package.json'), 'utf8'));
    expect(manifest.dependencies).toBeUndefined();
    expect(manifest.peerDependencies['@base-ui/react']).toMatch(/^\d+\.\d+\.\d+$/);
    expect(root.devDependencies['@base-ui/react']).toBe(manifest.peerDependencies['@base-ui/react']);
  });
});
