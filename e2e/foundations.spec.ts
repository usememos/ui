import { expect, test } from '@playwright/test';
import { expectNoAxeViolations, open, themes } from './helpers';

const canvas = { light: 'rgb(249, 249, 249)', dark: 'rgb(15, 15, 15)', contrast: 'rgb(255, 255, 255)' };

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
  expect(await page.evaluate(() => document.fonts.size)).toBe(0);
  expect(await page.locator('main').evaluate((element) => getComputedStyle(element).fontFamily)).toMatch(/^system-ui,/);
});

test('sizes set the control height', async ({ page }) => {
  await open(page);
  const heights = await page.locator('#sizes .pg-control').evaluateAll((controls) => controls.map((control) => control.getBoundingClientRect().height));
  expect(heights).toEqual([24, 32, 40]);
});
