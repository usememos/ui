import { expect, test } from '@playwright/test';
import { open } from './helpers';

test('Popover: opens below its trigger and returns focus on Escape', async ({ page }) => {
  await open(page);
  const trigger = page.locator('#popover').getByRole('button', { name: 'Share' });
  await trigger.click();
  const popup = page.getByRole('dialog', { name: 'Share this note' });
  await expect(popup).toBeVisible();
  await expect(popup).toHaveCSS('outline-style', 'none');
  const [t, p] = await Promise.all([trigger.boundingBox(), popup.boundingBox()]);
  expect(p!.y).toBeGreaterThan(t!.y + t!.height);
  await page.keyboard.press('Escape');
  await expect(popup).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('Popover list: rows drawn with menuClasses on a button and a link start their text at the start edge', async ({ page }) => {
  await open(page);
  await page.locator('#popover').getByRole('button', { name: 'Account' }).click();
  const popup = page.locator('.mu-popover-popup');
  expect(await popup.evaluate((element) => { const style = getComputedStyle(element); return parseFloat(style.paddingTop) + parseFloat(style.borderTopWidth); })).toBe(6);
  await expect(popup).toHaveCSS('row-gap', '0px');
  for (const row of [popup.getByRole('button', { name: 'Settings' }), popup.getByRole('link', { name: 'Sign out' })]) {
    await expect(row).toHaveCSS('text-align', 'start');
    await expect(row).toHaveCSS('height', '32px');
    const [rowBox, popupBox] = await Promise.all([row.boundingBox(), popup.boundingBox()]);
    expect(Math.round(rowBox!.width)).toBe(Math.round(popupBox!.width - 12));
  }
});

test('Popover list: a row that opens a Menu beside the panel lines its first choice up with the row', async ({ page }) => {
  // No rise on open, so the boxes are measured where they come to rest.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  await page.locator('#popover').getByRole('button', { name: 'Account' }).click();
  const row = page.locator('.mu-popover-popup').getByRole('button', { name: /Theme/ });
  await row.click();
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  await expect(menu).toHaveAttribute('data-side', 'inline-end');
  await expect(menu).toHaveAttribute('data-align', 'start');
  const [rowBox, first, panel, menuBox] = await Promise.all([row.boundingBox(), menu.getByRole('menuitemradio').first().boundingBox(), page.locator('.mu-popover-popup').boundingBox(), menu.boundingBox()]);
  expect(first!.y).toBeCloseTo(rowBox!.y, 0);
  expect(menuBox!.x).toBeCloseTo(panel!.x + panel!.width, 0); // The row keeps its highlight while its menu is open.
  await expect(row).toHaveAttribute('data-popup-open', '');
  expect(await row.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
});

test('Popover list: a row\'s Menu that opens upward lines its last choice up with the row', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  // Taller choices and a window that ends just below the row leave no room below.
  await page.addStyleTag({ content: '#popover { position: fixed; inset: 0 auto auto 24px; margin: 0; } .mu-menu-popup .mu-menu-item { height: 60px; }' });
  await page.locator('#popover').getByRole('button', { name: 'Account' }).click();
  const row = page.locator('.mu-popover-popup').getByRole('button', { name: /Theme/ });
  const box = await row.boundingBox();
  await page.setViewportSize({ width: 1000, height: Math.round(box!.y + box!.height + 60) });
  await row.click();
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  await expect(menu).toHaveAttribute('data-align', 'end');
  const [rowBox, last] = await Promise.all([row.boundingBox(), menu.getByRole('menuitemradio').last().boundingBox()]);
  expect(last!.y + last!.height).toBeCloseTo(rowBox!.y + rowBox!.height, 0);
});
