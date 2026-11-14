import { expect, test } from '@playwright/test';
import { open, themes } from './helpers';

test('Select: picks a value with the keyboard and shows its label', async ({ page }) => {
  await open(page);
  const trigger = page.locator('#select').getByRole('combobox').nth(1);
  await expect(trigger).toHaveText('Choose a language');
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('listbox')).toBeVisible();
  await page.getByRole('option', { name: 'Deutsch' }).click();
  await expect(page.getByRole('listbox')).toBeHidden();
  await expect(trigger).toHaveText('Deutsch');
  await expect(trigger).toBeFocused();
});

test('Select: the field label names the trigger', async ({ page }) => {
  await open(page);
  await expect(page.locator('#select').getByRole('combobox', { name: 'Visibility' })).toBeVisible();
});

for (const theme of themes) {
  test(`Select uses one anchored list with shared motion in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    const trigger = page.locator('#select').getByRole('combobox', { name: 'Visibility' });
    await expect(trigger.locator('.lucide-chevron-down')).toHaveCount(1);
    await expect(trigger.locator('.lucide-chevrons-up-down')).toHaveCount(0);
    await trigger.click();
    const popup = page.locator('.mu-select-popup');
    await expect(popup).toBeVisible();
    await expect(popup).toHaveCSS('transition-duration', '0.1s, 0.1s');
    await expect(popup).toHaveCSS('translate', 'none');
    const anchor = (await trigger.boundingBox())!;
    const list = (await popup.boundingBox())!;
    expect(list.y).toBeGreaterThanOrEqual(anchor.y + anchor.height);
    expect(Math.abs(list.x - anchor.x)).toBeLessThanOrEqual(1);
    await expect(popup.locator('.mu-select-indicator svg')).toHaveCount(1);
    await page.keyboard.press('End');
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveText('Public');
    await expect(popup).toBeHidden();
    await expect(trigger).toBeFocused();
  });
}

test('alignItemWithTrigger aligns the chosen row when space permits and supports keyboard selection', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  const trigger = page.getByRole('combobox', { name: 'Value-aligned choice', exact: true });
  await trigger.evaluate((element) => element.scrollIntoView({ block: 'center' }));
  await trigger.click();
  const selected = page.getByRole('option', { name: 'Beta', exact: true });
  await expect(selected).toBeVisible();
  const value = (await trigger.locator('.mu-select-value').boundingBox())!;
  const label = (await selected.locator('.mu-select-item-text').boundingBox())!;
  expect(Math.abs(value.y + value.height / 2 - label.y - label.height / 2)).toBeLessThanOrEqual(1);
  await page.keyboard.press('Home');
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveText('Alpha');
  await expect(page.locator('.mu-select-popup')).toBeHidden();
  await expect(trigger).toBeFocused();
});
