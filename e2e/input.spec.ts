import { expect, test } from '@playwright/test';
import { open } from './helpers';

test('Input: the label focuses the input while the box keeps its quiet edge', async ({ page }) => {
  await open(page);
  await page.locator('#field label', { hasText: 'Name' }).click();
  const input = page.getByRole('textbox', { name: 'Name' });
  await expect(input).toBeFocused();
  const box = page.locator('#field .mu-input-root').first();
  // Typing focus uses the caret; the existing border stays quiet.
  await expect(box).toHaveCSS('border-top-color', 'oklch(0.858 0.006 95)');
  // The border provides focus; no external outline or shadow.
  await expect(box).toHaveCSS('outline-style', 'none');
});
