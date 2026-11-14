import { expect, test } from '@playwright/test';
import { open } from './helpers';

test('Switch: only the knob position moves and reduced motion has no transition', async ({ page }) => {
  await open(page);
  const thumb = page.locator('#switch .mu-switch-thumb').first();
  await expect(thumb.locator('..')).toHaveCSS('transition-duration', '0s');
  await expect(thumb).toHaveCSS('transition-property', 'translate');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(thumb).toHaveCSS('transition-duration', '0s');
});
