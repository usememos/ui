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
  test(`frequent feedback is immediate in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    for (const selector of ['#button .mu-button', '#toggle .mu-toggle', '#list .mu-list-item-button', '#tabs .mu-tabs-tab', '#switch .mu-switch']) {
      const control = page.locator(selector).first();
      await expect(control).toHaveCSS('transition-duration', '0s');
      await control.hover();
      expect(await control.evaluate((element) => element.getAnimations().length), selector).toBe(0);
    }
    for (const selector of ['#tabs .mu-segmented-key', '#toggle-group .mu-segmented-key']) {
      await expect(page.locator(selector).first()).toHaveCSS('transition-duration', '0s');
    }
  });

  test(`resting surfaces stay quiet while state markers stay distinct in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    await page.mouse.move(0, 0);
    const edge = theme === 'light' ? 'oklch(0.858 0.006 95)' : 'rgb(52, 52, 52)';
    const state = theme === 'light' ? 'rgb(144, 144, 144)' : 'rgb(119, 119, 119)';
    for (const selector of ['#button .mu-button-neutral', '#select .mu-select-trigger.mu-button-neutral', '#switch .mu-switch:not([data-checked], [data-disabled])', '#depth .mu-well', '#depth .mu-popup']) {
      await expect(page.locator(selector).first()).toHaveCSS('border-top-color', edge);
    }
    for (const selector of ['#checkbox .mu-checkbox:not([data-checked], [data-disabled], [data-indeterminate])', '#radio-group .mu-radio:not([data-checked], [data-disabled])']) {
      await expect(page.locator(selector).first()).toHaveCSS('border-top-color', state);
    }
    const key = page.locator('#depth .mu-key');
    for (const [attribute, value] of [['data-selected', ''], ['data-pressed', ''], ['aria-selected', 'true'], ['aria-pressed', 'true']] as const) {
      await key.evaluate((element, { attribute, value }) => element.setAttribute(attribute, value), { attribute, value });
      await expect(key).toHaveCSS('border-top-color', edge);
      await key.evaluate((element, name) => element.removeAttribute(name), attribute);
    }
  });

  test(`neutral controls keep focus stronger than hover in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    await page.keyboard.press('Tab');
    const hover = theme === 'light' ? 'oklch(0.858 0.006 95)' : 'rgb(52, 52, 52)';
    const focus = theme === 'light' ? 'rgb(26, 26, 26)' : 'rgb(230, 230, 230)';
    for (const selector of ['#button .mu-button-neutral', '#select .mu-select-trigger.mu-button-neutral', '#switch .mu-switch:not([data-checked], [data-disabled])']) {
      const control = page.locator(selector).first();
      await control.hover();
      await expect(control).toHaveCSS('border-top-color', hover);
      const before = (await control.boundingBox())!;
      await control.focus();
      await expect(control).toHaveCSS('border-top-color', focus);
      await expect(control).toHaveCSS('border-top-width', '1px');
      const after = (await control.boundingBox())!;
      expect([after.width, after.height]).toEqual([before.width, before.height]);
    }
    const select = page.locator('#select .mu-select-trigger.mu-button-neutral').first();
    await select.evaluate((element) => element.setAttribute('data-invalid', ''));
    const danger = await select.evaluate((element) => getComputedStyle(element).getPropertyValue('--mu-danger').trim());
    await select.hover();
    await expect(select).toHaveCSS('border-top-color', danger);
    await select.focus();
    await expect(select).toHaveCSS('border-top-color', focus);
    await expect(select).toHaveCSS('border-top-width', '1px');
  });

  test(`toolbar choices use fill until keyboard focus in ${theme}`, async ({ page }) => {
    for (const size of ['xs', 'sm', 'md'] as const) {
      await open(page, { theme, size });
      const fill = theme === 'light' ? 'oklch(0.934 0.008 95)' : 'rgb(37, 37, 37)';
      const ink = theme === 'light' ? 'rgb(26, 26, 26)' : 'rgb(237, 237, 237)';
      const focus = theme === 'light' ? 'rgb(26, 26, 26)' : 'rgb(230, 230, 230)';
      for (const toggle of [page.locator('#toggle').getByRole('button', { name: 'Pinned', exact: true }), page.getByRole('group', { name: 'Formatting', exact: true }).getByRole('button', { name: 'Bold', exact: true })]) {
        await toggle.scrollIntoViewIfNeeded();
        const before = (await toggle.boundingBox())!;
        await expect(toggle).toHaveCSS('background-color', fill);
        await expect(toggle).toHaveCSS('color', ink);
        await expect(toggle).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
        await toggle.hover();
        await expect(toggle).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
        await toggle.click();
        await expect(toggle).toHaveAttribute('aria-pressed', 'false');
        await toggle.click();
        await expect(toggle).toHaveAttribute('aria-pressed', 'true');
        await expect(toggle).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
        await expect(toggle).toHaveCSS('background-color', fill);
        await page.keyboard.press('Tab');
        await toggle.focus();
        await expect(toggle).toHaveCSS('border-top-color', focus);
        await expect(toggle).toHaveCSS('border-top-width', '1px');
        const after = (await toggle.boundingBox())!;
        expect([after.width, after.height]).toEqual([before.width, before.height]);
        await toggle.blur();
        await expect(toggle).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
        await expect(toggle).toHaveAttribute('aria-pressed', 'true');
      }
    }
  });

  test(`press feedback keeps controls still in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    for (const selector of ['#button .mu-button-primary', '#button .mu-button-neutral', '#button .mu-button-ghost', '#button .mu-button-danger', '#checkbox .mu-checkbox:not([data-disabled])', '#radio-group .mu-radio:not([data-disabled])', '#switch .mu-switch:not([data-disabled])']) {
      const control = page.locator(selector).first();
      await control.hover();
      const before = (await control.boundingBox())!;
      await page.mouse.down();
      await expect(control).toHaveCSS('translate', 'none');
      await expect(control).toHaveCSS('scale', 'none');
      await expect(control).toHaveCSS('filter', 'none');
      expect(await control.boundingBox()).toEqual(before);
      if (selector.startsWith('#switch')) await expect(control.locator('.mu-switch-thumb')).toHaveCSS('scale', 'none');
      await page.mouse.up();
    }
  });

  test(`passive table rows keep their surface on hover in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    await page.mouse.move(0, 0);
    const cell = page.locator('#table .mu-table-body .mu-table-row').first().locator('.mu-table-cell').first();
    const fill = await cell.evaluate((element) => getComputedStyle(element).backgroundColor);
    await cell.hover();
    await expect(cell).toHaveCSS('background-color', fill);
  });

  test(`text fields keep the same appearance through hover focus and press in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    const edge = theme === 'light' ? 'oklch(0.858 0.006 95)' : 'rgb(52, 52, 52)';
    for (const selector of ['#input .mu-input-root', '#textarea .mu-textarea', '#combobox .mu-input-root']) {
      await page.mouse.move(0, 0);
      const field = page.locator(selector).first();
      const control = selector.includes('input-root') ? field.locator('input') : field;
      const background = await field.evaluate((element) => getComputedStyle(element).backgroundColor);
      const before = (await field.boundingBox())!;
      await expect(field).toHaveCSS('transition-duration', '0s');
      await expect(field).toHaveCSS('border-top-color', edge);
      await field.hover();
      await expect(field).toHaveCSS('border-top-color', edge);
      await control.click();
      await expect(control).toBeFocused();
      await expect(control).not.toHaveCSS('caret-color', 'rgba(0, 0, 0, 0)');
      await expect(field).toHaveCSS('border-top-color', edge);
      await page.mouse.down();
      await expect(field).toHaveCSS('background-color', background);
      await expect(field).toHaveCSS('translate', 'none');
      await expect(field).toHaveCSS('scale', 'none');
      const after = (await field.boundingBox())!;
      expect([after.width, after.height]).toEqual([before.width, before.height]);
      await page.mouse.up();
      expect(await field.evaluate((element) => element.getAnimations().length)).toBe(0);
      await control.blur();
      await expect(field).toHaveCSS('border-top-color', edge);
      await page.keyboard.press('Tab');
      await control.focus();
      await expect(field).toHaveCSS('border-top-color', edge);
      await expect(field).toHaveCSS('border-top-width', '1px');
      await field.evaluate((element) => element.setAttribute('aria-invalid', 'true'));
      const danger = await field.evaluate((element) => getComputedStyle(element).getPropertyValue('--mu-danger').trim());
      await control.blur();
      await field.hover();
      await expect(field).toHaveCSS('border-top-color', danger);
      await control.focus();
      await expect(field).toHaveCSS('border-top-color', danger);
    }
  });

  test(`view options keep selection and off switches distinct in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    await page.locator('#popover').getByRole('button', { name: 'View options' }).click();
    const popup = page.locator('.mu-popover-popup');
    const edge = theme === 'light' ? 'oklch(0.858 0.006 95)' : 'rgb(52, 52, 52)';
    await expect(popup.getByRole('combobox')).toHaveCSS('border-top-color', edge);
    const off = page.locator('#switch .mu-switch:not([data-checked], [data-disabled])');
    await expect(off).toHaveCSS('border-top-color', edge);
    await expect(off.locator('.mu-switch-thumb')).toHaveCSS('background-color', theme === 'light' ? 'rgb(26, 26, 26)' : 'rgb(237, 237, 237)');
    const group = popup.locator('.mu-segmented');
    await expect(group).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
    const key = group.locator('.mu-segmented-key');
    await expect(key).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
    const fill = await group.evaluate((element) => getComputedStyle(element).backgroundColor);
    await expect(key).not.toHaveCSS('background-color', fill);
  });

  test(`single-choice layout options keep standard sizes and quiet selection in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    await page.mouse.move(0, 0);
    for (const [size, height, line] of [['sm', 24, 18], ['md', 32, 20]] as const) {
      const group = page.getByRole('group', { name: `Column layout ${size}`, exact: true });
      const key = group.locator('.mu-segmented-key');
      await expect(group).toHaveCSS('height', `${height}px`);
      await expect(group).toHaveCSS('width', '248px');
      await expect(key).toHaveCSS('height', `${height - 4}px`);
      await expect(key).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
      const fill = await group.evaluate((element) => getComputedStyle(element).backgroundColor);
      await expect(key).not.toHaveCSS('background-color', fill);
      for (const label of await group.locator('.mu-toggle-label').all()) {
        await expect(label).toHaveCSS('height', `${line}px`);
      }
      await expect(group.getByRole('button', { name: 'List', exact: true })).toHaveAttribute('aria-pressed', 'true');
    }
  });

  test(`Quick find results show keyboard focus in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    await page.getByRole('button', { name: 'Quick find', exact: true }).click();
    await expect(page.getByRole('textbox', { name: 'Find', exact: true })).toBeFocused();
    await page.keyboard.press('Tab');
    const result = page.getByRole('dialog').getByRole('button', { name: 'Reading list', exact: true });
    await expect(result).toBeFocused();
    await expect(result).toHaveCSS('background-color', theme === 'light' ? 'oklch(0.95 0.006 95)' : 'rgb(37, 37, 37)');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

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
      '#select .mu-select-trigger.mu-button-neutral',
      '#select .mu-select-trigger.mu-button-ghost',
      '#toggle .mu-toggle[data-pressed]',
      '#toggle-group .mu-segmented .mu-toggle',
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
      expect(colors.width, selector).toBe('1px');
      expect(colors.edge, selector).not.toBe('rgba(0, 0, 0, 0)');
      expect(colors.edge, selector).not.toBe(colors.fill);
      const after = (await control.boundingBox())!;
      expect([after.width, after.height], selector).toEqual([before.width, before.height]);
      expect(await contentPosition(control), selector).toEqual(content);
    }
  });

  test(`field focus preserves size and text position in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    const edge = theme === 'light' ? 'oklch(0.858 0.006 95)' : 'rgb(52, 52, 52)';
    for (const selector of ['#input .mu-input-root', '#textarea .mu-textarea', '#combobox .mu-input-root']) {
      const field = page.locator(selector).first();
      const metrics = () => field.evaluate((element) => {
        const box = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return { width: box.width, height: box.height, inset: parseFloat(style.paddingLeft) + parseFloat(style.borderLeftWidth) };
      });
      const before = await metrics();
      await (selector.includes('input-root') ? field.locator('input') : field).focus();
      await expect(field).toHaveCSS('border-top-width', '1px');
      await expect(field).toHaveCSS('border-top-color', edge);
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

  test(`chosen values and disabled parts use their content roles in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    for (const value of await page.locator('.mu-select-value').all()) {
      await expect(value).toHaveCSS('font-weight', '400');
    }
    const disabled = theme === 'light' ? 'rgb(102, 102, 102)' : 'rgb(158, 158, 158)';
    for (const selector of ['#combobox .mu-combobox-trigger[data-disabled]', '#collapsible [data-disabled] > .mu-collapsible-chevron']) {
      await expect(page.locator(selector)).toHaveCSS('color', disabled);
    }
    const toggle = page.locator('#toggle .mu-toggle[data-pressed][data-disabled]');
    await expect(toggle).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
    const fill = await toggle.evaluate((element) => getComputedStyle(element).backgroundColor);
    await toggle.hover();
    await expect(toggle).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
    await expect(toggle).toHaveCSS('background-color', fill);
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    const segment = page.locator('#toggle-group [aria-label="Show"] .mu-toggle[data-pressed]');
    await segment.evaluate((element) => element.setAttribute('data-disabled', ''));
    await expect(segment).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
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
  const on = page.locator('#toggle .mu-toggle[data-pressed]:not([data-disabled])').first();
  await expect(on).toHaveAttribute('aria-pressed', 'true');
  const onColors = await on.evaluate((element) => {
    const style = getComputedStyle(element);
    return [style.borderTopColor, style.backgroundColor];
  });
  expect(onColors[0]).not.toBe(onColors[1]);
  const off = page.locator('#toggle .mu-toggle:not([data-pressed], [data-disabled])').first();
  await expect(off).toHaveCSS('border-top-color', await off.evaluate((element) => getComputedStyle(element).backgroundColor));
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
  for (const selector of ['#input .mu-input-root', '#textarea .mu-textarea', '#combobox .mu-input-root']) {
    const field = page.locator(selector).first();
    await (selector.includes('input-root') ? field.locator('input') : field).focus();
    await expect(field).toHaveCSS('border-top-width', '2px');
    await expect(field).toHaveCSS('outline-style', 'none');
    const colors = await field.evaluate((element) => {
      const style = getComputedStyle(element);
      return [style.borderTopColor, style.backgroundColor];
    });
    expect(colors[0], selector).not.toBe(colors[1]);
  }
  const task = page.locator('#prose input[type="checkbox"]').first();
  await task.focus();
  const mark = await task.evaluate((element) => {
    const style = getComputedStyle(element, '::before');
    return { width: style.borderTopWidth, edge: style.borderTopColor, fill: style.backgroundColor };
  });
  expect(mark.width).toBe('2px');
  expect(mark.edge).not.toBe(mark.fill);
  for (const control of await page.locator('#switch .mu-switch:not([data-disabled])').all()) {
    const track = await control.evaluate((element) => getComputedStyle(element).backgroundColor);
    await expect(control.locator('.mu-switch-thumb')).not.toHaveCSS('background-color', track);
  }
  const key = page.locator('#toggle-group [aria-label="Show"] .mu-segmented-key');
  const fill = await key.evaluate((element) => getComputedStyle(element).backgroundColor);
  await expect(key).not.toHaveCSS('border-top-color', fill);
});
