import { expect, test, type Locator } from '@playwright/test';
import { expectNoAxeViolations, open, themes } from './helpers';

async function contentInset(surface: Locator, content: Locator) {
  const outer = (await surface.boundingBox())!;
  const inner = (await content.boundingBox())!;
  return inner.x - outer.x;
}

async function expectColumns(rows: Locator, label: string) {
  await expect(rows.locator(label).first()).toBeVisible();
  const starts = await rows.locator(label).evaluateAll((labels) => labels.map((element) => element.getBoundingClientRect().left));
  expect(starts.length).toBeGreaterThan(1);
  expect(Math.max(...starts) - Math.min(...starts)).toBeLessThan(0.1);
}

async function expectUnavailableParts(row: Locator) {
  await expect(row).toHaveAttribute('data-disabled');
  const color = await row.evaluate((element) => getComputedStyle(element).color);
  const parts = await row.locator('svg, [class*="label"], [class*="text"], [class*="description"], [class*="shortcut"], [class*="indicator"]').all();
  for (const part of parts) await expect(part).toHaveCSS('color', color);
  await expect(row).toHaveCSS('font-weight', '400');
  await row.hover({ force: true });
  await expect(row).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
}

for (const theme of themes) {
  for (const size of ['sm', 'md'] as const) {
    test(`${theme} ${size}: boxed content shares the measured outer inset`, async ({ page }) => {
      await open(page, { theme, size });
      const list = page.locator('#list .mu-list').first();
      const table = page.locator('#table .mu-table-bordered');
      expect(await contentInset(list, list.locator('.mu-field-label').first())).toBe(size === 'sm' ? 12 : 16);
      const tableInset = await table.evaluate((element) => {
        const cell = element.querySelector('th')!;
        return cell.getBoundingClientRect().left + parseFloat(getComputedStyle(cell).paddingLeft) - element.getBoundingClientRect().left;
      });
      expect(tableInset).toBe(size === 'sm' ? 12 : 16);
      const sizedList = page.locator('#list .mu-list').first();
      const inset = await sizedList.locator('.mu-list-item').first().evaluate((element) => parseFloat(getComputedStyle(element).paddingLeft) + 1);
      expect(inset).toBe(size === 'sm' ? 12 : 16);
      await page.locator('#popover').getByRole('button', { name: 'Share', exact: true }).click();
      const popup = page.locator('.mu-popover-popup');
      expect(await contentInset(popup, popup.locator('.mu-popover-title'))).toBe(16);
    });

    test(`${theme} ${size}: collection columns and disabled parts agree across action and choice roles`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await open(page, { theme, size });
      const filterFixture = page.locator('#combobox');
      await filterFixture.getByRole('button', { name: 'Filter collections', exact: true }).click();
      const filtered = page.locator('.mu-combobox-popup .mu-combobox-item');
      await expectColumns(filtered, '.mu-combobox-item-text');
      const archived = filtered.filter({ hasText: 'Archived' });
      await expectUnavailableParts(archived);
      await expect(archived.locator('.mu-combobox-indicator svg')).toBeVisible();
      const filter = filterFixture.getByRole('combobox', { name: 'Filter collections' });
      await filter.fill('Every');
      await expect(filtered).toHaveCount(1);
      // Filtering away the only icon removes the unused leading column.
      expect(await contentInset(filtered, filtered.locator('.mu-combobox-item-text'))).toBe(8);
      await filter.fill('');
      await expect(filtered).toHaveCount(3);
      await expectColumns(filtered, '.mu-combobox-item-text');

      await page.keyboard.press('Escape');
      await page.locator('#menu').getByRole('button', { name: 'Collection actions' }).focus();
      await page.keyboard.press('Enter');
      const menu = page.getByRole('menu');
      const actions = menu.locator('.mu-menu-group').first();
      await expectColumns(actions.locator('.mu-menu-item'), '.mu-menu-label');
      const saved = actions.getByRole('menuitemcheckbox', { name: 'Archived' });
      await expect(saved).toHaveAccessibleDescription('This saved choice is currently unavailable');
      await expectUnavailableParts(saved);
      await expect(saved.locator('.mu-menu-indicator svg')).toBeVisible();
      await expectUnavailableParts(actions.getByRole('menuitem', { name: 'Delete' }));
      const textOnly = menu.getByRole('menuitem', { name: 'Everything', exact: true });
      expect(await contentInset(textOnly, textOnly.locator('.mu-menu-label'))).toBe(8);
      const described = actions.getByRole('menuitem', { name: 'Export all entries with attachments' });
      await expect(described).toHaveAccessibleName(/^Export all entries with attachments\s*⇧⌘E$/);
      await expect(described).toHaveAccessibleDescription('Exportieren Sie alle Einträge einschließlich ihrer Anhänge.');
      await expect(described.locator('.mu-menu-description')).toHaveCSS('white-space', 'normal');
      await expectNoAxeViolations(page, '.mu-menu-popup');
      await page.keyboard.press('Escape');

      await page.locator('#select').getByRole('combobox', { name: 'Collection choice' }).click();
      const choices = page.locator('.mu-select-popup');
      await expectColumns(choices.locator('.mu-select-group').first().locator('.mu-select-item'), '.mu-select-item-text');
      const selected = choices.getByRole('option', { name: 'Archived', exact: true });
      await expectUnavailableParts(selected);
      await expect(selected.locator('.mu-select-indicator svg')).toBeVisible();
      const plain = choices.getByRole('option', { name: 'Personal', exact: true });
      expect(await contentInset(plain, plain.locator('.mu-select-item-text'))).toBe(8);
      await page.keyboard.press('Escape');
    });
  }

  test(`${theme}: drawer content includes only the perimeter border on its side`, async ({ page }) => {
    await open(page, { theme });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.getByRole('button', { name: 'Note details', exact: true }).click();
    const drawer = page.locator('.mu-drawer-popup');
    expect(await contentInset(drawer, drawer.locator('.mu-drawer-title'))).toBe(20);
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Open sheet', exact: true }).click();
    const sheet = page.locator('.mu-drawer-popup');
    const top = (await sheet.locator('.mu-drawer-title').boundingBox())!.y - (await sheet.boundingBox())!.y;
    expect(top).toBe(20);
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
    await expect(page.locator('.mu-drawer-content')).toHaveCSS('padding', '0px');
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Read full screen', exact: true }).click();
    const full = page.locator('.mu-dialog-popup');
    expect(await contentInset(full, full.locator('.mu-dialog-title'))).toBe(20);
  });
}

test.describe('narrow composed content', () => {
  test.use({ viewport: { width: 320, height: 800 }, isMobile: true, hasTouch: true });
  for (const theme of themes) {
    test(`${theme}: long content fits while keeping its text and size rows`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await open(page, { theme });
      const filterFixture = page.locator('#combobox');
      expect(await page.locator('#menu, #select, #combobox').evaluateAll((elements) => elements.every((element) => element.scrollWidth <= element.clientWidth))).toBe(true);
      const hint = filterFixture.locator('.mu-field-description');
      await expect(hint).toHaveCSS('font-size', '13px');
      await expect(hint).toHaveCSS('overflow-wrap', 'anywhere');
      await filterFixture.getByRole('button', { name: 'Filter collections', exact: true }).tap();
      await expect(page.locator('.mu-combobox-popup')).toBeVisible();
      for (const row of await page.locator('.mu-combobox-item').all()) {
        expect((await row.boundingBox())!.height).toBeGreaterThanOrEqual(32);
      }
      await page.keyboard.press('Escape');
      await expect(page.locator('.mu-combobox-popup')).toBeHidden();
      await page.locator('#menu').getByRole('button', { name: 'Collection actions' }).tap();
      const popup = page.getByRole('menu');
      expect(await popup.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
      for (const row of await popup.locator('.mu-menu-item').all()) {
        expect((await row.boundingBox())!.height).toBeGreaterThanOrEqual(32);
        await expect(row).toHaveCSS('font-weight', '400');
      }
      await expectNoAxeViolations(page, '.mu-menu-popup');
    });
  }
});
