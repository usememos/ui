import { expect, test } from '@playwright/test';
import { open } from './helpers';

test('Dialog: focus moves in, Escape closes it, and focus returns to the trigger', async ({ page }) => {
  await open(page);
  const trigger = page.getByRole('button', { name: 'Create access token' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Create access token' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('textbox')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('Dialog: the X closes it', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: 'Create access token' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('Dialog bare: content runs edge to edge with no X, and Escape closes it', async ({ page }) => {
  await open(page);
  const trigger = page.getByRole('button', { name: 'Quick find' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Quick find' });
  await expect(dialog).toHaveCSS('padding-top', '0px');
  await expect(dialog.getByRole('button', { name: 'Close' })).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('Dialog: fullScreen covers the viewport with square corners', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: 'View image' }).click();
  const dialog = page.locator('[data-full-screen]');
  await expect(dialog).toBeVisible();
  await expect.poll(async () => dialog.boundingBox().then((box) => `${Math.round(box!.x)},${Math.round(box!.y)},${Math.round(box!.width)}x${Math.round(box!.height)}`)).toBe(`0,0,${page.viewportSize()!.width}x${page.viewportSize()!.height}`);
  await expect(dialog).toHaveCSS('border-top-left-radius', '0px');
  await dialog.getByRole('button', { name: 'Close' }).click();
  await expect(dialog).toBeHidden();
});

test.describe('centered panels on coarse pointers', () => {
  test.use({ isMobile: true, hasTouch: true });
  for (const theme of ['light', 'dark'] as const) {
    for (const width of [320, 390]) {
      test(`sheet=false stays inside ${width}px in ${theme} and keeps its close control reachable`, async ({ page }) => {
        await page.setViewportSize({ width, height: 844 });
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await open(page, { theme });
        const trigger = page.getByRole('button', { name: 'Centered panel', exact: true });
        await trigger.tap();
        const popup = page.getByRole('dialog');
        const box = (await popup.boundingBox())!;
        expect(box.x).toBe(16);
        expect(box.width).toBe(width - 32);
        expect(box.x + box.width).toBe(width - 16);
        const close = popup.getByRole('button', { name: 'Close', exact: true });
        const target = (await close.boundingBox())!;
        expect(target.width).toBe(24);
        expect(target.height).toBe(24);
        await expect(popup.locator('.mu-dialog-title')).toHaveCSS('padding-inline-end', '24px');
        expect(target.x + target.width).toBeLessThanOrEqual(width);
        await close.tap();
        await expect(popup).toBeHidden();
        await expect(trigger).toBeFocused();
      });
    }
  }
});
