import { expect, test } from '@playwright/test';
import { expectNoAxeViolations, open, themes } from './helpers';

const tagInput = (page: import('@playwright/test').Page) => page.getByRole('combobox', { name: 'Tag', exact: true });

test('Combobox grid: arrow keys move across rows and columns, and Enter picks', async ({ page }) => {
  await open(page);
  await page.locator('#combobox').getByRole('button', { name: 'Choose icon' }).click();
  const input = page.getByRole('combobox', { name: 'Find an icon' });
  await expect(input).toBeFocused();
  // The chosen icon (Heart, row 1 column 4) is where the highlight starts.
  await page.keyboard.press('ArrowDown');
  const highlighted = page.locator('.mu-combobox-row [data-highlighted]');
  await expect(highlighted).toHaveAttribute('aria-label', 'Sun');
  await page.keyboard.press('ArrowLeft');
  await expect(highlighted).toHaveAttribute('aria-label', 'Star');
  await page.keyboard.press('ArrowUp');
  await expect(highlighted).toHaveAttribute('aria-label', 'Coffee');
  await page.keyboard.press('Enter');
  await expect(page.locator('.mu-combobox-row [aria-label="Coffee"]')).toHaveAttribute('data-selected', '');
  await input.fill('st');
  await expect(page.locator('.mu-combobox-row .mu-combobox-item')).toHaveCount(1);
});

for (const theme of themes) {
  test(`Combobox chevron tooltip preserves its list interaction in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    const trigger = page.locator('#combobox').getByRole('button', { name: 'Tag', exact: true });
    await trigger.hover();
    await expect(page.locator('.mu-tooltip-popup[data-open]')).toHaveText('Show options');
    await trigger.click();
    await expect(page.locator('.mu-combobox-popup')).toBeVisible();
    await expect(page.locator('.mu-tooltip-popup[data-open]')).toHaveCount(0);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('combobox', { name: 'Tag', exact: true })).toHaveValue('book');
  });
}

test('Combobox: typing filters the list, arrows move, Enter picks', async ({ page }) => {
  await open(page);
  const input = tagInput(page);
  await input.fill('de');
  const listbox = page.getByRole('listbox');
  await expect(listbox).toBeVisible();
  await expect(page.getByRole('option')).toHaveText(['design', 'garden', 'ideas']);
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('option', { name: 'design' })).toHaveAttribute('data-highlighted', '');
  await page.keyboard.press('Enter');
  await expect(listbox).toBeHidden();
  await expect(input).toHaveValue('design');
  await expect(input).toBeFocused();
});

test('Combobox: says so when nothing matches, and Escape closes it', async ({ page }) => {
  await open(page);
  const input = tagInput(page);
  await input.fill('zzz');
  await expect(page.locator('.mu-combobox-popup .mu-combobox-empty')).toHaveText('No tags found');
  await expect(page.locator('.mu-combobox-popup').getByRole('option')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(page.locator('.mu-combobox-popup')).toBeHidden();
});

test('Combobox: the chevron opens the list, which is the width of the box and at most list-height tall', async ({ page }) => {
  await open(page);
  // Inside a Field the label names the chevron too.
  await page.locator('#combobox').getByRole('button', { name: 'Tag', exact: true }).click();
  const popup = page.locator('.mu-combobox-popup');
  await expect(popup).toBeVisible();
  const [box, list] = await Promise.all([page.locator('.mu-combobox-input-root').first().boundingBox(), popup.boundingBox()]);
  expect(list!.width).toBeCloseTo(box!.width, 0);
  // Rounded: layout can report a fraction of a pixel over, such as 240.00003.
  expect(Math.round(list!.height)).toBeLessThanOrEqual(240);
});

for (const theme of themes) {
  test(`open combobox has no axe violations in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    await tagInput(page).click();
    await expectNoAxeViolations(page, '[role="listbox"]');
  });
}
