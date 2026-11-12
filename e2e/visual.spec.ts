// One screenshot per playground section, theme and size, plus each overlay
// open. The baselines are made on Linux in CI (the "Screenshots" workflow),
// so this project runs in CI only: local browsers and fonts render a few
// pixels differently.
import { expect, test, type Locator, type Page } from '@playwright/test';
import { open, themes } from './helpers';

const sizes = ['xs', 'sm', 'md'] as const;
const options = { animations: 'disabled', maxDiffPixelRatio: 0.002 } as const;

/** Each overlay: how to open it, and the element to capture (or, with `union`, the box around several). */
const overlays: { name: string; open: (page: Page) => Promise<unknown>; shot: (page: Page) => Locator; union?: boolean }[] = [
  { name: 'menu', open: (page) => page.locator('#menu').getByRole('button', { name: 'More actions' }).click(), shot: (page) => page.getByRole('menu') },
  // The submenu beside its trigger row: the two lists side by side, the first submenu row level with the trigger.
  {
    name: 'menu-submenu',
    open: async (page) => {
      await page.locator('#menu').getByRole('button', { name: 'More actions' }).click();
      await page.getByRole('menuitem', { name: 'Move to' }).focus();
      await page.keyboard.press('ArrowRight');
      await expect(page.getByRole('menu')).toHaveCount(2);
    },
    shot: (page) => page.getByRole('menu'),
    union: true,
  },
  // A panel row's own Menu beside the panel: the first choice level with the row, like a submenu.
  {
    name: 'popover-list-menu',
    open: async (page) => {
      await page.locator('#popover').getByRole('button', { name: 'Account' }).click();
      await page.locator('.mu-popover-popup').getByRole('button', { name: /Theme/ }).click();
      await expect(page.getByRole('menu')).toBeVisible();
    },
    shot: (page) => page.locator('.mu-popover-popup, .mu-menu-popup'),
    union: true,
  },
  { name: 'menu-checkbox', open: (page) => page.locator('#menu').getByRole('button', { name: 'View' }).click(), shot: (page) => page.getByRole('menu') },
  { name: 'combobox', open: (page) => page.getByRole('combobox', { name: 'Tag', exact: true }).fill('de'), shot: (page) => page.locator('.mu-combobox-popup') },
  { name: 'select', open: (page) => page.locator('#select').getByRole('combobox').nth(1).click(), shot: (page) => page.locator('.mu-select-popup') },
  { name: 'collapsible', open: (page) => page.locator('#collapsible').getByRole('button', { name: 'Advanced settings' }).click(), shot: (page) => page.locator('#collapsible') },
  {
    name: 'select-value',
    open: (page) => page.locator('#select').getByRole('combobox', { name: 'Visibility' }).click(),
    shot: (page) => page.locator('#select [role="combobox"]').first().or(page.locator('.mu-select-popup')),
    union: true,
  },
  { name: 'reactions', open: (page) => page.locator('#popover').getByRole('button', { name: 'Add reaction', exact: true }).click(), shot: (page) => page.locator('.reaction-popup') },
  { name: 'popover', open: (page) => page.locator('#popover').getByRole('button', { name: 'Share' }).click(), shot: (page) => page.locator('.mu-popover-popup') },
  { name: 'popover-view', open: (page) => page.locator('#popover').getByRole('button', { name: 'View options' }).click(), shot: (page) => page.locator('.mu-popover-popup') },
  { name: 'popover-list', open: (page) => page.locator('#popover').getByRole('button', { name: 'Account' }).click(), shot: (page) => page.locator('.mu-popover-popup') },
  { name: 'menu-description', open: (page) => page.locator('#menu').getByRole('button', { name: 'Visibility' }).click(), shot: (page) => page.getByRole('menu') },
  { name: 'dialog-bare', open: (page) => page.getByRole('button', { name: 'Quick find' }).click(), shot: (page) => page.getByRole('dialog') },
  { name: 'combobox-grid', open: (page) => page.locator('#combobox').getByRole('button', { name: 'Choose icon' }).click(), shot: (page) => page.locator('.mu-popover-popup') },
  { name: 'drawer', open: (page) => page.getByRole('button', { name: 'Note details' }).click(), shot: (page) => page.getByRole('dialog') },
  { name: 'tooltip', open: (page) => page.locator('#tooltip').getByRole('button', { name: 'Archive' }).focus(), shot: (page) => page.locator('.mu-tooltip-popup') },
  { name: 'dialog', open: (page) => page.getByRole('button', { name: 'Create access token' }).click(), shot: (page) => page.getByRole('dialog') },
  {
    name: 'dialog-close-tooltip',
    open: async (page) => {
      await page.getByRole('button', { name: 'Create access token' }).click();
      await page.locator('.mu-dialog-x').hover();
      await expect(page.locator('.mu-tooltip-popup[data-open]')).toBeVisible();
    },
    shot: (page) => page.locator('.mu-dialog-popup, .mu-tooltip-popup[data-open]'),
    union: true,
  },
  {
    name: 'combobox-trigger-tooltip',
    open: async (page) => {
      await page.locator('#combobox .mu-combobox-trigger').first().hover();
      await expect(page.locator('.mu-tooltip-popup[data-open]')).toBeVisible();
    },
    shot: (page) => page.locator('#combobox .mu-combobox-input-root').first().or(page.locator('.mu-tooltip-popup[data-open]')),
    union: true,
  },
  { name: 'alert-dialog', open: (page) => page.getByRole('button', { name: 'Delete note' }).click(), shot: (page) => page.getByRole('alertdialog') },
  {
    name: 'toast',
    open: (page) => page.locator('#toast').getByRole('button', { name: 'Warn' }).click(),
    shot: (page) => page.locator('.mu-toast'),
  },
];

/** The box around every element `locator` matches, with a little surrounding context. */
async function around(locator: Locator) {
  const boxes = (await Promise.all((await locator.all()).map((element) => element.boundingBox()))).filter((box) => box !== null);
  const pad = 16;
  const x = Math.max(0, Math.min(...boxes.map((box) => box.x)) - pad);
  const y = Math.max(0, Math.min(...boxes.map((box) => box.y)) - pad);
  const right = Math.max(...boxes.map((box) => box.x + box.width)) + pad;
  const bottom = Math.max(...boxes.map((box) => box.y + box.height)) + pad;
  return { x: Math.floor(x), y: Math.floor(y), width: Math.ceil(right - x), height: Math.ceil(bottom - y) };
}

test.describe('touch reference screens', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  for (const theme of themes) {
    test(`${theme} mobile`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await open(page, { theme });
      expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true);
      const task = page.locator('#prose input[type="checkbox"]:not(:disabled)').first();
      await expect(task).toHaveCSS('width', '44px');
      for (const id of ['screen-settings', 'screen-timeline', 'screen-empty', 'toggle-group', 'prose']) {
        const section = page.locator(`#${id}`);
        // Chromium can clear touch emulation when capturing beyond the viewport.
        const box = (await section.boundingBox())!;
        await page.setViewportSize({ width: 390, height: Math.max(844, Math.ceil(box.height)) });
        await expect(section).toHaveScreenshot(`${id}-${theme}-mobile.png`, options);
        await expect(task).toHaveCSS('width', '44px');
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await page.locator('#popover').getByRole('button', { name: 'Add reaction', exact: true }).tap();
      await expect(page.locator('.reaction-popup')).toHaveScreenshot(`overlay-reactions-${theme}-mobile.png`, options);
      await page.keyboard.press('Escape');
      await page.locator('#menu').getByRole('button', { name: 'More actions', exact: true }).tap();
      await expect(page.getByRole('menu')).toHaveScreenshot(`overlay-menu-${theme}-mobile.png`, options);
    });
  }
});

for (const theme of themes) {
  for (const size of sizes) {
    test(`${theme} ${size}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await open(page, { theme, size });
      await expect(page.locator('#button [data-loading-visible]')).toHaveCount(4);
      // At xs, only the sections with xs: the rest render at sm, as in the sm screenshots.
      // The reference screens are md at every size, so they are captured at md only.
      const selector = size === 'xs' ? 'main > section[id][data-xs]' : size === 'sm' ? 'main > section[id]:not([data-screen])' : 'main > section[id]';
      const ids = await page.locator(selector).evaluateAll((sections) => sections.map((section) => section.id));
      for (const id of ids) {
        await expect(page.locator(`#${id}`), id).toHaveScreenshot(`${id}-${theme}-${size}.png`, options);
      }
    });

    // Overlays have no xs: at xs they are the sm screenshots.
    if (size === 'xs') continue;
    test(`${theme} ${size} action highlights`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await open(page, { theme, size });
      await expect(page.locator('#button [data-loading-visible]')).toHaveCount(4);
      for (const variant of ['primary', 'neutral', 'ghost', 'danger']) {
        const row = page.locator(`#button [data-variant="${variant}"]`);
        const button = row.locator('button').first();
        const name = `highlight-button-${variant}-${theme}-${size}.png`;
        await button.hover();
        await expect(row).toHaveScreenshot(name, options);
        await page.mouse.down();
        await expect(row).toHaveScreenshot(name, options);
        await page.mouse.up();
      }
    });

    test(`${theme} ${size} field focus`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      for (const [name, selector] of [
        ['input', '#input .mu-input-root'],
        ['textarea', '#textarea .mu-textarea'],
        ['combobox', '#combobox .mu-input-root'],
      ] as const) {
        await open(page, { theme, size });
        const field = page.locator(selector).first();
        const control = name === 'textarea' ? field : field.locator('input');
        const edge = await field.evaluate((element) => getComputedStyle(element).borderTopColor);
        await control.focus();
        await expect(control).toBeFocused();
        await expect(field).toHaveCSS('border-top-color', edge);
        await expect(page).toHaveScreenshot(`focus-${name}-${theme}-${size}.png`, { ...options, clip: await around(field) });
      }
    });

    test(`${theme} ${size} overlays`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      for (const overlay of overlays) {
        await open(page, { theme, size });
        await expect(page.locator('#button [data-loading-visible]')).toHaveCount(4);
        await overlay.open(page);
        const shot = overlay.shot(page);
        if (overlay.union) await expect(shot).toHaveCount(2);
        for (const element of await shot.all()) await expect(element).toBeVisible();
        await expect.poll(() => shot.evaluateAll((elements) => elements.every((element) =>
          !element.matches('[data-starting-style], [data-ending-style]')
          && element.getAnimations({ subtree: true }).every((animation) => !(animation instanceof CSSTransition) || animation.playState === 'finished' || animation.playState === 'idle'),
        ))).toBe(true);
        const name = `overlay-${overlay.name}-${theme}-${size}.png`;
        if (overlay.union) await expect(page, overlay.name).toHaveScreenshot(name, { ...options, clip: await around(shot) });
        else await expect(shot, overlay.name).toHaveScreenshot(name, options);
      }
    });
  }
}
