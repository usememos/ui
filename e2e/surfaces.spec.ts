import { expect, test, type Locator } from '@playwright/test';
import { open, themes } from './helpers';

const contentPosition = (control: Locator) => control.evaluate((element) => {
  const child = [...element.children].find((part) => part.getBoundingClientRect().width > 1);
  if (!child) return null;
  const box = element.getBoundingClientRect();
  const content = child.getBoundingClientRect();
  return [content.x - box.x, content.y - box.y, content.width, content.height];
});

for (const theme of themes) {
  test(`focus stays visible within flat controls in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    await page.keyboard.press('Tab');
    const controls = [
      '#button .mu-button-primary:not([data-disabled])',
      '#button .mu-button-neutral:not([data-disabled])',
      '#button .mu-button-ghost:not([data-disabled])',
      '#button .mu-button-danger:not([data-disabled])',
      '#checkbox .mu-checkbox:not([data-checked])',
      '#checkbox .mu-checkbox[data-checked]',
      '#radio-group .mu-radio[data-checked]',
      '#switch .mu-switch:not([data-checked])',
      '#switch .mu-switch[data-checked]',
      '#toggle .mu-toggle[data-pressed]',
      '#tabs .mu-tabs-tab',
      '#list .mu-list-item-button',
      '#combobox .mu-combobox-trigger',
    ];
    for (const selector of controls) {
      const control = page.locator(selector).first();
      const before = (await control.boundingBox())!;
      const content = await contentPosition(control);
      await control.focus();
      await expect(control).toBeFocused();
      await expect(control).toHaveCSS('outline-style', 'none');
      await expect(control).toHaveCSS('box-shadow', 'none');
      const filled = await control.evaluate((element) => element.matches('.mu-button-primary, .mu-button-danger, [data-checked], [data-indeterminate]'));
      const danger = await control.evaluate((element) => element.classList.contains('mu-button-danger'));
      const ink = theme === 'light' ? 'rgb(26, 26, 26)' : 'rgb(230, 230, 230)';
      const inverse = theme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(15, 15, 15)';
      const expected = danger ? 'rgb(255, 255, 255)' : filled ? inverse : ink;
      await expect(control).toHaveCSS('border-top-color', expected);
      const colors = await control.evaluate((element) => {
        const style = getComputedStyle(element);
        return { edge: style.borderTopColor, width: style.borderTopWidth, fill: style.backgroundColor };
      });
      expect(colors.width, selector).toBe('2px');
      expect(colors.edge, selector).not.toBe('rgba(0, 0, 0, 0)');
      expect(colors.edge, selector).not.toBe(colors.fill);
      const after = (await control.boundingBox())!;
      expect([after.width, after.height], selector).toEqual([before.width, before.height]);
      expect(await contentPosition(control), selector).toEqual(content);
    }
  });

  test(`field focus preserves size and text position in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    for (const selector of ['#input .mu-input-root', '#textarea .mu-textarea']) {
      const field = page.locator(selector).first();
      const metrics = () => field.evaluate((element) => {
        const box = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return { width: box.width, height: box.height, inset: parseFloat(style.paddingLeft) + parseFloat(style.borderLeftWidth) };
      });
      const before = await metrics();
      await (selector.includes('input-root') ? field.locator('input') : field).focus();
      await expect(field).toHaveCSS('border-top-width', '2px');
      expect(await metrics()).toEqual(before);
      await expect(field).toHaveCSS('outline-style', 'none');
    }
  });

  test(`disabled labels stay opaque and checked states remain readable in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    const color = theme === 'light' ? 'rgb(102, 102, 102)' : 'rgb(158, 158, 158)';
    for (const selector of ['#button .mu-button[data-disabled]:not([data-loading])', '#checkbox .mu-checkbox[data-disabled]', '#switch .mu-switch[data-disabled]', '#toggle .mu-toggle[data-disabled]', '#input .mu-input-root:has([data-disabled])', '#textarea .mu-textarea[data-disabled]']) {
      for (const control of await page.locator(selector).all()) {
        await expect(control).toHaveCSS('opacity', '1');
        await expect(control).toHaveCSS('color', color);
      }
    }
    const checked = page.locator('#checkbox .mu-checkbox[data-disabled][data-checked]');
    await expect(checked).toHaveAttribute('aria-checked', 'true');
    await expect(checked.locator('svg')).toHaveCSS('color', color);
    const on = page.locator('#switch .mu-switch[data-disabled][data-checked]');
    await expect(on.locator('.mu-switch-thumb')).toHaveCSS('background-color', color);
    await expect(on.locator('.mu-switch-thumb')).not.toHaveCSS('translate', 'none');
  });

  test(`text links have a distinct focus underline in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    await page.keyboard.press('Tab');
    const link = page.locator('#link a').last();
    await link.focus();
    await expect(link).toHaveCSS('text-decoration-style', 'double');
    await expect(link).toHaveCSS('outline-style', 'none');
  });
}

test('focus borders and switch knobs survive forced colors', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await open(page);
  await page.keyboard.press('Tab');
  for (const selector of ['#button .mu-button-primary', '#button .mu-button-ghost', '#checkbox .mu-checkbox[data-checked]', '#toggle .mu-toggle[data-pressed]']) {
    const control = page.locator(selector).first();
    await control.focus();
    const colors = await control.evaluate((element) => {
      const style = getComputedStyle(element);
      return [style.borderTopColor, style.backgroundColor];
    });
    expect(colors[0], selector).not.toBe(colors[1]);
    await expect(control).toHaveCSS('outline-style', 'none');
  }
  const input = page.locator('#input input').first();
  await input.focus();
  await expect(input.locator('..')).toHaveCSS('border-top-width', '2px');
  for (const control of await page.locator('#switch .mu-switch:not([data-disabled])').all()) {
    const track = await control.evaluate((element) => getComputedStyle(element).backgroundColor);
    await expect(control.locator('.mu-switch-thumb')).not.toHaveCSS('background-color', track);
  }
});
