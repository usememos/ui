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
  await expect(page.locator('.mu-combobox-empty')).toHaveText('No tags found');
  await expect(page.getByRole('option')).toHaveCount(0);
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
  for (const size of ['sm', 'md', 'lg'] as const) {
    await open(page, { size });
    const cell = page.locator('#table tbody td').first();
    const [cellHeight, textHeight] = await cell.evaluate((element) => {
      const style = getComputedStyle(element);
      return [element.clientHeight, parseFloat(style.lineHeight) + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)];
    });
    expect(Math.abs(cellHeight - textHeight), size).toBeLessThanOrEqual(1);
  }
});

test('Prose: task list checkboxes are 16px, and done items are struck through', async ({ page }) => {
  await open(page);
  const boxes = page.locator('#prose input[type="checkbox"]');
  await expect(boxes).toHaveCount(2);
  const sizes = await boxes.evaluateAll((elements) => elements.map((element) => `${element.getBoundingClientRect().width}x${element.getBoundingClientRect().height}`));
  expect(sizes).toEqual(['16x16', '16x16']);
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
