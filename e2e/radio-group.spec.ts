import { expect, test } from '@playwright/test';
import { open } from './helpers';

test('RadioGroup: arrow keys move the selection, and only the chosen radio is tabbable', async ({ page }) => {
  await open(page);
  const group = page.locator('#radio-group [role="radiogroup"]').first();
  const radios = group.getByRole('radio');
  await expect(radios.nth(1)).toHaveAttribute('aria-checked', 'true');
  expect(await radios.evaluateAll((elements) => elements.map((element) => element.getAttribute('tabindex')))).toEqual(['-1', '0', '-1']);
  await radios.nth(1).focus();
  await page.keyboard.press('ArrowDown');
  await expect(radios.nth(2)).toBeFocused();
  await expect(radios.nth(2)).toHaveAttribute('aria-checked', 'true');
  await page.keyboard.press('ArrowUp');
  await expect(radios.nth(1)).toHaveAttribute('aria-checked', 'true');
});

test('RadioGroup: a horizontal legend sits above the radios', async ({ page }) => {
  await open(page);
  const group = page.locator('#radio-group [role="radiogroup"][data-orientation="horizontal"]');
  const legend = (await group.locator('.mu-fieldset-legend').boundingBox())!;
  const radio = (await group.getByRole('radio').first().boundingBox())!;
  expect(radio.y).toBeGreaterThanOrEqual(legend.y + legend.height);
});
