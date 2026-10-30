// tailwind.css maps the tokens an app may use onto Tailwind CSS v4 utilities
// (docs/custom-components.md#tailwind-css).
import { compile } from 'tailwindcss';
import { describe, expect, it } from 'vitest';
import tailwindCss from '../src/styles/tailwind.css?raw';
import tokensCss from '../src/styles/tokens.css?raw';
import { themeTokens } from '../src/theme-tokens';

const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/** Each theme variable in tailwind.css and the token it reads. */
const mapped = new Map([...stripComments(tailwindCss).matchAll(/(--[\w-]+):\s*var\((--mu-[\w-]+)\);/g)].map(([, name = '', token = '']) => [name, token]));

const tokensOf = (group: string) => [...new Set([...tokensCss.matchAll(new RegExp(`(--mu-${group}-[\\w-]+):`, 'g'))].map(([, name = '']) => name))];

describe('tailwind.css', () => {
  it('maps every theme token, radius and font', () => {
    const expected = [...themeTokens, ...tokensOf('radius'), ...tokensOf('font')];
    expect(expected.length).toBe(41);
    expect(expected.filter((token) => ![...mapped.values()].includes(token))).toEqual([]);
    expect(mapped.size).toBe(expected.length);
  });

  it('names each utility after its token, with an mu- prefix', () => {
    for (const [name, token] of mapped) {
      const [, namespace = '', rest = ''] = name.match(/^--(color|shadow|radius|font)-mu-(.+)$/) ?? [];
      const expected = namespace === 'color' ? `--mu-${rest}` : `--mu-${namespace}-${rest}`;
      expect(token, name).toBe(expected);
    }
  });

  it('builds utilities that read the token where they are used', async () => {
    const compiler = await compile(`${tailwindCss}\n@tailwind utilities;`);
    const css = compiler.build(['bg-mu-surface', 'text-mu-ink-muted', 'shadow-mu-raised', 'rounded-mu-md', 'font-mu-mono']);
    // With `inline`, a .mu-root that sets its own data-theme recolors the utilities inside it.
    expect(css).toMatch(/\.bg-mu-surface\s*\{\s*background-color:\s*var\(--mu-surface\)/);
    expect(css).toMatch(/\.text-mu-ink-muted\s*\{\s*color:\s*var\(--mu-ink-muted\)/);
    expect(css).toMatch(/\.rounded-mu-md\s*\{\s*border-radius:\s*var\(--mu-radius-md\)/);
    expect(css).toMatch(/\.font-mu-mono\s*\{\s*font-family:\s*var\(--mu-font-mono\)/);
    expect(css).toContain('var(--mu-shadow-raised)');
    expect(css).not.toContain('--color-mu-');
  });
});
