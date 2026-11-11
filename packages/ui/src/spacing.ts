/**
 * The spacing ladder in px: every gap, margin and padding in a layout is one
 * of these steps, and each step has a job (docs/layout.md#spacing). The token
 * `--mu-space-<n>` is the step of n × 4px, and a Tailwind CSS class has the
 * same n: `gap-4` and `var(--mu-space-4)` are both 16px.
 */
export const spacingSteps = [4, 8, 12, 16, 20, 24, 32, 48, 64] as const;

/** Not steps, but allowed: 0, a 1px nudge, and `inset` (2px), the gap between the items of one cluster. */
const allowed = new Set<number>([0, 1, 2, ...spacingSteps]);

/**
 * A Tailwind CSS padding, margin, gap or space-between class whose value is a
 * number or an arbitrary px or rem length: `p-4`, `-mt-1.5`, `gap-x-2`,
 * `px-[10px]`. A variant before it (`md:`, `hover:`) is not part of the match.
 * Other values (`px`, `auto`, a variable, a calc) are never checked, and
 * neither is a longer class that ends the same way (`top-4`, `scroll-p-4`).
 */
const spacingClass = /(?<![\w-])-?(?:[pm](?:[xytrblse]|b[se])?|gap(?:-[xy])?|space-[xy])-(?:(\d+(?:\.\d+)?)|\[(\d*\.?\d+)(px|rem)\])(?![\w./-])/g;

/**
 * The Tailwind CSS padding, margin and gap classes in `source` whose value is
 * not a step of the spacing ladder, as written and in order, so a class used
 * twice is listed twice: `["gap-1.5", "px-[10px]"]`.
 *
 * `source` is any text that holds class names: a component file, a
 * stylesheet with `@apply`, a template. An app runs it over its source files
 * in a test (docs/layout.md#spacing-in-an-app). Width, height and position
 * classes are not spacing and are not checked.
 */
export function offLadderSpacing(source: string): string[] {
  const found: string[] = [];
  for (const [name, steps, length, unit] of source.matchAll(spacingClass)) {
    const px = steps !== undefined ? Number(steps) * 4 : Number(length) * (unit === 'rem' ? 16 : 1);
    if (!allowed.has(px)) found.push(name);
  }
  return found;
}
