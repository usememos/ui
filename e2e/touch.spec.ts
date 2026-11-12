import { expect, test } from '@playwright/test';
import { open, themes } from './helpers';

test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });

for (const size of ['xs', 'sm', 'md'] as const) {
  test(`touch: ${size} formatting controls receive their own taps`, async ({ page }) => {
    await open(page, { size });
    const group = page.locator('#toggle-group').getByRole('group', { name: 'Formatting', exact: true });
    for (const button of await group.getByRole('button').all()) {
      await button.scrollIntoViewIfNeeded();
      const box = (await button.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
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
  test(`touch: option rows reserve 44px in ${theme}`, async ({ page }) => {
    await open(page, { theme, size: 'sm' });
    await page.locator('#menu').getByRole('button', { name: 'More actions', exact: true }).tap();
    await expect(page.getByRole('menu')).toBeVisible();
    for (const item of await page.getByRole('menuitem').all()) {
      expect(Math.round((await item.boundingBox())!.height)).toBeGreaterThanOrEqual(44);
    }
    await page.getByRole('menuitem').first().tap();
    await expect(page.getByRole('menu')).toHaveCount(0);
    await page.locator('#select').getByRole('combobox', { name: 'Visibility', exact: true }).tap();
    await expect(page.getByRole('option').first()).toBeVisible();
    for (const item of await page.getByRole('option').all()) {
      expect(Math.round((await item.boundingBox())!.height)).toBeGreaterThanOrEqual(44);
    }
    await page.getByRole('option').first().tap();
    await expect(page.getByRole('option')).toHaveCount(0);
    await page.getByRole('combobox', { name: 'Tag', exact: true }).fill('de');
    await expect(page.getByRole('option').first()).toBeVisible();
    for (const item of await page.getByRole('option').all()) {
      expect(Math.round((await item.boundingBox())!.height)).toBeGreaterThanOrEqual(44);
    }
  });

  for (const width of [320, 390]) {
    test(`reference screens fit ${width}px in ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await open(page, { theme });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      for (const screen of await page.locator('.pg-screen').all()) {
        const box = (await screen.boundingBox())!;
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width);
      }
    });
  }
}
