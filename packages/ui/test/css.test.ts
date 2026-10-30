// Rules for every stylesheet the package ships: scoped class names, and no
// raw values in component styles (docs/building.md, AGENTS.md).
import { join } from 'node:path';
import { build } from 'esbuild';
import { describe, expect, it } from 'vitest';
import foundationCss from '../src/styles/foundation.css?raw';
import stylesCss from '../src/styles/styles.css?raw';
import tokensCss from '../src/styles/tokens.css?raw';

const componentCss = import.meta.glob<string>('../src/components/*/*.css', { query: '?raw', import: 'default', eager: true });

const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/** Raw values a component stylesheet may not contain: they belong in tokens. */
const rawValues: [label: string, pattern: RegExp][] = [
  ['hex color', /#[0-9a-f]{3,8}\b/gi],
  ['color function', /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color-mix)\(/gi],
  ['duration', /(?<![\w-])\d*\.?\d+m?s\b/g],
  ['easing', /\bcubic-bezier\(/g],
  // 0.5px (the press offset) and 1px (hairlines) are the only lengths allowed.
  ['length', /(?<![\w.-])(?!(?:0?\.5|1)px)\d*\.?\d+(?:px|rem)\b/g],
  ['z-index', /(?<=z-index:\s*)-?\d+/g],
];

/** Media queries can't read custom properties, so their conditions use the breakpoint values (docs/layout.md). */
const stripMediaConditions = (css: string) => css.replace(/@media[^{]*/g, '');

function findRawValues(css: string) {
  const found: string[] = [];
  for (const [label, pattern] of rawValues) {
    for (const [match] of stripMediaConditions(stripComments(css)).matchAll(pattern)) found.push(`${label}: ${match}`);
  }
  return found;
}

describe('stylesheets', () => {
  it('only use classes that start with mu-', () => {
    for (const css of [tokensCss, foundationCss, stylesCss, ...Object.values(componentCss)]) {
      const classes = [...stripComments(css).replace(/"[^"]*"|'[^']*'/g, '').matchAll(/\.([a-zA-Z][\w-]*)/g)].map(([, name = '']) => name);
      expect(classes.filter((name) => !name.startsWith('mu-') && name !== 'lucide')).toEqual([]);
    }
  });

  it('import every component stylesheet into styles.css', () => {
    for (const path of Object.keys(componentCss)) {
      const file = path.replace('../src/', '../');
      expect(stylesCss, path).toContain(`@import "${file}" layer(mu);`);
    }
  });

  it('find raw values', () => {
    expect(findRawValues('.mu-x { color: #fff; box-shadow: 0 2px 4px rgba(0,0,0,.1); transition: opacity 150ms cubic-bezier(0, 0, 1, 1); z-index: 10; }')).toEqual([
      'hex color: #fff',
      'color function: rgba(',
      'duration: 150ms',
      'easing: cubic-bezier(',
      'length: 2px',
      'length: 4px',
      'z-index: 10',
    ]);
    expect(findRawValues('.mu-x { height: var(--mu-row-height); border: 1px solid var(--mu-edge); translate: 0 0.5px; opacity: 0.45; scale: 1.1; transition: opacity var(--mu-duration-fade) var(--mu-ease-out); }')).toEqual([]);
    expect(findRawValues('@media (max-width: 639px) { .mu-x { width: 100%; } }')).toEqual([]);
  });

  for (const [path, css] of Object.entries(componentCss)) {
    it(`${path} uses tokens, not raw values`, () => {
      expect(findRawValues(css)).toEqual([]);
    });
  }
});

/** The top-level rules of a stylesheet: everything between braces at depth 0. */
function topLevelRules(css: string) {
  const out: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < css.length; i++) {
    if (css[i] === '{' && depth++ === 0) out.push(css.slice(start, i).trim());
    if (css[i] === '}' && --depth === 0) start = i + 1;
  }
  return out;
}

describe('published stylesheets', () => {
  // Built as scripts/build.mjs builds them: an app's utility classes and own rules must beat every component rule.
  for (const file of ['tokens.css', 'styles.css']) {
    it(`${file} keeps every rule in the mu cascade layer`, async () => {
      const result = await build({ entryPoints: [join(__dirname, '../src/styles', file)], bundle: true, minify: true, write: false, logLevel: 'silent' });
      const css = result.outputFiles[0]?.text ?? '';
      const rules = topLevelRules(stripComments(css));
      expect(rules.length).toBeGreaterThan(0);
      expect(rules.filter((rule) => rule !== '@layer mu')).toEqual([]);
    });
  }
});
