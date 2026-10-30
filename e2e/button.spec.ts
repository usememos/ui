import { expect, test } from '@playwright/test';
import { open } from './helpers';

const save = (page: import('@playwright/test').Page) => page.locator('#button [data-variant="neutral"] button').first();

test('sizes set the height', async ({ page }) => {
  for (const [size, height] of [['sm', 24], ['md', 32]] as const) {
    await open(page, { size });
    expect((await save(page).boundingBox())?.height).toBe(height);
  }
});

test('shows the focus ring on keyboard focus only', async ({ page }) => {
  await open(page);
  const button = save(page);
  await button.click();
  await expect(button).toHaveCSS('outline-style', 'none');
  await button.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS('outline-style', 'solid');
  await expect(button).toHaveCSS('outline-width', '2px');
});

test('Enter and Space press it', async ({ page }) => {
  await open(page);
  const button = save(page);
  await button.evaluate((element) => {
    (window as unknown as { presses: number }).presses = 0;
    element.addEventListener('click', () => (window as unknown as { presses: number }).presses++);
  });
  await button.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Space');
  expect(await page.evaluate(() => (window as unknown as { presses: number }).presses)).toBe(2);
});

test('sinks while held', async ({ page }) => {
  await open(page);
  const button = save(page);
  const box = (await button.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(button).toHaveCSS('translate', '0px 0.5px');
  await page.mouse.up();
});

test('does not move under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  const button = save(page);
  const box = (await button.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(button).not.toHaveCSS('box-shadow', 'none');
  await expect(button).toHaveCSS('translate', 'none');
  await page.mouse.up();
});

test('stays focusable while loading, keeps its width and ignores presses', async ({ page }) => {
  await open(page);
  const row = page.locator('#button [data-variant="neutral"]');
  const loading = row.locator('button[data-loading]');
  const idle = row.locator('button').first();
  expect((await loading.boundingBox())?.width).toBe((await idle.boundingBox())?.width);
  await expect(loading).toHaveAttribute('aria-busy', 'true');
  await loading.focus();
  await expect(loading).toBeFocused();
});

test.describe('on a touch screen', () => {
  test.use({ hasTouch: true, isMobile: true });

  test('the hit area reaches 44px', async ({ page }) => {
    await open(page, { size: 'sm' });
    const after = await save(page).evaluate((element) => {
      const style = getComputedStyle(element, '::after');
      return [parseFloat(style.width), parseFloat(style.height)];
    });
    expect(after[0]).toBeGreaterThanOrEqual(44);
    expect(after[1]).toBe(44);
  });
});
