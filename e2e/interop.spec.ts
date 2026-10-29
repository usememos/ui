// Memos UI inside an app's own CSS (playground/interop.css): the --mu- prefix,
// the mu cascade layer and app themes, as docs/building.md and color.md describe.
import { expect, type Page, test } from '@playwright/test';

/** A custom property's value on the root element. */
const rootVar = (page: Page, name: string) => page.locator('html').evaluate((element, name) => getComputedStyle(element).getPropertyValue(name).trim(), name);

test("the app's own variables don't reach the components", async ({ page }) => {
  await page.goto('/interop.html');
  const button = page.locator('#primary');
  // The app sets --primary, --radius-md, --font-sans and --space-3; the button reads only --mu- tokens.
  await expect(button).toHaveCSS('background-color', 'rgb(31, 31, 31)');
  await expect(button).toHaveCSS('border-top-left-radius', '6px');
  await expect(button).toHaveCSS('padding-left', '12px');
  expect(await button.evaluate((element) => getComputedStyle(element).fontFamily)).toMatch(/^system-ui,/);
  // And the tokens don't overwrite the app's variables.
  expect(await rootVar(page, '--primary')).toBe('rgb(255, 0, 0)');
});

test('components win over a reset in an earlier layer', async ({ page }) => {
  await page.goto('/interop.html');
  const button = page.locator('#primary');
  // The base layer's reset sets padding 0, a transparent background and square corners on every button.
  await expect(button).toHaveCSS('height', '32px');
  await expect(button).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
});

test('utility classes in a later layer and unlayered app rules override a component', async ({ page }) => {
  await page.goto('/interop.html');
  // The button sets its own padding and height; .px-8 and :where(.app-tall) still win.
  const utility = page.locator('#utility');
  await expect(utility).toHaveCSS('padding-left', '32px');
  expect(await utility.evaluate((element) => element.getBoundingClientRect().width)).toBe(400);
  await expect(page.locator('#unlayered')).toHaveCSS('height', '48px');
});

test('an app theme overrides the tokens it sets and keeps Light for the rest', async ({ page }) => {
  await page.goto('/interop.html?theme=paper');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'paper');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(245, 237, 228)');
  await expect(page.locator('#primary')).toHaveCSS('background-color', 'rgb(60, 40, 30)');
  expect(await rootVar(page, '--mu-ink')).toBe('#1a1a1a');
});

test('an app theme reaches popups, which render outside the app root', async ({ page }) => {
  await page.goto('/interop.html?theme=paper');
  await page.locator('#menu-trigger').click();
  const popup = page.getByRole('menu');
  await expect(popup).toBeVisible();
  await expect(popup).toHaveCSS('background-color', 'rgb(251, 246, 240)');
});
