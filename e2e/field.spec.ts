import { expect, test } from '@playwright/test';
import { open, themes } from './helpers';

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

test('Field horizontal: the label comes first at weight 500, the control at the end, and the label toggles a Switch', async ({ page }) => {
  await open(page);
  const field = page.locator('#field .mu-field-horizontal').first();
  const label = field.locator('label');
  const control = field.getByRole('switch', { name: 'Compact mode' });
  await expect(label).toHaveCSS('font-weight', '500');
  const [fieldBox, controlBox] = await Promise.all([field.boundingBox(), control.boundingBox()]);
  expect(Math.round(controlBox!.x + controlBox!.width)).toBe(Math.round(fieldBox!.x + fieldBox!.width));
  await label.click();
  await expect(control).toBeChecked();
});

for (const theme of themes) {
  for (const size of ['sm', 'md'] as const) {
    test(`Field text roles distinguish names from values at ${size} in ${theme}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await open(page, { theme, size });
      const text = theme === 'light' ? 'rgb(26, 26, 26)' : 'rgb(237, 237, 237)';
      const secondary = theme === 'light' ? 'rgb(94, 94, 94)' : 'rgb(173, 173, 173)';
      const disabled = theme === 'light' ? 'rgb(102, 102, 102)' : 'rgb(158, 158, 158)';
      for (const label of await page.locator('#field .mu-field-label, #radio-group .mu-field-label').all()) {
        await expect(label).toHaveCSS('font-weight', '500');
      }
      for (const label of await page.locator('#field .mu-field-label:not([data-disabled]), #list .mu-field-label, #form .mu-field-label').all()) {
        await expect(label).toHaveCSS('color', text);
      }
      const description = page.locator('#field .mu-field-description').first();
      await expect(description).toHaveCSS('font-weight', '400');
      await expect(description).toHaveCSS('color', secondary);
      const name = page.getByRole('textbox', { name: 'Name', exact: true });
      await expect(name).toHaveCSS('font-weight', '400');
      await expect(name).toHaveCSS('color', text);
      await expect(page.locator('#field .mu-field-label[data-disabled]')).toHaveCSS('color', disabled);
      const disabledRadioLabel = page.locator('#radio-group').getByRole('radio', { name: 'Public', exact: true }).last().locator('..');
      await expect(disabledRadioLabel).toHaveCSS('color', disabled);
      await expect(disabledRadioLabel).toHaveCSS('font-weight', '500');
      await page.locator('#popover').getByRole('button', { name: 'Share', exact: true }).click();
      await expect(page.locator('.mu-popover-popup .mu-field-label')).toHaveCSS('font-weight', '500');
      await expect(page.locator('.mu-popover-popup .mu-field-label')).toHaveCSS('color', text);
      await page.keyboard.press('Escape');
      await page.locator('#popover').getByRole('button', { name: 'View options', exact: true }).click();
      const popup = page.locator('.mu-popover-popup');
      const labels = popup.locator('.mu-field-label');
      for (const label of await labels.all()) {
        await expect(label).toHaveCSS('font-weight', '500');
        await expect(label).toHaveCSS('color', secondary);
      }
      const value = popup.locator('.mu-select-value');
      await expect(value).toHaveCSS('font-weight', '400');
      await expect(value).toHaveCSS('color', text);
      const pinned = popup.getByRole('switch', { name: 'Show pinned first' });
      const pinnedLabel = popup.locator('.mu-field-label', { hasText: 'Show pinned first' });
      await pinnedLabel.hover();
      await pinnedLabel.click();
      await expect(pinned).not.toBeChecked();
      await expect(pinnedLabel).toHaveCSS('color', secondary);
      // Disabled text takes precedence over the compact-panel color.
      await pinnedLabel.evaluate(element => element.setAttribute('data-disabled', ''));
      await expect(pinnedLabel).toHaveCSS('font-weight', '500');
      await expect(pinnedLabel).toHaveCSS('color', disabled);
      await popup.getByRole('combobox').click();
      for (const option of await page.getByRole('option').all()) {
        await expect(option).toHaveCSS('font-weight', '400');
        await expect(option).toHaveCSS('color', text);
      }
    });
  }
}
