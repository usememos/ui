import { expect, test, type Locator } from '@playwright/test';
import { open, themes } from './helpers';

test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });

const geometry = (parts: Locator) => parts.evaluateAll((elements) => elements.map((element) => {
  const { width, height } = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  return {
    className: element.getAttribute('class'), width, height,
    padding: style.padding, margin: style.margin, gap: style.gap,
    fontSize: style.fontSize, lineHeight: style.lineHeight, radius: style.borderRadius,
    after: getComputedStyle(element, '::after').content,
  };
}));

for (const theme of themes) {
  for (const size of ['xs', 'sm', 'md'] as const) {
    test(`${theme} ${size}: mouse and touch keep identical control and overlay geometry`, async ({ browser }) => {
      const mouse = await browser.newContext({ viewport: { width: 1000, height: 800 }, hasTouch: false, reducedMotion: 'reduce' });
      const touch = await browser.newContext({ viewport: { width: 1000, height: 800 }, hasTouch: true, reducedMotion: 'reduce' });
      try {
        const pages = [await mouse.newPage(), await touch.newPage()];
        for (const [index, page] of pages.entries()) {
          await open(page, { theme, size });
          expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(index === 1);
        }
        const selectors = '.mu-button, .mu-input-root, .mu-input, .mu-textarea, .mu-select-trigger, .mu-combobox-trigger, .mu-checkbox, .mu-radio, .mu-switch, .mu-toggle, .mu-segmented, .mu-segmented-item, .mu-list-item-button';
        const desktop = await geometry(pages[0]!.locator(selectors));
        expect(desktop.length).toBeGreaterThan(0);
        expect(await geometry(pages[1]!.locator(selectors))).toEqual(desktop);
        for (const page of pages) {
          const input = page.locator('#input').getByRole('textbox', { name: 'Title', exact: true });
          if (page === pages[1]) await input.tap();
          else await input.click();
          await expect(input).toHaveCSS('font-size', size === 'md' ? '14px' : '13px');
        }
        expect(await geometry(pages[1]!.locator(selectors))).toEqual(await geometry(pages[0]!.locator(selectors)));

        for (const overlay of [
          { section: '#menu', trigger: 'More actions', popup: '.mu-menu-popup' },
          { section: '#select', trigger: 'Visibility', popup: '.mu-select-popup', role: 'combobox' },
          { section: '#combobox', trigger: 'Choose icon', popup: '.mu-popover-popup' },
          { section: '#popover', trigger: 'Add reaction', popup: '.reaction-popup' },
          { section: '#dialog', trigger: 'Centered panel', popup: '.mu-dialog-popup' },
          { section: '#drawer', trigger: 'Note details', popup: '.mu-drawer-popup' },
        ] as const) {
          for (const page of pages) {
            await page.locator(overlay.section).getByRole(overlay.role ?? 'button', { name: overlay.trigger, exact: true }).click();
            await expect(page.locator(overlay.popup)).toBeVisible();
          }
          const parts = `${overlay.popup}, ${overlay.popup} [class*="mu-"], ${overlay.popup} .reaction-options`;
          expect(await geometry(pages[1]!.locator(parts)), overlay.trigger).toEqual(await geometry(pages[0]!.locator(parts)));
          for (const page of pages) {
            await page.keyboard.press('Escape');
            await expect(page.locator(overlay.popup)).toBeHidden();
          }
        }
      } finally {
        await mouse.close();
        await touch.close();
      }
    });
  }
}

for (const size of ['xs', 'sm', 'md'] as const) {
  test(`touch: ${size} formatting controls receive their own taps`, async ({ page }) => {
    await open(page, { size });
    const group = page.locator('#toggle-group').getByRole('group', { name: 'Formatting', exact: true });
    for (const button of await group.getByRole('button').all()) {
      await button.scrollIntoViewIfNeeded();
      const box = (await button.boundingBox())!;
      const height = { xs: 20, sm: 24, md: 32 }[size];
      expect(box.width).toBe(height);
      expect(box.height).toBe(height);
      const before = await group.getByRole('button').evaluateAll((buttons) => buttons.map((element) => element.getAttribute('aria-pressed')));
      const index = await button.evaluate((element) => [...element.parentElement!.querySelectorAll('button')].findIndex((button) => button === element));
      for (const x of [box.x + 1, box.x + box.width / 2, box.x + box.width - 1]) {
        await page.touchscreen.tap(x, box.y + box.height / 2);
        const after = await group.getByRole('button').evaluateAll((buttons) => buttons.map((element) => element.getAttribute('aria-pressed')));
        expect(after).toEqual(before.map((pressed, i) => i === index ? String(pressed !== 'true') : pressed));
        await page.touchscreen.tap(x, box.y + box.height / 2);
      }
    }
  });
}

for (const theme of themes) {
  test(`touch: sm option rows stay 28px in ${theme}`, async ({ page }) => {
    await open(page, { theme, size: 'sm' });
    await page.locator('#menu').getByRole('button', { name: 'More actions', exact: true }).tap();
    await expect(page.getByRole('menu')).toBeVisible();
    for (const item of await page.getByRole('menuitem').all()) {
      expect(Math.round((await item.boundingBox())!.height)).toBe(28);
      await expect(item).toHaveCSS('padding-inline-start', '8px');
      await expect(item).toHaveCSS('padding-inline-end', '8px');
    }
    await page.getByRole('menuitem').first().tap();
    await expect(page.getByRole('menu')).toHaveCount(0);
    await page.locator('#select').getByRole('combobox', { name: 'Visibility', exact: true }).tap();
    await expect(page.getByRole('option').first()).toBeVisible();
    for (const item of await page.getByRole('option').all()) {
      expect(Math.round((await item.boundingBox())!.height)).toBe(28);
      await expect(item).toHaveCSS('padding-inline-start', '8px');
      await expect(item).toHaveCSS('padding-inline-end', '8px');
    }
    await page.getByRole('option').first().tap();
    await expect(page.getByRole('option')).toHaveCount(0);
    await page.getByRole('combobox', { name: 'Tag', exact: true }).fill('de');
    await expect(page.getByRole('option').first()).toBeVisible();
    for (const item of await page.getByRole('option').all()) {
      expect(Math.round((await item.boundingBox())!.height)).toBe(28);
      await expect(item).toHaveCSS('padding-inline-start', '8px');
      await expect(item).toHaveCSS('padding-inline-end', '8px');
    }
  });

  for (const width of [320, 390]) {
    test(`component fixtures fit ${width}px in ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await open(page, { theme });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      for (const screen of await page.locator('main > section').all()) {
        const box = (await screen.boundingBox())!;
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width);
      }
    });
  }
}
