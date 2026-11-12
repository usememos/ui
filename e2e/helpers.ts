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
  // Colors are checked after popups finish fading in. Spinners and shimmers loop forever, so only transitions count.
  await page.evaluate(() => Promise.all(document.getAnimations().filter((animation) => animation instanceof CSSTransition).map((animation) => animation.finished.catch(() => undefined))));
  const { violations } = await new AxeBuilder({ page }).include(selector).analyze();
  expect(violations.map(({ id, nodes }) => `${id}: ${nodes.map((node) => node.target.join(' ')).join(', ')}`)).toEqual([]);
}
