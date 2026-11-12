import { expect, test } from '@playwright/test';
import { expectNoAxeViolations, expectSystemFont, open, themes } from './helpers';

const canvas = { light: 'oklch(0.982 0.004 95)', dark: 'rgb(15, 15, 15)' };

test('defaults to Light paper with white surfaces and neutral ink', async ({ page }) => {
  await open(page, { theme: 'dark' });
  await page.locator('html').evaluate((element) => element.removeAttribute('data-theme'));
  await expect(page.locator('body')).toHaveCSS('background-color', canvas.light);
  await expect(page.locator('#depth .mu-popup')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('#depth .mu-key')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('#input .mu-input-root').first()).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('#type .mu-body')).toHaveCSS('color', 'rgb(26, 26, 26)');
});

for (const theme of themes) {
  test(`applies the ${theme} theme`, async ({ page }) => {
    await open(page, { theme });
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await expect(page.locator('body')).toHaveCSS('background-color', canvas[theme]);
  });

  test(`has no axe violations in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    await expectNoAxeViolations(page, 'main');
  });
}

test('loads no web fonts: text uses the system UI font', async ({ page }) => {
  await open(page);
  // The only font faces are the local() alias of Segoe UI, which loads no file.
  expect(await page.evaluate(() => [...new Set([...document.fonts].map((face) => face.family.replace(/"/g, '')))])).toEqual(['Segoe UI (mu)']);
  expect(await page.evaluate(() => performance.getEntriesByType('resource').filter((entry) => /\.(woff2?|ttf|otf)(\?|$)/.test(entry.name)).length)).toBe(0);
  await expectSystemFont(page.locator('main'));
});

test('sizes set the control height', async ({ page }) => {
  await open(page);
  const heights = await page.locator('#sizes .pg-control').evaluateAll((controls) => controls.map((control) => control.getBoundingClientRect().height));
  expect(heights).toEqual([20, 24, 32]);
});
