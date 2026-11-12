import AxeBuilder from '@axe-core/playwright';
import { expect, type Locator, type Page } from '@playwright/test';

export const themes = ['light', 'dark'] as const;
export type Theme = (typeof themes)[number];

/** Compare the complete stack after the browser normalizes platform aliases and quotes. */
export async function expectSystemFont(locator: Locator) {
  const { actual, expected } = await locator.evaluate((element) => {
    const reference = document.createElement('span');
    reference.style.setProperty('font-family', '-apple-system, BlinkMacSystemFont, "Segoe UI (mu)", system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', 'important');
    document.body.append(reference);
    const fonts = { actual: getComputedStyle(element).fontFamily, expected: getComputedStyle(reference).fontFamily };
    reference.remove();
    return fonts;
  });
  expect(actual).toBe(expected);
}

/** Opens the playground in a theme and size, once fonts are ready. */
export async function open(page: Page, { theme = 'light', size = 'md', hash = '' }: { theme?: Theme; size?: 'xs' | 'sm' | 'md'; hash?: string } = {}) {
  await page.goto(`/?theme=${theme}&size=${size}${hash}`);
  await page.evaluate(() => document.fonts.ready);
}

/** Fails on any axe violation inside `selector`. */
export async function expectNoAxeViolations(page: Page, selector: string) {
  const scope = page.locator(selector);
  await expect(scope.first()).toBeAttached();
  // Base UI's entry/exit attributes can change before a CSS transition exists.
  // Check the whole lifecycle; progress animations are intentionally excluded.
  await expect.poll(() => scope.evaluateAll((roots) => roots.length > 0 && roots.every((root) =>
    !root.matches('[data-starting-style], [data-ending-style]')
    && !root.querySelector('[data-starting-style], [data-ending-style]')
    && root.getAnimations({ subtree: true }).every((animation) => !(animation instanceof CSSTransition) || animation.playState === 'finished' || animation.playState === 'idle'),
  ))).toBe(true);
  const { violations } = await new AxeBuilder({ page }).include(selector).analyze();
  expect(violations.map(({ id, nodes }) => `${id}: ${nodes.map((node) => node.target.join(' ')).join(', ')}`)).toEqual([]);
}
