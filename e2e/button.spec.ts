import { expect, test } from '@playwright/test';
import { open, themes } from './helpers';

const save = (page: import('@playwright/test').Page) => page.locator('#button [data-variant="neutral"] button').first();

for (const theme of themes) {
  test(`disabled ghost actions share the disabled surface in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    await page.mouse.move(0, 0);
    const row = page.locator('#button [data-variant="ghost"]');
    const disabled = row.locator('button[data-disabled]:not([data-loading])');
    const enabled = row.locator('button').first();
    const well = theme === 'light' ? 'oklch(0.934 0.008 95)' : 'rgb(37, 37, 37)';
    const edge = theme === 'light' ? 'oklch(0.858 0.006 95)' : 'rgb(52, 52, 52)';
    await expect(disabled).toBeDisabled();
    await expect(disabled).toHaveCSS('background-color', well);
    await expect(disabled).toHaveCSS('border-top-color', edge);
    await expect(enabled).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    const before = await disabled.boundingBox();
    await disabled.hover();
    await page.mouse.down();
    await expect(disabled).toHaveCSS('background-color', well);
    await expect(disabled).toHaveCSS('border-top-color', edge);
    expect(await disabled.boundingBox()).toEqual(before);
    await page.mouse.up();
  });

  test(`actions reuse their hover highlight while held without moving in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    for (const variant of ['primary', 'neutral', 'ghost', 'danger']) {
      const button = page.locator(`#button [data-variant="${variant}"] button`).first();
      await button.hover();
      await expect(button).toHaveCSS('transition-duration', '0s');
      const before = await button.boundingBox();
      const highlight = await button.evaluate((element) => {
        const style = getComputedStyle(element);
        return { fill: style.backgroundColor, edge: style.borderTopColor };
      });
      await page.mouse.down();
      await expect(button).toHaveCSS('background-color', highlight.fill);
      await expect(button).toHaveCSS('border-top-color', highlight.edge);
      await expect(button).toHaveCSS('translate', 'none');
      await expect(button).toHaveCSS('scale', 'none');
      await expect(button).toHaveCSS('filter', 'none');
      expect(await button.boundingBox()).toEqual(before);
      await page.mouse.up();
      await expect(button).toHaveCSS('border-top-color', highlight.edge);
    }
  });
}

test('sizes set the height', async ({ page }) => {
  for (const [size, height] of [['xs', 20], ['sm', 24], ['md', 32]] as const) {
    await open(page, { size });
    expect((await save(page).boundingBox())?.height).toBe(height);
  }
});

test('shows the ink border on keyboard focus only', async ({ page }) => {
  await open(page);
  const button = save(page);
  await button.click();
  await expect(button).toHaveCSS('outline-style', 'none');
  await button.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS('outline-style', 'none');
  await expect(button).toHaveCSS('border-top-width', '1px');
  await expect(button).toHaveCSS('border-top-color', 'rgb(26, 26, 26)');
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

test('changes fill without moving while held', async ({ page }) => {
  await open(page);
  const button = save(page);
  const box = (await button.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(button).toHaveCSS('translate', 'none');
  await expect(button).toHaveCSS('background-color', 'oklch(0.982 0.004 95)');
  expect(await button.boundingBox()).toEqual(box);
  await page.mouse.up();
});

test('does not move under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  const button = save(page);
  const box = (await button.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(button).toHaveCSS('box-shadow', 'none');
  await expect(button).toHaveCSS('background-color', 'oklch(0.982 0.004 95)');
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

test('delays only the spinner, keeps its width, and restores the label when work ends', async ({ page }) => {
  await page.clock.install({ time: 0 });
  await open(page);
  await page.clock.pauseAt(60_000);
  const button = page.locator('#button button').filter({ hasText: 'Save changes' });
  const before = (await button.boundingBox())!.width;
  await button.click();
  await expect(button).toHaveAttribute('aria-disabled', 'true');
  await expect(button).toHaveAttribute('aria-busy', 'true');
  await page.clock.runFor(299);
  await expect(button.locator('.mu-spinner')).toHaveCount(0);
  await expect(button.locator('.mu-button-label')).toHaveCSS('opacity', '1');
  await page.clock.runFor(1);
  await expect(button.locator('.mu-spinner')).toHaveCount(1);
  await expect(button.locator('.mu-button-label')).toHaveCSS('opacity', '0');
  expect((await button.boundingBox())!.width).toBe(before);
  await page.clock.runFor(1200);
  await expect(button).not.toHaveAttribute('aria-busy', 'true');
  await expect(button.locator('.mu-spinner')).toHaveCount(0);
  await expect(button.locator('.mu-button-label')).toHaveCSS('opacity', '1');
  expect((await button.boundingBox())!.width).toBe(before);
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
