import { expect, test } from '@playwright/test';
import { open } from './helpers';

test('Drawer: slides from its edge, closes on Escape, and returns focus', async ({ page }) => {
  await open(page);
  const trigger = page.getByRole('button', { name: 'Open navigation' });
  await trigger.click();
  const drawer = page.getByRole('dialog', { name: 'Navigation' });
  await expect(drawer).toBeVisible();
  // Poll until it has slid in: the transition starts a frame after the drawer mounts.
  await expect.poll(async () => drawer.boundingBox().then((box) => box!.x)).toBe(0);
  expect((await drawer.boundingBox())!.height).toBe(page.viewportSize()!.height);
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
  await expect(trigger).toBeFocused();
  await page.getByRole('button', { name: 'Note details' }).click();
  const details = page.getByRole('dialog', { name: 'Note details' });
  await expect(details).toBeVisible();
  await expect.poll(async () => details.boundingBox().then((box) => Math.round(box!.x + box!.width))).toBe(page.viewportSize()!.width);
  expect(Math.round((await details.boundingBox())!.width)).toBe(320);
  await details.getByRole('button', { name: 'Close' }).click();
  await expect(details).toBeHidden();
});

test('Drawer: bare content is the drawer height, the side drawer has an inner edge, and a hidden Close', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  const drawer = page.getByRole('dialog', { name: 'Navigation' });
  await expect.poll(async () => drawer.boundingBox().then((box) => box!.x)).toBe(0);
  await expect(drawer).toHaveCSS('border-right-width', '1px');
  const content = drawer.locator('.mu-drawer-content');
  expect(Math.round((await content.boundingBox())!.height)).toBe(page.viewportSize()!.height);
  const close = drawer.locator('.mu-drawer-sr-close');
  await expect(close).toHaveAttribute('tabindex', '-1');
  await expect(close).toHaveText('Close');
  await close.dispatchEvent('click');
  await expect(drawer).toBeHidden();
});
