// Keeps the component inventory, the docs pages, the exports and the
// playground in step.
import { describe, expect, it } from 'vitest';
import inventory from '../../../docs/components/README.md?raw';
import indexTs from '../src/index.ts?raw';

const pages = import.meta.glob<string>('../../../docs/components/*.md', { query: '?raw', import: 'default', eager: true });
const components = import.meta.glob('../src/components/*/index.{ts,tsx}');
const sections = import.meta.glob('../../../playground/sections/*.tsx');

const baseName = (path: string) => path.split('/').pop()?.replace(/\.\w+$/, '') ?? '';
const pageNames = new Set(Object.keys(pages).map(baseName).filter((name) => name !== 'README'));
const sectionNames = new Set(Object.keys(sections).map(baseName));
const componentNames = Object.keys(components).map((path) => path.split('/').at(-2) ?? '');

describe('component inventory', () => {
  it('links every component page, and every link has a page', () => {
    const linked = new Set([...inventory.matchAll(/\]\(([\w-]+)\.md\)/g)].map(([, name = '']) => name));
    expect([...pageNames].filter((name) => !linked.has(name)), 'pages missing from the inventory').toEqual([]);
    expect([...linked].filter((name) => !pageNames.has(name)), 'inventory links without a page').toEqual([]);
  });

  for (const name of componentNames) {
    it(`${name} has a docs page, an export and a playground section`, () => {
      expect(pageNames.has(name), `docs/components/${name}.md`).toBe(true);
      expect(indexTs, `export from src/index.ts`).toContain(`from './components/${name}'`);
      expect(sectionNames.has(name), `playground/sections/${name}.tsx`).toBe(true);
    });
  }
});
