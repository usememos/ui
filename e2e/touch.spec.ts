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
  for (const size of ['sm', 'md'] as const) {
    test(`Prose task targets reserve 44px without overlap at ${size} in ${theme}`, async ({ page }) => {
      await open(page, { theme, size });
      const tasks = page.locator('#prose input[type="checkbox"]:not(:disabled)');
      const boxes = [];
      for (const task of await tasks.all()) {
        await task.scrollIntoViewIfNeeded();
        const box = (await task.boundingBox())!;
        expect([box.width, box.height]).toEqual([44, 44]);
        const mark = await task.evaluate((element) => {
          const style = getComputedStyle(element, '::before');
          return [parseFloat(style.width), parseFloat(style.height)];
        });
        expect(mark).toEqual([16, 16]);
        const before = await tasks.evaluateAll((elements) => elements.map((element) => (element as HTMLInputElement).checked));
        for (const x of [box.x + 1, box.x + box.width - 1]) {
          await page.touchscreen.tap(x, box.y + box.height / 2);
          await expect(task).toBeChecked({ checked: !before[boxes.length] });
          await page.touchscreen.tap(x, box.y + box.height / 2);
        }
        expect(await tasks.evaluateAll((elements) => elements.map((element) => (element as HTMLInputElement).checked))).toEqual(before);
        boxes.push(box);
      }
      expect(boxes[1]!.y).toBeGreaterThanOrEqual(boxes[0]!.y + boxes[0]!.height);
      const row = tasks.first().locator('..');
      expect(await row.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
      const readOnly = page.locator('#prose input[type="checkbox"]:disabled');
      expect((await readOnly.boundingBox())!.height).toBe(16);
      expect((await readOnly.boundingBox())!.x).toBeCloseTo((await tasks.first().boundingBox())!.x + 14, 0);
    });
  }

  test(`touch: option rows reserve 44px in ${theme}`, async ({ page }) => {
    await open(page, { theme, size: 'sm' });
    await page.locator('#menu').getByRole('button', { name: 'More actions', exact: true }).tap();
    await expect(page.getByRole('menu')).toBeVisible();
    for (const item of await page.getByRole('menuitem').all()) {
      expect(Math.round((await item.boundingBox())!.height)).toBeGreaterThanOrEqual(44);
      await expect(item).toHaveCSS('padding-inline-start', '8px');
      await expect(item).toHaveCSS('padding-inline-end', '8px');
    }
    await page.getByRole('menuitem').first().tap();
    await expect(page.getByRole('menu')).toHaveCount(0);
    await page.locator('#select').getByRole('combobox', { name: 'Visibility', exact: true }).tap();
    await expect(page.getByRole('option').first()).toBeVisible();
    for (const item of await page.getByRole('option').all()) {
      expect(Math.round((await item.boundingBox())!.height)).toBeGreaterThanOrEqual(44);
      await expect(item).toHaveCSS('padding-inline-start', '8px');
      await expect(item).toHaveCSS('padding-inline-end', '8px');
    }
    await page.getByRole('option').first().tap();
    await expect(page.getByRole('option')).toHaveCount(0);
    await page.getByRole('combobox', { name: 'Tag', exact: true }).fill('de');
    await expect(page.getByRole('option').first()).toBeVisible();
    for (const item of await page.getByRole('option').all()) {
      expect(Math.round((await item.boundingBox())!.height)).toBeGreaterThanOrEqual(44);
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
