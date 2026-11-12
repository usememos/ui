import { expect, test } from '@playwright/test';
import { expectNoAxeViolations, open, themes } from './helpers';

for (const theme of themes) {
  test(`soft toggles keep selection distinct from hover and disabled in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    await page.mouse.move(0, 0);
    const row = page.locator('#toggle [data-variant="soft"]');
    const off = row.getByRole('button', { name: 'Has tasks', exact: true });
    const on = row.getByRole('button', { name: 'Pinned', exact: true });
    const disabled = row.getByRole('button', { name: 'Disabled', exact: true });
    const disabledOn = row.getByRole('button', { name: 'Disabled, on', exact: true });
    const rest = theme === 'light' ? 'oklch(0.95 0.006 95)' : 'rgb(37, 37, 37)';
    const hover = theme === 'light' ? 'oklch(0.934 0.008 95)' : 'rgb(37, 37, 37)';
    const selected = theme === 'light' ? 'oklch(0.919 0.004 95)' : 'rgb(52, 52, 52)';
    const text = theme === 'light' ? 'rgb(26, 26, 26)' : 'rgb(237, 237, 237)';
    const secondary = theme === 'light' ? 'rgb(94, 94, 94)' : 'rgb(173, 173, 173)';
    const unavailable = theme === 'light' ? 'rgb(102, 102, 102)' : 'rgb(158, 158, 158)';
    await expect(off).toHaveCSS('background-color', rest);
    await expect(off).toHaveCSS('color', secondary);
    await off.hover();
    await expect(off).toHaveCSS('background-color', hover);
    await expect(off).toHaveCSS('color', text);
    await expect(off).toHaveAttribute('aria-pressed', 'false');
    await expect(on).toHaveCSS('background-color', selected);
    await on.hover();
    const box = await on.boundingBox();
    await page.mouse.down();
    await expect(on).toHaveCSS('background-color', selected);
    await expect(on).toHaveCSS('color', text);
    await expect(on).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
    expect(await on.boundingBox()).toEqual(box);
    await page.mouse.up();
    // The click turned it off; keyboard activation restores the saved fill.
    await on.focus();
    await page.keyboard.press('Space');
    await expect(on).toHaveAttribute('aria-pressed', 'true');
    await expect(on).toHaveCSS('background-color', selected);
    await expect(on).toHaveCSS('border-top-width', '1px');
    await expect(on).toHaveCSS('border-top-color', theme === 'light' ? 'rgb(26, 26, 26)' : 'rgb(230, 230, 230)');
    await expect(on).toHaveCSS('outline-style', 'none');
    for (const [control, fill] of [[disabled, hover], [disabledOn, selected]] as const) {
      await expect(control).toBeDisabled();
      await control.hover();
      await page.mouse.down();
      await expect(control).toHaveCSS('background-color', fill);
      await expect(control).toHaveCSS('color', unavailable);
      await page.mouse.up();
    }
  });

  test(`compact reactions share controlled state and keyboard focus in ${theme}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page, { theme });
    const strip = page.getByRole('group', { name: 'Reactions', exact: true });
    const trigger = strip.getByRole('button', { name: 'Add reaction', exact: true });
    const pill = strip.getByRole('button', { name: 'Thumbs up, 3 reactions', exact: true });
    expect((await pill.boundingBox())!.height).toBe(24);
    await expect(pill.locator('.mu-body')).toHaveCSS('font-size', '14px');
    await expect(pill.locator('.reaction-count')).toHaveCSS('font-size', '13px');
    await expect(pill.locator('.reaction-label')).toHaveCSS('gap', '4px');
    expect((await trigger.boundingBox())!.width).toBe(24);
    expect((await trigger.boundingBox())!.height).toBe(24);
    await trigger.focus();
    await page.keyboard.press('Enter');
    const popup = page.getByRole('dialog', { name: 'Choose reactions', exact: true });
    const options = popup.getByRole('button');
    await expect(options).toHaveCount(8);
    const boxes = await options.evaluateAll((elements) => elements.map((element) => {
      const { x, y, width, height } = element.getBoundingClientRect();
      return { x, y, width, height };
    }));
    expect(new Set(boxes.map((box) => box.y)).size).toBe(1);
    expect(boxes.every((box) => box.width === 28 && box.height === 28)).toBe(true);
    expect(boxes[1]!.x - boxes[0]!.x - 28).toBe(2);
    expect((await popup.boundingBox())!.width).toBe(254);
    const anchor = (await trigger.boundingBox())!;
    const panel = (await popup.boundingBox())!;
    expect(panel.x).toBeCloseTo(anchor.x, 0);
    expect(Math.abs(panel.y - anchor.y - anchor.height)).toBe(6);
    const thumbs = popup.getByRole('button', { name: 'Thumbs up', exact: true });
    await expect(thumbs).toBeFocused();
    await page.keyboard.press('Space');
    await expect(thumbs).toHaveAttribute('aria-pressed', 'true');
    await expect(strip.getByRole('button', { name: 'Thumbs up, 4 reactions', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Tab');
    await expect(popup.getByRole('button', { name: 'Heart', exact: true })).toBeFocused();
    await expectNoAxeViolations(page, '.reaction-popup');
    await page.keyboard.press('Escape');
    // A focused emoji's Tooltip is the innermost overlay and dismisses first.
    if (await popup.isVisible()) await page.keyboard.press('Escape');
    await expect(popup).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await strip.getByRole('button', { name: 'Thumbs up, 4 reactions', exact: true }).click();
    await trigger.click();
    await expect(thumbs).toHaveAttribute('aria-pressed', 'false');
  });
}

test('pill controls keep each size row, equal padding and circular icons', async ({ page }) => {
  for (const [size, height, icon] of [['xs', 20, 12], ['sm', 24, 14], ['md', 32, 16]] as const) {
    await open(page, { size });
    const controls = page.locator('#button [data-shape="pill"] button, #toggle [data-variant="soft"] button');
    for (const control of await controls.all()) {
      const geometry = await control.evaluate((element) => {
        const style = getComputedStyle(element);
        return { height: element.getBoundingClientRect().height, start: style.paddingInlineStart, end: style.paddingInlineEnd, radius: style.borderTopLeftRadius };
      });
      expect(geometry.height).toBe(height);
      expect(geometry.start).toBe(geometry.end);
      expect(geometry.radius).toBe('9999px');
      const svg = control.locator('svg');
      if (await svg.count()) {
        await expect(svg).toHaveCSS('width', `${icon}px`);
        await expect(svg).toHaveCSS('height', `${icon}px`);
      }
    }
    for (const circle of await page.locator('#button .mu-button-pill.mu-button-icon, #toggle .mu-toggle-pill.mu-toggle-icon').all()) {
      expect((await circle.boundingBox())!.width).toBe(height);
    }
  }
});

test('soft selection survives forced colors independently of keyboard focus', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await open(page);
  const row = page.locator('#toggle [data-variant="soft"]');
  const on = row.getByRole('button', { name: 'Pinned', exact: true });
  const off = row.getByRole('button', { name: 'Has tasks', exact: true });
  const disabled = row.getByRole('button', { name: 'Disabled, on', exact: true });
  await expect(on).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  const text = await on.evaluate((element) => getComputedStyle(element).color);
  await expect(on).toHaveCSS('border-top-color', text);
  await expect(off).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
  const gray = await disabled.evaluate((element) => getComputedStyle(element).color);
  await expect(disabled).toHaveCSS('border-top-color', gray);
  const box = await on.boundingBox();
  await on.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(on).toBeFocused();
  await expect(on).toHaveCSS('border-top-width', '2px');
  expect(await on.boundingBox()).toEqual(box);
});

test.describe('touch reactions', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 320, height: 844 } });

  for (const theme of themes) {
    test(`four columns reserve independent 44px targets in ${theme}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await open(page, { theme, size: 'sm' });
      const strip = page.getByRole('group', { name: 'Reactions', exact: true });
      for (const control of await strip.getByRole('button').all()) {
        const box = (await control.boundingBox())!;
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
      await strip.getByRole('button', { name: 'Add reaction', exact: true }).tap();
      const popup = page.getByRole('dialog', { name: 'Choose reactions', exact: true });
      const options = popup.getByRole('button');
      const boxes = await options.evaluateAll((elements) => elements.map((element) => {
        const { x, y, width, height } = element.getBoundingClientRect();
        return { x, y, width, height };
      }));
      expect(new Set(boxes.map((box) => box.x)).size).toBe(4);
      expect(new Set(boxes.map((box) => box.y)).size).toBe(2);
      expect(boxes.every((box) => box.width >= 44 && box.height >= 44)).toBe(true);
      const panel = (await popup.boundingBox())!;
      expect(panel.x).toBeGreaterThanOrEqual(0);
      expect(panel.x + panel.width).toBeLessThanOrEqual(320);
      const before = await options.evaluateAll((elements) => elements.map((element) => element.getAttribute('aria-pressed')));
      // Tap both edges of every cell; neighboring choices must not change.
      for (let index = 0; index < boxes.length; index++) {
        for (const edge of ['start', 'end']) {
          // Updating counts can wrap the strip and move its add button. The popup tracks that anchor.
          const box = (await options.nth(index).boundingBox())!;
          await options.nth(index).tap({ position: { x: edge === 'start' ? 0 : box.width - 2, y: box.height / 2 } });
          await expect.poll(() => options.evaluateAll((elements) => elements.map((element) => element.getAttribute('aria-pressed'))))
            .toEqual(before.map((pressed, i) => i === index ? String(pressed !== 'true') : pressed));
          await options.nth(index).tap();
          await expect.poll(() => options.evaluateAll((elements) => elements.map((element) => element.getAttribute('aria-pressed')))).toEqual(before);
        }
      }
      await expect(popup.getByRole('button', { name: 'Thumbs up', exact: true })).toHaveCSS('background-color', theme === 'light' ? 'oklch(0.95 0.006 95)' : 'rgb(37, 37, 37)');
    });
  }
});
