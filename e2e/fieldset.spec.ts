import { expect, test } from '@playwright/test';
import { open } from './helpers';

test('Fieldset: the legend sits 8px above its options, closer than the 12px between them', async ({ page }) => {
  await open(page);
  const fieldset = page.locator('#field').getByRole('group', { name: 'Notifications' });
  const [legend, first, second] = await Promise.all([fieldset.locator('.mu-fieldset-legend').boundingBox(), fieldset.locator('.mu-field-root').nth(0).boundingBox(), fieldset.locator('.mu-field-root').nth(1).boundingBox()]);
  expect(Math.round(first!.y - (legend!.y + legend!.height))).toBe(8);
  expect(Math.round(second!.y - (first!.y + first!.height))).toBe(12);
});
