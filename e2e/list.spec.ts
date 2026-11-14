import { expect, test } from '@playwright/test';
import { open } from './helpers';

test('List: one edge around the rows, a line between them, and the Switch at the end of a settings row', async ({ page }) => {
  await open(page);
  const list = page.getByRole('list', { name: 'Preferences' });
  await expect(list).toHaveCSS('border-top-width', '1px');
  await expect(list).toHaveCSS('list-style-type', 'none');
  const rows = list.locator(':scope > li');
  await expect(rows.first()).toHaveCSS('border-top-width', '0px');
  await expect(rows.nth(1)).toHaveCSS('border-top-width', '1px');
  const [rowEnd, switchEnd] = await rows.first().evaluate((row) => {
    const control = row.querySelector('[role="switch"]')!;
    const padding = parseFloat(getComputedStyle(row).paddingRight);
    return [row.getBoundingClientRect().right - padding, control.getBoundingClientRect().right];
  });
  expect(Math.abs(rowEnd - switchEnd)).toBeLessThanOrEqual(1);
});

test('List: an ItemButton fills its row and highlights on hover', async ({ page }) => {
  await open(page);
  const list = page.locator('[data-item-buttons]');
  const row = list.locator(':scope > li').first();
  const button = row.locator(':scope > a');
  const [rowBox, buttonBox] = [await row.boundingBox(), await button.boundingBox()];
  expect(Math.round(buttonBox!.width)).toBe(Math.round(rowBox!.width));
  expect(Math.round(buttonBox!.height)).toBe(Math.round(rowBox!.height));
  await button.hover();
  await expect(button).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
});
