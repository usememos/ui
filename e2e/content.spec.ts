import { expect, test } from '@playwright/test';
import { expectNoAxeViolations, open, themes } from './helpers';

const tagInput = (page: import('@playwright/test').Page) => page.getByRole('combobox', { name: 'Tag', exact: true });

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

test('Collapsible: the trigger toggles the panel and says whether it is open', async ({ page }) => {
  await open(page);
  const trigger = page.getByRole('button', { name: 'Advanced settings' });
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText('Webhooks, storage and the access token for scripts.')).toBeVisible();
  await page.keyboard.press('Space');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('Collapsible: the panel only fades under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  const translate = await page.evaluate(() => {
    const element = document.createElement('div');
    element.className = 'mu-collapsible-panel';
    element.setAttribute('data-starting-style', '');
    document.body.append(element);
    const value = getComputedStyle(element).translate;
    element.remove();
    return value;
  });
  expect(translate).toBe('none');
});

test('Table: a Menu trigger in a row does not make the row taller than its text', async ({ page }) => {
  for (const size of ['sm', 'md'] as const) {
    await open(page, { size });
    const cell = page.locator('#table tbody td').first();
    const [cellHeight, textHeight] = await cell.evaluate((element) => {
      const style = getComputedStyle(element);
      return [element.clientHeight, parseFloat(style.lineHeight) + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)];
    });
    expect(Math.abs(cellHeight - textHeight), size).toBeLessThanOrEqual(1);
  }
});

test('List: one edge around the rows, a line between them, and the Switch at the end of a settings row', async ({ page }) => {
  await open(page);
  const list = page.getByRole('list', { name: 'Preferences' });
  await expect(list).toHaveCSS('border-top-width', '1px');
  await expect(list).toHaveCSS('list-style-type', 'none');
  const rows = list.locator(':scope > li');
  await expect(rows.first()).toHaveCSS('border-top-width', '0px');
  await expect(rows.nth(1)).toHaveCSS('border-top-width', '1px');
  const [rowEnd, switchEnd] = await rows.first().evaluate((row) => {
    const control = row.querySelector('[role="switch"]')!;
    const padding = parseFloat(getComputedStyle(row).paddingRight);
    return [row.getBoundingClientRect().right - padding, control.getBoundingClientRect().right];
  });
  expect(Math.abs(rowEnd - switchEnd)).toBeLessThanOrEqual(1);
});

test('Table: bordered boxes the table, and the plain one has no edge', async ({ page }) => {
  await open(page);
  const scrolls = page.locator('#table .mu-table-scroll');
  await expect(scrolls.nth(0)).toHaveCSS('border-top-width', '0px');
  await expect(scrolls.nth(1)).toHaveCSS('border-top-width', '1px');
});

test('Prose: task list checkboxes are 16px, and done items are struck through', async ({ page }) => {
  await open(page);
  const boxes = page.locator('#prose input[type="checkbox"]');
  await expect(boxes).toHaveCount(3);
  const sizes = await boxes.evaluateAll((elements) => elements.map((element) => `${element.getBoundingClientRect().width}x${element.getBoundingClientRect().height}`));
  expect(sizes).toEqual(['16x16', '16x16', '16x16']);
  await page.keyboard.press('Tab');
  const unchecked = boxes.nth(1);
  await unchecked.focus();
  await expect.poll(() => unchecked.evaluate((element) => getComputedStyle(element, '::before').borderTopColor)).toBe('rgb(26, 26, 26)');
  await page.keyboard.press('Space');
  await expect(unchecked).toBeChecked();
  await expect.poll(() => unchecked.evaluate((element) => getComputedStyle(element, '::before').borderTopColor)).toBe('rgb(255, 255, 255)');
  const done = page.locator('#prose li', { hasText: 'Ship the new editor' });
  await expect(done).toHaveCSS('text-decoration-line', 'line-through');
});

for (const theme of themes) {
  test(`open combobox has no axe violations in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    await tagInput(page).click();
    await expectNoAxeViolations(page, '[role="listbox"]');
  });
}

test('Table: a bordered head row sits on canvas, and Table.Actions keeps the row height', async ({ page }) => {
  await open(page);
  const bordered = page.locator('#table .mu-table-bordered');
  const canvas = await bordered.evaluate((element) => getComputedStyle(element).getPropertyValue('--mu-canvas').trim());
  expect(canvas).toBe('oklch(0.982 0.004 95)');
  await expect(bordered.locator('th').first()).toHaveCSS('background-color', 'oklch(0.982 0.004 95)');
  await expect(page.locator('#table .mu-table-scroll').first().locator('th').first()).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  // Two Buttons in Actions sit side by side and the row is as tall as a row with one Button in its Cell.
  const actionsRow = bordered.locator('tbody tr').first();
  const buttons = actionsRow.locator('[data-actions] button');
  const [first, second] = [await buttons.nth(0).boundingBox(), await buttons.nth(1).boundingBox()];
  expect(Math.round(first!.y)).toBe(Math.round(second!.y));
  const singleRow = page.locator('#table .mu-table-scroll').first().locator('tbody tr').first();
  expect(Math.round((await actionsRow.boundingBox())!.height)).toBe(Math.round((await singleRow.boundingBox())!.height));
});

test('List: an ItemButton fills its row and highlights on hover', async ({ page }) => {
  await open(page);
  const list = page.locator('[data-item-buttons]');
  const row = list.locator(':scope > li').first();
  const button = row.locator(':scope > a');
  const [rowBox, buttonBox] = [await row.boundingBox(), await button.boundingBox()];
  expect(Math.round(buttonBox!.width)).toBe(Math.round(rowBox!.width));
  expect(Math.round(buttonBox!.height)).toBe(Math.round(rowBox!.height));
  await button.hover();
  await expect(button).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
});

test('ToggleGroup: fullWidth fills its container; labeled items grow by equal amounts from their natural width', async ({ page }) => {
  await open(page);
  const group = page.locator('[data-full-width] [role="group"]');
  expect(Math.round((await group.boundingBox())!.width)).toBe(320);
  const sizes = await group.locator('button').evaluateAll((buttons) => buttons.map((button) => {
    const label = button.querySelector('.mu-toggle-label')!;
    return { width: button.getBoundingClientRect().width, label: label.getBoundingClientRect().width, cut: label.scrollWidth > label.clientWidth };
  }));
  expect(sizes).toHaveLength(2);
  expect(sizes.some((size) => size.cut)).toBe(false);
  expect(Math.abs((sizes[0]!.width - sizes[0]!.label) - (sizes[1]!.width - sizes[1]!.label))).toBeLessThanOrEqual(1);
});

test('ToggleGroup: fullWidth in a popup that sizes to its content keeps whole labels', async ({ page }) => {
  await open(page);
  const labels = page.locator('[data-fit-content] .mu-toggle-label');
  await expect(labels).toHaveCount(3);
  const cut = await labels.evaluateAll((spans) => spans.filter((span) => span.scrollWidth > span.clientWidth).map((span) => span.textContent));
  expect(cut).toEqual([]);
});

test('Badge: color tints the fill and keeps ink text; without it the fill is well', async ({ page }) => {
  await open(page);
  const plain = page.locator('#badge .mu-badge-neutral').first();
  await expect(plain).toHaveCSS('background-color', 'oklch(0.934 0.008 95)');
  const work = page.locator('[data-tag-colors] .mu-badge').first();
  await expect(work).toHaveCSS('color', 'rgb(26, 26, 26)');
  const fill = await work.evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(fill).not.toBe('oklch(0.934 0.008 95)');
  expect(fill).toMatch(/^(oklch|color\(srgb|rgba)/);
});

test('Badge: a pill in readable 13px text, padded 2px past the xs row so the text clears the round ends', async ({ page }) => {
  await open(page);
  for (const badge of await page.locator('#badge .mu-badge').all()) {
    await expect(badge).toHaveCSS('border-top-left-radius', '9999px');
    expect(await badge.evaluate((element) => { const style = getComputedStyle(element); return parseFloat(style.paddingLeft) + parseFloat(style.borderLeftWidth); })).toBe(8);
    expect(await badge.evaluate((element) => { const style = getComputedStyle(element); return parseFloat(style.paddingRight) + parseFloat(style.borderRightWidth); })).toBe(8);
    await expect(badge).toHaveCSS('height', '20px');
    await expect(badge).toHaveCSS('font-size', '13px');
    await expect(badge).toHaveCSS('font-weight', '400');
  }
});

test('Badge: a label wider than its container ends in an ellipsis inside the pill', async ({ page }) => {
  await open(page);
  const badge = page.locator('[data-badge-truncated] .mu-badge');
  const label = badge.locator('.mu-badge-label');
  expect(await badge.evaluate((element) => element.getBoundingClientRect().width)).toBeLessThanOrEqual(120);
  expect(await label.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  await expect(label).toHaveCSS('text-overflow', 'ellipsis');
});

test('Badge: an ink-like color still gives a visible chip in both themes', async ({ page }) => {
  for (const theme of ['light', 'dark'] as const) {
    await open(page, { theme });
    const fills = await page.locator('[data-tag-colors] .mu-badge').first().evaluate((element) =>
      ['#000000', '#ffffff'].map((color) => {
        (element as HTMLElement).style.setProperty('--mu-badge-color', color);
        return getComputedStyle(element).backgroundColor;
      }),
    );
    // Lightness is kept between 50% and 75%, so neither black nor white is a fill the background swallows.
    for (const fill of fills) expect(fill).toMatch(/^oklch\(0\.(5|75)\b.* \/ 0\.18\)$/);
  }
});

test('Form: bordered has a List edge and a canvas footer bar that runs to the edges', async ({ page }) => {
  await open(page);
  const form = page.locator('#form form[data-bordered]');
  await expect(form).toHaveCSS('border-top-width', '1px');
  await expect(page.getByRole('form', { name: 'Add a tag rule' })).toBeVisible();
  const footer = form.locator('.mu-form-footer');
  await expect(footer).toHaveCSS('background-color', 'oklch(0.982 0.004 95)');
  const [formBox, footerBox] = [await form.boundingBox(), await footer.boundingBox()];
  expect(Math.round(footerBox!.width)).toBe(Math.round(formBox!.width) - 2);
  expect(Math.round(footerBox!.y + footerBox!.height)).toBe(Math.round(formBox!.y + formBox!.height) - 1);
  await expect(page.locator('#form form').nth(1)).toHaveCSS('border-top-width', '0px');
});
