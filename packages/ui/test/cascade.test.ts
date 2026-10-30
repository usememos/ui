// Specificity rules for the bundled stylesheet: source order, not hidden
// selector weight, decides which component rule wins (docs/building.md#writing-component-css).
import { join } from 'node:path';
import { build } from 'esbuild';
import { beforeAll, describe, expect, it } from 'vitest';

type Specificity = [ids: number, classes: number, types: number];

const compare = (a: Specificity, b: Specificity) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
const max = (list: Specificity[]) => list.reduce((best, next) => (compare(next, best) > 0 ? next : best), [0, 0, 0]);

/** The index just after the bracket that closes the one at `start`, skipping quoted strings. */
function closing(text: string, start: number) {
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (c === '"' || c === "'") i = text.indexOf(c, i + 1);
    else if (c === '(' || c === '[') depth++;
    else if ((c === ')' || c === ']') && --depth === 0) return i + 1;
  }
  return text.length;
}

/** Splits a selector list or a declaration block on top-level separators. */
function splitTop(text: string, separator: ',' | ';') {
  const parts: string[] = [];
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"' || c === "'") i = text.indexOf(c, i + 1);
    else if (c === '(' || c === '[') i = closing(text, i) - 1;
    else if (c === separator) {
      parts.push(text.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(text.slice(start));
  return parts.map((part) => part.trim()).filter(Boolean);
}

const identAt = (text: string, start: number) => /^-?[\w-]*/.exec(text.slice(start))?.[0] ?? '';
const legacyPseudoElements = new Set(['before', 'after', 'first-line', 'first-letter']);

/**
 * The specificity of one complex selector (Selectors level 4). With
 * `countHas: false`, every :has() counts as zero, as if it sat in :where().
 */
export function specificity(selector: string, { countHas = true } = {}): Specificity {
  const total: Specificity = [0, 0, 0];
  const add = ([a, b, c]: Specificity) => {
    total[0] += a;
    total[1] += b;
    total[2] += c;
  };
  for (let i = 0; i < selector.length; ) {
    const c = selector[i] ?? '';
    if (c === '#' || c === '.') {
      add(c === '#' ? [1, 0, 0] : [0, 1, 0]);
      i += 1 + identAt(selector, i + 1).length;
    } else if (c === '[') {
      add([0, 1, 0]);
      i = closing(selector, i);
    } else if (c === ':' && selector[i + 1] === ':') {
      add([0, 0, 1]);
      i += 2 + identAt(selector, i + 2).length;
      if (selector[i] === '(') i = closing(selector, i);
    } else if (c === ':') {
      const name = identAt(selector, i + 1).toLowerCase();
      i += 1 + name.length;
      let args = '';
      if (selector[i] === '(') {
        const end = closing(selector, i);
        args = selector.slice(i + 1, end - 1);
        i = end;
      }
      const ofList = (list: string) => max(splitTop(list, ',').map((part) => specificity(part, { countHas })));
      if (name === 'where') continue;
      else if (name === 'has' && !countHas) continue;
      else if (name === 'is' || name === 'not' || name === 'has') add(ofList(args));
      else if (/^nth-(last-)?child$/.test(name) && / of /.test(args)) add(ofList(args.slice(args.indexOf(' of ') + 4))), add([0, 1, 0]);
      else if (legacyPseudoElements.has(name)) add([0, 0, 1]);
      else add([0, 1, 0]);
    } else if (/[a-zA-Z_-]/.test(c)) {
      add([0, 0, 1]);
      i += identAt(selector, i).length;
    } else i++;
  }
  return total;
}

/** The style rules of a stylesheet, in source order, with each selector and its declarations. Keyframes are skipped. */
function styleRules(css: string) {
  const rules: { selectors: string[]; declarations: Map<string, string>; context: string }[] = [];
  const stack: string[] = [];
  // Braces as brackets, so closing() finds the end of a block.
  const blocks = css.replace(/\{/g, '(').replace(/\}/g, ')');
  let start = 0;
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (c === '"' || c === "'") i = css.indexOf(c, i + 1);
    else if (c === '(') i = closing(css, i) - 1;
    else if (c === ';') start = i + 1;
    else if (c === '{') {
      const prelude = css.slice(start, i).trim();
      stack.push(prelude);
      if (!prelude.startsWith('@') && !stack.some((open) => open.startsWith('@keyframes'))) {
        const end = closing(blocks, i);
        const declarations = new Map(
          splitTop(css.slice(i + 1, end - 1), ';').map((declaration) => {
            const colon = declaration.indexOf(':');
            return [declaration.slice(0, colon).trim(), declaration.slice(colon + 1).trim()];
          }),
        );
        rules.push({ selectors: splitTop(prelude, ','), declarations, context: stack.slice(0, -1).join(' ') });
      }
      start = i + 1;
    } else if (c === '}') {
      stack.pop();
      start = i + 1;
    }
  }
  return rules;
}

/** The last compound of a selector: the part that matches the styled element itself. */
function subject(selector: string) {
  let start = 0;
  for (let i = 0; i < selector.length; i++) {
    const c = selector[i];
    if (c === '(' || c === '[') i = closing(selector, i) - 1;
    else if (c === ' ' || c === '>' || c === '+' || c === '~') start = i + 1;
  }
  return selector.slice(start);
}

/** The classes a compound requires, and the ones its top-level :not() rules out. */
function classesOf(compound: string) {
  const required = new Set<string>();
  const excluded = new Set<string>();
  for (let i = 0; i < compound.length; i++) {
    const c = compound[i];
    if (c === '.') required.add(identAt(compound, i + 1));
    else if (c === '[') i = closing(compound, i) - 1;
    else if (c === '(') {
      const end = closing(compound, i);
      if (compound.slice(0, i).endsWith(':not')) {
        for (const option of splitTop(compound.slice(i + 1, end - 1), ',')) if (/^\.[\w-]+$/.test(option)) excluded.add(option.slice(1));
      }
      i = end - 1;
    }
  }
  return { required, excluded };
}

/** Whether two properties can set the same longhand: `padding` and `padding-inline-start` do, `padding-block` and `padding-inline-start` don't. */
const overlaps = (a: string, b: string) => {
  if (a === b) return true;
  const [short, long] = a.length < b.length ? [a, b] : [b, a];
  return long.startsWith(`${short}-`) && !(short === 'border' && long.endsWith('-radius'));
};

let rules: ReturnType<typeof styleRules> = [];

beforeAll(async () => {
  // Bundled as scripts/build.mjs bundles it, so rules from different component files are compared in shipping order.
  const result = await build({ entryPoints: [join(__dirname, '../src/styles/styles.css')], bundle: true, write: false, logLevel: 'silent' });
  rules = styleRules((result.outputFiles[0]?.text ?? '').replace(/\/\*[\s\S]*?\*\//g, ''));
});

describe('specificity', () => {
  it('follows Selectors level 4', () => {
    expect(specificity('.mu-button:has(> svg:first-child)')).toEqual([0, 2, 1]);
    expect(specificity('.mu-button:where(:has(> svg:first-child))')).toEqual([0, 1, 0]);
    expect(specificity('.mu-button.mu-button-icon')).toEqual([0, 2, 0]);
    expect(specificity('.mu-input-root:hover:not([data-disabled], [aria-disabled="true"], :has(> [data-disabled]))')).toEqual([0, 3, 0]);
    expect(specificity('.mu-prose :not(pre) > code')).toEqual([0, 1, 2]);
    expect(specificity('#x li::marker')).toEqual([1, 0, 2]);
    expect(specificity('a:nth-child(2 of .x, #y)')).toEqual([1, 1, 1]);
    expect(specificity('.mu-x:before')).toEqual([0, 1, 1]);
  });

  it('can count :has() as zero', () => {
    expect(specificity('.mu-button:has(> svg:first-child)', { countHas: false })).toEqual([0, 1, 0]);
    expect(specificity('.mu-input-root:not(:has(> .mu-input))', { countHas: false })).toEqual([0, 1, 0]);
    // The attributes beside it weigh as much, so this :has() adds nothing.
    expect(specificity('.mu-input-root:is([data-invalid], :has(> [data-invalid]))', { countHas: false })).toEqual([0, 2, 0]);
  });
});

describe('the bundled stylesheet', () => {
  it('has style rules to check', () => {
    expect(rules.length).toBeGreaterThan(100);
  });

  // :has() takes the weight of its argument, so `.mu-button:has(> svg)` (0,2,1)
  // silently beats a later `.mu-button.mu-button-icon` (0,2,0).
  it('never lets a :has() add specificity: it sits in :where()', () => {
    const weighted = rules.flatMap(({ selectors }) => selectors).filter((selector) => compare(specificity(selector), specificity(selector, { countHas: false })) !== 0);
    expect(weighted).toEqual([]);
  });

  // A later rule that adds a class to the same element, such as a variant or a
  // modifier, is meant to override the earlier one for the properties both set.
  it('lets a later modifier rule beat the earlier base rule it narrows', () => {
    const outranked: string[] = [];
    rules.forEach((earlier, e) => {
      for (const later of rules.slice(e + 1)) {
        const shared = [...earlier.declarations.keys()].filter((a) => [...later.declarations.keys()].some((b) => overlaps(a, b)));
        if (shared.length === 0) continue;
        for (const before of earlier.selectors) {
          const base = classesOf(subject(before));
          for (const after of later.selectors) {
            const narrowed = classesOf(subject(after));
            const extends_ = base.required.size > 0 && [...base.required].every((name) => narrowed.required.has(name)) && narrowed.required.size > base.required.size;
            const disjoint = [...base.excluded].some((name) => narrowed.required.has(name)) || [...narrowed.excluded].some((name) => base.required.has(name));
            if (extends_ && !disjoint && compare(specificity(before), specificity(after)) > 0) outranked.push(`${before} beats the later ${after} on ${shared.join(', ')}`);
          }
        }
      }
    });
    expect(outranked).toEqual([]);
  });
});
