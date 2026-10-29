// Keeps the stylesheets in sync with the token tables in docs/.
import { describe, expect, it } from 'vitest';
import colorDocs from '../../../docs/color.md?raw';
import depthDocs from '../../../docs/depth.md?raw';
import layoutDocs from '../../../docs/layout.md?raw';
import motionDocs from '../../../docs/motion.md?raw';
import typographyDocs from '../../../docs/typography.md?raw';
import stylesCss from '../src/styles/styles.css?raw';
import tokensCss from '../src/styles/tokens.css?raw';

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
  it('matches the color tokens in docs/color.md', () => {
    const rows = tableRows(colorDocs);
    expect(rows.length).toBeGreaterThan(20);
    for (const [name, light, dark, contrast] of rows) {
      const token = `--${unquote(name)}`;
      const expected: Record<Theme, string | undefined> = { light, dark, contrast };
      for (const theme of themes) {
        expect(normalize(themeRule[theme].get(token) ?? ''), `${token} in ${theme}`).toBe(normalize(expected[theme] ?? ''));
      }
    }
    const documented = new Set(rows.map(([name]) => `--${unquote(name)}`));
    for (const theme of themes) {
      const colors = [...themeRule[theme].keys()].filter((name) => name.startsWith('--') && !name.startsWith('--shadow-'));
      expect(colors.filter((name) => !documented.has(name)), `undocumented colors in ${theme}`).toEqual([]);
    }
  });

  it('matches the shadow tokens in docs/depth.md', () => {
    const headings: Record<Theme, string> = { light: 'Light', dark: 'Dark', contrast: 'High contrast' };
    for (const theme of themes) {
      const block = depthDocs.match(new RegExp(`### ${headings[theme]}\\n\\n\`\`\`css\\n([\\s\\S]*?)\`\`\``))?.[1] ?? '';
      const shadows = [...block.matchAll(/(--shadow-[\w-]+):\s*([^;]+);/g)];
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
      const token = `--${unquote(name)}`;
      expect(normalize(staticRule.get(token) ?? ''), token).toBe(normalize(value ?? ''));
    }
  });

  it('matches the font stacks in docs/typography.md', () => {
    const rows = tableRows(typographyDocs).filter(([name]) => name?.startsWith('`--'));
    expect(rows).toHaveLength(2);
    for (const [name, stack] of rows) {
      expect(normalize(staticRule.get(unquote(name)) ?? ''), name).toBe(normalize(stack ?? ''));
    }
  });
});

describe('styles.css', () => {
  const styleRules = rules(stylesCss);

  it('has a class for every type style in docs/typography.md', () => {
    const rows = tableRows(typographyDocs).filter(([name]) => !name?.startsWith('`--'));
    expect(rows).toHaveLength(13);
    for (const [name = '', sizes = '', weight, spacing, opticalSize] of rows) {
      const style = unquote(name);
      const [size, line] = sizes.replace('px', '').split('/').map((part) => `${part.trim()}px`);
      const declarations = rule(styleRules, `.mu-${style}`);
      expect(declarations.get('font-size'), style).toBe(size);
      expect(declarations.get('line-height'), style).toBe(line);
      expect(declarations.get('font-weight'), style).toBe(weight);
      // Headings also list letter spacing (with a typographic minus) and optical size.
      if (opticalSize !== undefined && /^(text|\d+)$/.test(opticalSize)) {
        expect(declarations.get('letter-spacing') ?? '0', style).toBe(spacing?.replace('−', '-'));
        const opsz = declarations.get('font-variation-settings');
        expect(opsz ? opsz.replace(/\D/g, '') : 'text', style).toBe(opticalSize);
      }
    }
  });

  it('only uses classes that start with mu-', () => {
    const classes = [...stripComments(stylesCss).matchAll(/\.([a-zA-Z][\w-]*)/g)].map(([, name = '']) => name);
    expect(classes.filter((name) => !name.startsWith('mu-') && name !== 'lucide')).toEqual([]);
  });
});
