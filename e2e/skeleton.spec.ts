import { expect, test } from '@playwright/test';
import { open } from './helpers';

test('shimmers, and stops under reduced motion', async ({ page }) => {
  await open(page);
  const skeleton = page.locator('#skeleton .mu-skeleton').first();
  await expect(skeleton).toHaveCSS('animation-name', 'mu-shimmer');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(skeleton).toHaveCSS('animation-name', 'none');
});
