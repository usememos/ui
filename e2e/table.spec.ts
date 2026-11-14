import { expect, test } from '@playwright/test';
import { open } from './helpers';

test('Table: a Menu trigger in a row does not make the row taller than its text', async ({ page }) => {
  for (const size of ['sm', 'md'] as const) {
    await open(page, { size });
    const cell = page.locator('#table tbody td').first();
    const [cellHeight, textHeight] = await cell.evaluate((element) => {
      const style = getComputedStyle(element);
      return [element.clientHeight, parseFloat(style.lineHeight) + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)];
    });
    expect(Math.abs(cellHeight - textHeight), size).toBeLessThanOrEqual(1);
  }
});

test('Table: bordered boxes the table, and the plain one has no edge', async ({ page }) => {
  await open(page);
  const scrolls = page.locator('#table .mu-table-scroll');
  await expect(scrolls.nth(0)).toHaveCSS('border-top-width', '0px');
  await expect(scrolls.nth(1)).toHaveCSS('border-top-width', '1px');
});

test('Table: a bordered head row sits on canvas, and Table.Actions keeps the row height', async ({ page }) => {
  await open(page);
  const bordered = page.locator('#table .mu-table-bordered');
  const canvas = await bordered.evaluate((element) => getComputedStyle(element).getPropertyValue('--mu-canvas').trim());
  expect(canvas).toBe('oklch(0.982 0.004 95)');
  await expect(bordered.locator('th').first()).toHaveCSS('background-color', 'oklch(0.982 0.004 95)');
  await expect(page.locator('#table .mu-table-scroll').first().locator('th').first()).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  // Two Buttons in Actions sit side by side and the row is as tall as a row with one Button in its Cell.
  const actionsRow = bordered.locator('tbody tr').first();
  const buttons = actionsRow.locator('[data-actions] button');
  const [first, second] = [await buttons.nth(0).boundingBox(), await buttons.nth(1).boundingBox()];
  expect(Math.round(first!.y)).toBe(Math.round(second!.y));
  const singleRow = page.locator('#table .mu-table-scroll').first().locator('tbody tr').first();
  expect(Math.round((await actionsRow.boundingBox())!.height)).toBe(Math.round((await singleRow.boundingBox())!.height));
});
