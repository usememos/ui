// The spacing ladder as data, and the check an app runs over its own class
// names (docs/layout.md#spacing-in-an-app).
import { compile } from 'tailwindcss';
import { describe, expect, it } from 'vitest';
import customComponentsDocs from '../../../docs/custom-components.md?raw';
import layoutDocs from '../../../docs/layout.md?raw';
import tokensCss from '../src/styles/tokens.css?raw';
import { offLadderSpacing, spacingSteps } from '../src/spacing';

describe('spacingSteps', () => {
  const tokens = [...tokensCss.matchAll(/--mu-space-(\d+):\s*(\d+)px;/g)].map(([, step, px]) => ({ step: Number(step), px: Number(px) }));

  it('lists every space token in tokens.css, in px', () => {
    expect(tokens.map(({ px }) => px)).toEqual([...spacingSteps]);
  });

  it('keeps a token number equal to its Tailwind class number: space-4 and p-4 are both 16px', () => {
    expect(tokens.filter(({ step, px }) => step * 4 !== px)).toEqual([]);
  });

  it('is the ladder the docs give apps, in px and as Tailwind class numbers', () => {
    expect(layoutDocs).toContain(`\`spacingSteps\` is the ladder in px: \`[${spacingSteps.join(', ')}]\``);
    const numbers = spacingSteps.map((px) => `\`${px / 4}\``);
    const list = `${numbers.slice(0, -1).join(', ')} and ${numbers.at(-1)}`;
    expect(layoutDocs).toContain(`The ladder is ${list}.`);
    expect(customComponentsDocs).toContain(`[spacing ladder](layout.md#spacing): ${list}.`);
  });
});

describe('offLadderSpacing', () => {
  it('passes every ladder step, 0, 1px and the 2px inset', () => {
    const steps = spacingSteps.flatMap((px) => [`p-${px / 4}`, `-mx-${px / 4}`, `gap-[${px}px]`, `mt-[${px / 16}rem]`]);
    const others = ['p-0', 'm-0', 'p-px', '-mt-px', 'gap-0.5', 'gap-[2px]', 'p-[1px]', 'mx-auto'];
    expect(offLadderSpacing([...steps, ...others].join(' '))).toEqual([]);
  });

  it('lists the padding, margin and gap classes that are off the ladder, as written and without their variants', () => {
    const source = '<div className="flex gap-1.5 px-2.5 py-2 md:-mt-7 hover:mb-10 space-y-3.5 gap-x-[6px] pbs-[0.625rem] p-4">';
    expect(offLadderSpacing(source)).toEqual(['gap-1.5', 'px-2.5', '-mt-7', 'mb-10', 'space-y-3.5', 'gap-x-[6px]', 'pbs-[0.625rem]']);
  });

  it('lists a class once for each use', () => {
    expect(offLadderSpacing('gap-1.5 p-4 gap-1.5')).toEqual(['gap-1.5', 'gap-1.5']);
  });

  it('reads classes wherever an app writes them', () => {
    expect(offLadderSpacing('cn("p-7", open && \'gap-7\', `mt-7 ${more}`)')).toEqual(['p-7', 'gap-7', 'mt-7']);
    expect(offLadderSpacing('.row { @apply px-7 !py-7 pl-7!; }')).toEqual(['px-7', 'py-7', 'pl-7']);
  });

  it('leaves alone what is not padding, margin or gap, and values it cannot measure', () => {
    const sizes = 'w-7 h-9 size-5 max-w-80 basis-7 top-7 inset-x-2.5 translate-x-1.5 leading-7 z-10 grid-cols-7';
    const longer = 'scroll-p-7 scroll-mt-10 mu-gap-7 --mu-space-7 step-7 item-10 p-7-wide gap-7/2';
    const unmeasured = 'p-[var(--pad)] p-(--pad) m-[calc(1px+2px)] pt-[env(safe-area-inset-top)] mb-[5%] p-${n}';
    expect(offLadderSpacing([sizes, longer, unmeasured].join(' '))).toEqual([]);
  });

  it('checks every class Tailwind CSS sets padding, margin or gap with', async () => {
    const prefixes = ['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl', 'ps', 'pe', 'pbs', 'pbe', 'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml', 'ms', 'me', 'mbs', 'mbe', 'gap', 'gap-x', 'gap-y', 'space-x', 'space-y'];
    const classes = prefixes.map((prefix) => `${prefix}-7`);
    // Each one is a real utility: Tailwind generates a rule for it from the spacing scale.
    // (`space-x-7` is `.space-x-7 > :not(:last-child)`, the others `.p-7 {`.)
    const { build } = await compile('@theme { --spacing: 0.25rem; }\n@tailwind utilities;');
    const css = build(classes);
    expect(classes.filter((name) => !css.includes(`.${name} `))).toEqual([]);
    expect(css.match(/calc\(var\(--spacing\) \* 7\)/g)?.length).toBeGreaterThanOrEqual(classes.length);
    expect(offLadderSpacing(classes.join(' '))).toEqual(classes);
  });
});
