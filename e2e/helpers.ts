import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

export const themes = ['light', 'dark', 'contrast'] as const;
export type Theme = (typeof themes)[number];

/** Opens the playground in a theme and size, with Inter loaded. */
export async function open(page: Page, { theme = 'light', size = 'md', hash = '' }: { theme?: Theme; size?: 'sm' | 'md' | 'lg'; hash?: string } = {}) {
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
