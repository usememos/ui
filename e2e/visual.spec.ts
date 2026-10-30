// One screenshot per playground section, theme and size, plus each overlay
// open. The baselines are made on Linux in CI (the "Screenshots" workflow),
// so this project runs in CI only: local browsers and fonts render a few
// pixels differently.
import { expect, test, type Locator, type Page } from '@playwright/test';
import { open, themes } from './helpers';

const sizes = ['xs', 'sm', 'md'] as const;
const options = { animations: 'disabled', maxDiffPixelRatio: 0.002 } as const;

/** Each overlay: how to open it, and the element to capture. */
const overlays: { name: string; open: (page: Page) => Promise<unknown>; shot: (page: Page) => Locator }[] = [
  { name: 'menu', open: (page) => page.locator('#menu').getByRole('button', { name: 'More actions' }).click(), shot: (page) => page.getByRole('menu') },
  { name: 'menu-checkbox', open: (page) => page.locator('#menu').getByRole('button', { name: 'View' }).click(), shot: (page) => page.getByRole('menu') },
  { name: 'combobox', open: (page) => page.getByRole('combobox', { name: 'Tag', exact: true }).fill('de'), shot: (page) => page.locator('.mu-combobox-popup') },
  { name: 'select', open: (page) => page.locator('#select').getByRole('combobox').nth(1).click(), shot: (page) => page.locator('.mu-select-popup') },
  { name: 'popover', open: (page) => page.locator('#popover').getByRole('button', { name: 'Share' }).click(), shot: (page) => page.locator('.mu-popover-popup') },
  { name: 'tooltip', open: (page) => page.locator('#tooltip').getByRole('button', { name: 'Archive' }).focus(), shot: (page) => page.locator('.mu-tooltip-popup') },
  { name: 'dialog', open: (page) => page.getByRole('button', { name: 'Create access token' }).click(), shot: (page) => page.getByRole('dialog') },
  { name: 'alert-dialog', open: (page) => page.getByRole('button', { name: 'Delete note' }).click(), shot: (page) => page.getByRole('alertdialog') },
  {
    name: 'toast',
    open: (page) => page.locator('#toast').getByRole('button', { name: 'Warn' }).click(),
    shot: (page) => page.locator('.mu-toast'),
  },
];

for (const theme of themes) {
  for (const size of sizes) {
    test(`${theme} ${size}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await open(page, { theme, size });
      // At xs, only the sections with xs: the rest render at sm, as in the sm screenshots.
      const ids = await page.locator(size === 'xs' ? 'main > section[id][data-xs]' : 'main > section[id]').evaluateAll((sections) => sections.map((section) => section.id));
      for (const id of ids) {
        await expect(page.locator(`#${id}`), id).toHaveScreenshot(`${id}-${theme}-${size}.png`, options);
      }
    });

    // Overlays have no xs: at xs they are the sm screenshots.
    if (size === 'xs') continue;
    test(`${theme} ${size} overlays`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      for (const overlay of overlays) {
        await open(page, { theme, size });
        await overlay.open(page);
        const shot = overlay.shot(page);
        await expect(shot).toBeVisible();
        await page.evaluate(() => Promise.all(document.getAnimations().filter((animation) => animation instanceof CSSTransition).map((animation) => animation.finished.catch(() => undefined))));
        await expect(shot, overlay.name).toHaveScreenshot(`overlay-${overlay.name}-${theme}-${size}.png`, options);
      }
    });
  }
}
