import { expect, test } from '@playwright/test';
import { open } from './helpers';

test('Prose: task list checkboxes are 16px, and done items are struck through', async ({ page }) => {
  await open(page);
  const boxes = page.locator('#prose input[type="checkbox"]');
  await expect(boxes).toHaveCount(3);
  const sizes = await boxes.evaluateAll((elements) => elements.map((element) => `${element.getBoundingClientRect().width}x${element.getBoundingClientRect().height}`));
  expect(sizes).toEqual(['16x16', '16x16', '16x16']);
  await page.keyboard.press('Tab');
  const unchecked = boxes.nth(1);
  await unchecked.focus();
  await expect.poll(() => unchecked.evaluate((element) => getComputedStyle(element, '::before').borderTopColor)).toBe('rgb(26, 26, 26)');
  await page.keyboard.press('Space');
  await expect(unchecked).toBeChecked();
  await expect.poll(() => unchecked.evaluate((element) => getComputedStyle(element, '::before').borderTopColor)).toBe('rgb(255, 255, 255)');
  const done = page.locator('#prose li', { hasText: 'Ship the new editor' });
  await expect(done).toHaveCSS('text-decoration-line', 'line-through');
});
