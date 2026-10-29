// Checks the contrast promises in docs/color.md: every text color keeps
// 4.5:1 on every background it is used on, in every theme.
import { describe, expect, it } from 'vitest';
import colorDocs from '../../../docs/color.md?raw';

const themes = ['light', 'dark', 'contrast'] as const;

/** Text colors and the backgrounds each one is used on. */
const pairs: [text: string, backgrounds: string[]][] = [
  ['ink', ['canvas', 'surface', 'well', 'hover', 'key', 'key-hover']],
  ['ink-muted', ['canvas', 'surface', 'well', 'hover', 'key', 'key-hover']],
  ['on-primary', ['primary', 'primary-hover']],
  ['on-danger', ['danger-key']],
  ['accent', ['canvas', 'surface']],
  ['success', ['surface', 'success-soft']],
  ['warning', ['surface', 'warning-soft']],
  ['danger', ['surface', 'danger-soft']],
];

/** Color values per theme, from the token table in docs/color.md. */
function colorTable() {
  const table = new Map<string, Record<(typeof themes)[number], string>>();
  for (const line of colorDocs.split('\n')) {
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim().replace(/`/g, ''));
    const [name, light, dark, contrast] = cells;
    if (!name || !light || !dark || !contrast || !/^[\w-]+$/.test(name) || name === 'Token') continue;
    table.set(name, { light, dark, contrast });
  }
  return table;
}

/** Linear sRGB channels (0 to 1) of a #rrggbb or oklch() color. */
function linearRgb(color: string): [number, number, number] {
  const hex = color.match(/^#([0-9a-f]{6})$/i)?.[1];
  if (hex) {
    return [0, 2, 4].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    }) as [number, number, number];
  }
  const oklch = color.match(/^oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)$/);
  if (oklch) {
    const [l, c, h] = oklch.slice(1).map(Number) as [number, number, number];
    const a = c * Math.cos((h * Math.PI) / 180);
    const b = c * Math.sin((h * Math.PI) / 180);
    const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    return [
      clamp(4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_),
      clamp(-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_),
      clamp(-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_),
    ];
  }
  throw new Error(`Can't read the color ${color}`);
}

const luminance = (color: string) => {
  const [r, g, b] = linearRgb(color);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
};

describe('color contrast', () => {
  const table = colorTable();

  it('reads the color table', () => {
    expect(table.size).toBeGreaterThan(20);
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 5);
  });

  for (const theme of themes) {
    it(`keeps text at 4.5:1 or more in ${theme}`, () => {
      const failures: string[] = [];
      for (const [text, backgrounds] of pairs) {
        for (const background of backgrounds) {
          const fg = table.get(text)?.[theme];
          const bg = table.get(background)?.[theme];
          if (!fg || !bg) throw new Error(`Missing ${text} or ${background}`);
          const ratio = contrast(fg, bg);
          if (ratio < 4.5) failures.push(`${text} on ${background}: ${ratio.toFixed(2)}:1`);
        }
      }
      expect(failures).toEqual([]);
    });
  }
});
