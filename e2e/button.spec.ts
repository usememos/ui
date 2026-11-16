import { expect, test } from '@playwright/test';
import { open, themes } from './helpers';

const save = (page: import('@playwright/test').Page) => page.locator('#button [data-variant="neutral"] button').first();

for (const theme of themes) {
  test(`disabled ghost actions share the disabled surface in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    await page.mouse.move(0, 0);
    const row = page.locator('#button [data-variant="ghost"]');
    const disabled = row.locator('button[data-disabled]:not([data-loading])');
    const enabled = row.locator('button').first();
    const well = theme === 'light' ? 'oklch(0.934 0.008 95)' : 'rgb(37, 37, 37)';
    const edge = theme === 'light' ? 'oklch(0.858 0.006 95)' : 'rgb(52, 52, 52)';
    await expect(disabled).toBeDisabled();
    await expect(disabled).toHaveCSS('background-color', well);
    await expect(disabled).toHaveCSS('border-top-color', edge);
    await expect(enabled).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    const before = await disabled.boundingBox();
    await disabled.hover();
    await page.mouse.down();
    await expect(disabled).toHaveCSS('background-color', well);
    await expect(disabled).toHaveCSS('border-top-color', edge);
    expect(await disabled.boundingBox()).toEqual(before);
    await page.mouse.up();
  });

  test(`actions reuse their hover highlight while held without moving in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    for (const variant of ['primary', 'neutral', 'ghost', 'danger']) {
      const button = page.locator(`#button [data-variant="${variant}"] button`).first();
      await button.hover();
      await expect(button).toHaveCSS('transition-duration', '0s');
      const before = await button.boundingBox();
      const highlight = await button.evaluate((element) => {
        const style = getComputedStyle(element);
        return { fill: style.backgroundColor, edge: style.borderTopColor };
      });
      await page.mouse.down();
      await expect(button).toHaveCSS('background-color', highlight.fill);
      await expect(button).toHaveCSS('border-top-color', highlight.edge);
      await expect(button).toHaveCSS('translate', 'none');
      await expect(button).toHaveCSS('scale', 'none');
      await expect(button).toHaveCSS('filter', 'none');
      expect(await button.boundingBox()).toEqual(before);
      await page.mouse.up();
      await expect(button).toHaveCSS('border-top-color', highlight.edge);
    }
  });
}

test('sizes set the height', async ({ page }) => {
  for (const [size, height] of [['xs', 20], ['sm', 24], ['md', 32]] as const) {
    await open(page, { size });
    expect((await save(page).boundingBox())?.height).toBe(height);
  }
});

test('shows the ink border on keyboard focus only', async ({ page }) => {
  await open(page);
  const button = save(page);
  await button.click();
  await expect(button).toHaveCSS('outline-style', 'none');
  await button.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS('outline-style', 'none');
  await expect(button).toHaveCSS('border-top-width', '1px');
  await expect(button).toHaveCSS('border-top-color', 'rgb(26, 26, 26)');
});

test('Enter and Space press it', async ({ page }) => {
  await open(page);
  const button = save(page);
  await button.evaluate((element) => {
    (window as unknown as { presses: number }).presses = 0;
    element.addEventListener('click', () => (window as unknown as { presses: number }).presses++);
  });
  await button.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Space');
  expect(await page.evaluate(() => (window as unknown as { presses: number }).presses)).toBe(2);
});

test('changes fill without moving while held', async ({ page }) => {
  await open(page);
  const button = save(page);
  const box = (await button.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(button).toHaveCSS('translate', 'none');
  await expect(button).toHaveCSS('background-color', 'oklch(0.982 0.004 95)');
  expect(await button.boundingBox()).toEqual(box);
  await page.mouse.up();
});

test('does not move under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  const button = save(page);
  const box = (await button.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(button).toHaveCSS('box-shadow', 'none');
  await expect(button).toHaveCSS('background-color', 'oklch(0.982 0.004 95)');
  await expect(button).toHaveCSS('translate', 'none');
  await page.mouse.up();
});

test('stays focusable while loading and keeps the label visible', async ({ page }) => {
  await open(page);
  const row = page.locator('#button [data-variant="neutral"]');
  const loading = row.locator('button[data-loading]');
  await expect(loading).toHaveAttribute('data-loading-visible', '');
  await expect(loading.locator('.mu-button-label')).toHaveCSS('opacity', '1');
  await expect(loading).toHaveAttribute('aria-busy', 'true');
  await loading.focus();
  await expect(loading).toBeFocused();
});

test('delays only the spinner and keeps the label visible when work ends', async ({ page }) => {
  await page.clock.install({ time: 0 });
  await open(page);
  await page.clock.pauseAt(60_000);
  const button = page.locator('#button button').filter({ hasText: 'Save changes' });
  const before = (await button.boundingBox())!.width;
  await button.click();
  await expect(button).toHaveAttribute('aria-disabled', 'true');
  await expect(button).toHaveAttribute('aria-busy', 'true');
  await expect(button).toHaveAccessibleName('Save changes');
  await expect(button).toHaveAccessibleDescription('Saving');
  await page.clock.runFor(299);
  await expect(button.locator('.mu-spinner')).toHaveCount(0);
  await expect(button.locator('.mu-button-label')).toHaveCSS('opacity', '1');
  await page.clock.runFor(1);
  await expect(button.locator('.mu-spinner')).toHaveCount(1);
  await expect(button.locator('.mu-button-label')).toHaveCSS('opacity', '1');
  expect((await button.boundingBox())!.width).toBe(before);
  await page.clock.runFor(1200);
  await expect(button).not.toHaveAttribute('aria-busy', 'true');
  await expect(button.locator('.mu-spinner')).toHaveCount(0);
  await expect(button.locator('.mu-button-label')).toHaveCSS('opacity', '1');
  expect((await button.boundingBox())!.width).toBe(before);
});

for (const theme of themes) {
  for (const size of ['xs', 'sm', 'md'] as const) {
    test(`loading preserves labels, icon slots and geometry in ${theme} ${size}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: theme === 'dark' ? 'reduce' : 'no-preference' });
      await page.clock.install({ time: 0 });
      await open(page, { theme, size });
      await page.clock.pauseAt(60_000);
      const buttons = page.locator('#button [data-loading-case]');
      const before = await buttons.evaluateAll((elements) => elements.map((element) => {
        const box = element.getBoundingClientRect();
        const label = element.querySelector('.mu-button-label');
        const style = getComputedStyle(element);
        const slot = element.querySelector('svg, .mu-button-loading-slot')!;
        const slotBox = slot.getBoundingClientRect();
        return { width: box.width, height: box.height, label: label?.getBoundingClientRect().toJSON(), text: label?.textContent, padding: style.padding, slot: slotBox.toJSON() };
      }));
      await buttons.first().click();
      await page.clock.runFor(300);
      for (const [index, button] of (await buttons.all()).entries()) {
        const expected = before[index]!;
        const box = (await button.boundingBox())!;
        expect(box.width).toBe(expected.width);
        expect(box.height).toBe(expected.height);
        await expect(button).toHaveCSS('padding', expected.padding);
        await expect(button).toHaveAttribute('aria-busy', 'true');
        await expect(button).toHaveAttribute('aria-disabled', 'true');
        const spinner = button.locator('.mu-spinner');
        await expect(spinner).toHaveCount(1);
        const slot = await spinner.evaluate((element) => {
          const box = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          const width = parseFloat(style.width);
          const height = parseFloat(style.height);
          return { x: box.x + (box.width - width) / 2, y: box.y + (box.height - height) / 2, width, height };
        });
        expect(slot.x).toBeCloseTo(expected.slot.x, 2);
        expect(slot.y).toBeCloseTo(expected.slot.y, 2);
        expect(slot.width).toBe(expected.slot.width);
        expect(slot.height).toBe(expected.slot.height);
        if (expected.label) {
          const label = button.locator('.mu-button-label');
          await expect(label).toHaveText(expected.text!);
          await expect(label).toHaveCSS('opacity', '1');
          expect(await label.boundingBox()).toEqual(expect.objectContaining({ x: expected.label.x, y: expected.label.y, width: expected.label.width, height: expected.label.height }));
          expect(slot.x + slot.width <= expected.label.x || slot.x >= expected.label.right).toBe(true);
        } else {
          await expect(button).toHaveAccessibleName(index === 4 ? 'Add' : 'Next');
          await expect(button.locator('svg')).toHaveCount(0);
        }
      }
      await buttons.first().focus();
      await page.keyboard.press('Enter');
      await page.keyboard.press('Space');
      await expect(buttons.first()).toBeFocused();
      await page.clock.runFor(1200);
      for (const [index, button] of (await buttons.all()).entries()) {
        await expect(button).not.toHaveAttribute('aria-busy', 'true');
        await expect(button.locator('.mu-spinner')).toHaveCount(0);
        expect((await button.boundingBox())!.width).toBe(before[index]!.width);
      }
    });
  }
}

test.describe('on a touch screen', () => {
  test.use({ hasTouch: true, isMobile: true });

  test('sm keeps its 24px height without an expanded hit area', async ({ page }) => {
    await open(page, { size: 'sm' });
    expect((await save(page).boundingBox())!.height).toBe(24);
    expect(await save(page).evaluate((element) => getComputedStyle(element, '::after').content)).toBe('none');
  });

  test('loading keeps text and icon actions fixed on a narrow screen', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.clock.install({ time: 0 });
    await open(page);
    await page.clock.pauseAt(60_000);
    const text = page.locator('#button [data-loading-case="long"]');
    const icon = page.locator('#button [data-loading-case="icon"]');
    await icon.scrollIntoViewIfNeeded();
    const before = await Promise.all([text.boundingBox(), icon.boundingBox()]);
    await icon.tap();
    await page.clock.runFor(300);
    expect(await text.boundingBox()).toEqual(before[0]);
    expect(await icon.boundingBox()).toEqual(before[1]);
    await expect(text.locator('.mu-button-label')).toHaveCSS('opacity', '1');
    await expect(text.locator('.mu-spinner')).toBeVisible();
    await expect(icon.locator('svg')).toHaveCount(0);
    await expect(icon.locator('.mu-spinner')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  });
});
