import { expect, test, type Locator } from '@playwright/test';
import { open } from './helpers';

/** Left edge and width of the sliding key, relative to its well. */
const keyBox = (well: Locator) =>
  well.evaluate((element) => {
    const key = element.querySelector(':scope > .mu-segmented-key')!.getBoundingClientRect();
    const box = element.getBoundingClientRect();
    return { left: Math.round(key.left - box.left), width: Math.round(key.width) };
  });
const itemBox = (well: Locator, item: Locator) =>
  Promise.all([well.boundingBox(), item.boundingBox()]).then(([box, own]) => ({ left: Math.round(own!.x - box!.x), width: Math.round(own!.width) }));

test('Tabs: arrow keys move between tabs and the key follows', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  const list = page.locator('#tabs [role="tablist"]');
  const tabs = list.getByRole('tab');
  await tabs.first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(1)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#tabs [role="tabpanel"]:not([inert])')).toHaveText('What we tell you about, and how.');
  expect(await keyBox(list)).toEqual(await itemBox(list, tabs.nth(1)));
  await page.keyboard.press('ArrowLeft');
  await expect(tabs.first()).toBeFocused();
});

test('ToggleGroup: arrow keys move focus, Space picks, and the key slides', async ({ page }) => {
  await open(page);
  const group = page.locator('#toggle-group [aria-label="Show"]');
  const items = group.getByRole('button');
  await expect(group).toHaveAttribute('data-keyed', '');
  await items.first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(items.nth(1)).toBeFocused();
  await page.keyboard.press('Space');
  await expect(items.nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect(items.first()).toHaveAttribute('aria-pressed', 'false');
  // The key takes duration-settle to arrive.
  await expect.poll(() => keyBox(group)).toEqual(await itemBox(group, items.nth(1)));
});

test('ToggleGroup: the key jumps under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  const group = page.locator('#toggle-group [aria-label="Show"]');
  await group.getByRole('button', { name: 'Archived' }).click();
  expect(await keyBox(group)).toEqual(await itemBox(group, group.getByRole('button', { name: 'Archived' })));
});

test('ToggleGroup with multiple: items press independently', async ({ page }) => {
  await open(page);
  const group = page.locator('#toggle-group [aria-label="Formatting"]');
  await group.getByRole('button', { name: 'Italic' }).click();
  await expect(group.locator('[aria-pressed="true"]')).toHaveCount(2);
  await expect(group.locator('.mu-segmented-key')).toHaveCount(0);
});

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

test('Field: clicking the label toggles its checkbox, unless disabled', async ({ page }) => {
  await open(page);
  const checkbox = page.getByRole('checkbox', { name: 'Weekly digest' });
  await page.locator('#field label', { hasText: 'Weekly digest' }).click();
  await expect(checkbox).toHaveAttribute('aria-checked', 'true');
  const disabled = page.getByRole('switch', { name: 'Product news' });
  await page.locator('#field label', { hasText: 'Product news' }).click({ force: true });
  await expect(disabled).toHaveAttribute('aria-checked', 'false');
});

test('Field: an error replaces the description and marks the input', async ({ page }) => {
  await open(page);
  const field = page.locator('#field .mu-field-root[data-invalid]');
  await expect(field.locator('.mu-field-description')).toBeHidden();
  await expect(field.locator('.mu-field-error')).toBeVisible();
  await expect(field.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
});

test('Input: the label focuses the input and the box shows the focus ring', async ({ page }) => {
  await open(page);
  await page.locator('#field label', { hasText: 'Name' }).click();
  const input = page.getByRole('textbox', { name: 'Name' });
  await expect(input).toBeFocused();
  const box = page.locator('#field .mu-input-root').first();
  await expect(box).toHaveCSS('outline-style', 'solid');
});

test('Switch: the knob slides when on, and only fades under reduced motion', async ({ page }) => {
  await open(page);
  const thumb = page.locator('#switch .mu-switch-thumb').first();
  expect(await thumb.evaluate((element) => getComputedStyle(element).transitionProperty)).toContain('translate');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await thumb.evaluate((element) => getComputedStyle(element).transitionProperty)).toBe('background-color');
});

test.describe('on a touch screen', () => {
  test.use({ hasTouch: true, isMobile: true });

  test('checkbox, switch and radio hit areas reach 44px', async ({ page }) => {
    await open(page, { size: 'sm' });
    for (const selector of ['#checkbox .mu-checkbox', '#switch .mu-switch', '#radio-group .mu-radio']) {
      const after = await page.locator(selector).first().evaluate((element) => {
        const style = getComputedStyle(element, '::after');
        return [parseFloat(style.width), parseFloat(style.height)];
      });
      expect(after[0], selector).toBeGreaterThanOrEqual(44);
      expect(after[1], selector).toBeGreaterThanOrEqual(44);
    }
  });
});
