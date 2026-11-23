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

test('Select scrolls its list inside an app-capped popup', async ({ page }) => {
  await open(page);
  await page.addStyleTag({ content: '.mu-select-popup { max-height: 128px; }' });
  const trigger = page.getByRole('combobox', { name: 'Language', exact: true });
  await trigger.evaluate((element) => element.scrollIntoView({ block: 'center' }));
  await trigger.click();
  const popup = page.locator('.mu-select-popup');
  const list = page.getByRole('listbox');
  await expect(popup).toHaveCSS('height', '128px');
  expect(await list.evaluate((element) => element.scrollHeight - element.clientHeight)).toBeGreaterThan(0);
  const down = popup.locator('[data-direction="down"]');
  await expect(down).toBeVisible();
  await page.keyboard.press('End');
  await expect(down).toBeHidden();
  const last = list.getByRole('option', { name: '中文' });
  const frame = (await popup.boundingBox())!;
  const row = (await last.boundingBox())!;
  expect(row.y).toBeGreaterThanOrEqual(frame.y);
  expect(row.y + row.height).toBeLessThanOrEqual(frame.y + frame.height);
  await last.click();
  await expect(trigger).toHaveText('中文');
  await expect(trigger).toBeFocused();
});

test('Select respects the available space when the app height limit is larger', async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 240 });
  await open(page);
  await page.addStyleTag({ content: '.mu-select-popup { max-height: 256px; }' });
  const trigger = page.getByRole('combobox', { name: 'Language', exact: true });
  await trigger.evaluate((element) => element.scrollIntoView({ block: 'center' }));
  await trigger.press('Enter');
  const popup = page.locator('.mu-select-popup');
  await expect(popup).toBeInViewport({ ratio: 1 });
  await page.keyboard.press('End');
  await expect(page.getByRole('option', { name: '中文' })).toBeInViewport({ ratio: 1 });
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveText('中文');
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
