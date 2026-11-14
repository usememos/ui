import { expect, test } from '@playwright/test';
import { open } from './helpers';

test('Toast: shows a toast with its action, and the X closes it', async ({ page }) => {
  await open(page);
  await page.locator('#toast').getByRole('button', { name: 'Archive' }).click();
  const toast = page.locator('.mu-toast', { hasText: 'Note archived' });
  await expect(toast).toBeVisible();
  await expect(toast.getByRole('button', { name: 'Undo' })).toBeVisible();
  // Top right, space-6 from the edges, once it has slid in.
  await expect.poll(async () => toast.boundingBox().then((box) => [Math.round(box!.y), Math.round(page.viewportSize()!.width - box!.x - box!.width)])).toEqual([24, 24]);
  // Base UI hides the X from screen readers; Escape and F6 reach the toast instead.
  await toast.locator('.mu-toast-close').click();
  await expect(toast).toHaveCount(0);
});

test('Toast: a toast behind hides its text at once and shows its edge; fanned out, it shows both again', async ({ page }) => {
  await open(page);
  const triggers = page.locator('#toast');
  await triggers.getByRole('button', { name: 'Archive' }).click();
  await triggers.getByRole('button', { name: 'Save' }).click();
  await page.mouse.move(5, 5);
  // Archive's toast is taller than Save's; its text must not fade out below the shorter front toast.
  const behind = page.locator('.mu-toast', { hasText: 'Note archived' }).locator('.mu-toast-content');
  await expect(behind).toHaveAttribute('data-behind', '');
  await expect(behind).toHaveCSS('transition-duration', '0s');
  await expect(behind).toHaveCSS('opacity', '0');
  // The 1px `edge` (oklch(0.858 0.006 95) in Light) keeps the peek visible.
  await expect(behind.locator('..')).toHaveCSS('border-top-color', 'oklch(0.858 0.006 95)');
  await page.locator('.mu-toast', { hasText: 'Settings saved' }).hover();
  await expect(behind).toHaveAttribute('data-expanded', '');
  await expect(behind).toHaveCSS('opacity', '1');
  await expect(behind.locator('..')).toHaveCSS('border-top-color', 'oklch(0.858 0.006 95)');
});
