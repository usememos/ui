import { expect, test } from '@playwright/test';
import { open } from './helpers';

test('Tooltip: opens at once on keyboard focus, and names the trigger', async ({ page }) => {
  await open(page);
  const pin = page.locator('#tooltip').getByRole('button', { name: 'Archive' });
  await pin.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  // The previous button's tooltip may still be fading out, so look for the open one.
  const tooltip = page.locator('.mu-tooltip-popup[data-open]');
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveText('Archive⌘ E');
});

test('custom Trigger delay opens on hover and Escape dismisses it', async ({ page }) => {
  await open(page);
  const trigger = page.locator('#tooltip').getByRole('button', { name: 'Short delay', exact: true });
  await trigger.hover();
  const popup = page.locator('.mu-tooltip-popup');
  await expect(popup).toHaveText('Short delay');
  await page.keyboard.press('Escape');
  await expect(popup).toBeHidden();
});
