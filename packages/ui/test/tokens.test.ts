// Keeps the stylesheets in sync with the token tables in docs/.
import { describe, expect, it } from 'vitest';
import colorDocs from '../../../docs/color.md?raw';
import depthDocs from '../../../docs/depth.md?raw';
import layoutDocs from '../../../docs/layout.md?raw';
import motionDocs from '../../../docs/motion.md?raw';
import typographyDocs from '../../../docs/typography.md?raw';
import foundationCss from '../src/styles/foundation.css?raw';
import tokensCss from '../src/styles/tokens.css?raw';
import { themeTokens } from '../src/theme-tokens';

const themes = ['light', 'dark', 'contrast'] as const;
type Theme = (typeof themes)[number];

const normalize = (value: string) => value.replace(/`/g, '').replace(/\s+/g, ' ').replace(/\s*,\s*/g, ',').trim();
const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/** Declarations in each rule of a stylesheet, keyed by selector. */
function rules(css: string) {
  const out = new Map<string, Map<string, string>>();
  for (const [, selector = '', body = ''] of stripComments(css).matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const declarations = new Map<string, string>();
    for (const [, name = '', value = ''] of body.matchAll(/([\w-]+)\s*:\s*([^;]+);/g)) declarations.set(name, value.trim());
    out.set(normalize(selector), declarations);
  }
  return out;
}

function rule(map: Map<string, Map<string, string>>, selector: string) {
  const found = map.get(selector);
  if (!found) throw new Error(`No rule for ${selector}`);
  return found;
}

/** Cells of every Markdown table row whose first cell is a backticked name. */
function tableRows(markdown: string) {
  return markdown
    .split('\n')
    .filter((line) => /^\| `[\w-]+` \|/.test(line))
    .map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()));
}

const unquote = (cell = '') => cell.replace(/`/g, '');

const tokenRules = rules(tokensCss);
const themeRule: Record<Theme, Map<string, string>> = {
  light: rule(tokenRules, ':where(:root,:host,.mu-root:not([data-theme] *)),[data-theme="light"]'),
  dark: rule(tokenRules, '[data-theme="dark"]'),
  contrast: rule(tokenRules, '[data-theme="contrast"]'),
};
const staticRule = rule(tokenRules, ':where(:root,:host,.mu-root)');

describe('tokens.css', () => {
  it('prefixes every custom property with --mu-', () => {
    const names = [...stripComments(tokensCss).matchAll(/(--[\w-]+)\s*:/g)].map(([, name = '']) => name);
    expect(names.length).toBeGreaterThan(70);
    expect(names.filter((name) => !name.startsWith('--mu-'))).toEqual([]);
  });

  it('matches the color tokens in docs/color.md', () => {
    const rows = tableRows(colorDocs);
    expect(rows.length).toBeGreaterThan(20);
    for (const [name, light, dark, contrast] of rows) {
      const token = `--mu-${unquote(name)}`;
      const expected: Record<Theme, string | undefined> = { light, dark, contrast };
      for (const theme of themes) {
        expect(normalize(themeRule[theme].get(token) ?? ''), `${token} in ${theme}`).toBe(normalize(expected[theme] ?? ''));
      }
    }
    const documented = new Set(rows.map(([name]) => `--mu-${unquote(name)}`));
    for (const theme of themes) {
      const colors = [...themeRule[theme].keys()].filter((name) => name.startsWith('--mu-') && !name.startsWith('--mu-shadow-'));
      expect(colors.filter((name) => !documented.has(name)), `undocumented colors in ${theme}`).toEqual([]);
    }
  });

  it('matches the shadow tokens in docs/depth.md', () => {
    const headings: Record<Theme, string> = { light: 'Light', dark: 'Dark', contrast: 'High contrast' };
    for (const theme of themes) {
      const block = depthDocs.match(new RegExp(`### ${headings[theme]}\\n\\n\`\`\`css\\n([\\s\\S]*?)\`\`\``))?.[1] ?? '';
      const shadows = [...block.matchAll(/(--mu-shadow-[\w-]+):\s*([^;]+);/g)];
      expect(shadows, theme).toHaveLength(5);
      for (const [, name = '', value = ''] of shadows) {
        expect(normalize(themeRule[theme].get(name) ?? ''), `${name} in ${theme}`).toBe(normalize(value));
      }
    }
  });

  it('matches the size, spacing, radius, layout, layer and motion tokens in the docs', () => {
    const rows = [...tableRows(layoutDocs), ...tableRows(motionDocs)];
    expect(rows.length).toBeGreaterThan(30);
    for (const [name, value] of rows) {
      const token = `--mu-${unquote(name)}`;
      expect(normalize(staticRule.get(token) ?? ''), token).toBe(normalize(value ?? ''));
    }
  });

  it('exports the color and shadow tokens as themeTokens, and every theme sets each one', () => {
    const colors = tableRows(colorDocs).map(([name]) => `--mu-${unquote(name)}`);
    const shadows = [...depthDocs.matchAll(/^\| `(shadow-[\w-]+)` \|/gm)].map(([, name = '']) => `--mu-${name}`);
    expect(shadows).toHaveLength(5);
    expect([...themeTokens]).toEqual([...colors, ...shadows]);
    for (const theme of themes) {
      expect(themeTokens.filter((name) => !themeRule[theme].has(name)), theme).toEqual([]);
    }
  });

  it('matches the font stacks in docs/typography.md', () => {
    const rows = tableRows(typographyDocs).filter(([name]) => name?.startsWith('`--'));
    expect(rows).toHaveLength(3);
    for (const [name, stack] of rows) {
      expect(normalize(staticRule.get(unquote(name)) ?? ''), name).toBe(normalize(stack ?? ''));
    }
  });
});

describe('foundation.css', () => {
  const styleRules = rules(foundationCss);

  // The type styles are the tables under "## Scale", before its "Removed styles" table.
  const scaleDocs = typographyDocs.slice(typographyDocs.indexOf('## Scale'), typographyDocs.indexOf('### Removed styles'));
  const typeStyles = tableRows(scaleDocs).map(([name = '']) => unquote(name));

  it('has a class for every type style in docs/typography.md', () => {
    const rows = tableRows(scaleDocs);
    expect(rows).toHaveLength(8);
    for (const row of rows) {
      const [name = '', sizes = '', weight, spacing] = row;
      const style = unquote(name);
      const [size, line] = sizes.replace('px', '').split('/').map((part) => `${part.trim()}px`);
      const declarations = rule(styleRules, `.mu-${style}`);
      expect(declarations.get('font-size'), style).toBe(size);
      expect(declarations.get('line-height'), style).toBe(line);
      expect(declarations.get('font-weight'), style).toBe(weight);
      // Heading rows have five cells: they also list letter spacing, with a typographic minus.
      if (row.length === 5) expect(declarations.get('letter-spacing') ?? '0', style).toBe(spacing?.replace('−', '-'));
      // System fonts have no shared variation axes, so no style sets any.
      expect(declarations.has('font-variation-settings'), style).toBe(false);
    }
  });

  it('has no type class beyond docs/typography.md', () => {
    // A type class sets a fixed font size; .mu-base reads the size row's --fs instead.
    const typeClasses = [...styleRules.keys()].filter((selector) => /^\.mu-[\w-]+$/.test(selector) && /^\d/.test(styleRules.get(selector)!.get('font-size') ?? ''));
    expect(typeClasses.map((selector) => selector.slice(4)).sort()).toEqual([...typeStyles].sort());
  });
});
