// Memos UI inside an app's own CSS (playground/interop.css): the --mu- prefix,
// the mu cascade layer and app themes, as docs/building.md and color.md describe,
// and an app's own parts styled with the class functions (docs/custom-components.md).
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

/** Computed values of `properties` on the element `selector` finds. */
const styles = (page: Page, selector: string, properties: string[]) =>
  page.locator(selector).first().evaluate((element, properties) => {
    const style = getComputedStyle(element);
    return Object.fromEntries(properties.map((name) => [name, style.getPropertyValue(name)]));
  }, properties);

const box = ['background-color', 'box-shadow', 'border-top-left-radius', 'font-size', 'line-height', 'font-weight', 'color'];

for (const theme of ['light', 'dark', 'contrast']) {
  test(`class functions give an app's own parts the component's look in ${theme}`, async ({ page }) => {
    await page.goto(`/interop.html?theme=${theme}`);
    const same = async (component: string, custom: string, properties: string[]) => {
      expect(await styles(page, custom, properties), custom).toEqual(await styles(page, component, properties));
    };
    await same('#badge', '#badge-custom', [...box, 'height', 'padding-left']);
    await same('.mu-input-root:has(#input)', '#input-custom', [...box, 'height', 'padding-left']);
    await same('#textarea', '#textarea-custom', [...box, 'min-height', 'padding-top', 'padding-left']);

    await page.locator('#menu-trigger').click();
    await expect(page.getByRole('menu')).toBeVisible();
    await same('[role="menu"]', '#menu-custom', [...box, 'padding-top', 'min-width']);
    await same('[role="menuitem"]', '#menu-custom-item', [...box, 'height', 'padding-left']);
    await page.keyboard.press('Escape');

    await page.locator('#popover-trigger').click();
    await expect(page.locator('.mu-popover-popup[role="dialog"]')).toBeVisible();
    await same('.mu-popover-popup[role="dialog"]', '#popover-custom', [...box, 'padding-top', 'width']);
    await same('.mu-popover-popup[role="dialog"] h2', '#popover-custom h2', ['font-size', 'line-height', 'font-weight', 'color']);
  });
}

test("an app's own parts show states from attributes", async ({ page }) => {
  await page.goto('/interop.html');
  // A menu row the app highlights itself gets `hover` (#ededed in Light).
  await expect(page.locator('#menu-custom-active')).toHaveCSS('background-color', 'rgb(237, 237, 237)');
  await expect(page.locator('#menu-custom-item')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');

  // A field's ring shows while anything inside it has focus.
  const field = page.locator('#input-custom');
  await expect(field).toHaveCSS('outline-style', 'none');
  await page.getByRole('textbox', { name: 'Custom tag' }).focus();
  await expect(field).toHaveCSS('outline-style', 'solid');
  await page.getByRole('textbox', { name: 'Custom note' }).focus();
  await expect(page.locator('#textarea-custom')).toHaveCSS('outline-style', 'solid');

  // aria-invalid and aria-disabled on the box.
  await field.evaluate((element) => element.setAttribute('aria-invalid', 'true'));
  // The edge turns `danger`, oklch(0.53 0.19 27) in Light.
  await expect(field).toHaveCSS('box-shadow', /^oklch\(0\.53 0\.19 27\) 0px 0px 0px 1px inset/);
  await field.evaluate((element) => element.setAttribute('aria-disabled', 'true'));
  await expect(field).toHaveCSS('opacity', '0.45');
});
