import { expect, test, type Locator } from '@playwright/test';
import { open } from './helpers';

const keyBox = (well: Locator) =>
  well.evaluate((element) => {
    const key = element.querySelector(':scope > .mu-segmented-key')!.getBoundingClientRect();
    const box = element.getBoundingClientRect();
    return { left: Math.round(key.left - box.left), width: Math.round(key.width) };
  });

const itemBox = (well: Locator, item: Locator) =>
  Promise.all([well.boundingBox(), item.boundingBox()]).then(([box, own]) => ({ left: Math.round(own!.x - box!.x), width: Math.round(own!.width) }));

test('ToggleGroup: arrow keys move focus, Space picks, and the key updates immediately', async ({ page }) => {
  await open(page);
  const group = page.locator('#toggle-group [aria-label="Show"]');
  const items = group.getByRole('button');
  await expect(group).toHaveAttribute('data-keyed', '');
  await items.first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(items.nth(1)).toBeFocused();
  await page.keyboard.press('Space');
  await expect(items.nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect(items.first()).toHaveAttribute('aria-pressed', 'false');
  await expect(group.locator('.mu-segmented-key')).toHaveCSS('transition-duration', '0s');
  await expect(items.nth(1)).toHaveCSS('transition-duration', '0s');
  await expect.poll(() => keyBox(group)).toEqual(await itemBox(group, items.nth(1)));
});

test('ToggleGroup: the key jumps under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  const group = page.locator('#toggle-group [aria-label="Show"]');
  await group.getByRole('button', { name: 'Archived' }).click();
  expect(await keyBox(group)).toEqual(await itemBox(group, group.getByRole('button', { name: 'Archived' })));
});

test('ToggleGroup with multiple: items press independently', async ({ page }) => {
  await open(page);
  const group = page.locator('#toggle-group [aria-label="Formatting"]');
  await group.getByRole('button', { name: 'Italic' }).click();
  await expect(group.locator('[aria-pressed="true"]')).toHaveCount(2);
  await expect(group.locator('.mu-segmented-key')).toHaveCount(0);
});

test('ToggleGroup: narrow labels keep whole words and the key follows the scrolled choice', async ({ page }) => {
  await open(page);
  const group = page.locator('#toggle-group [data-narrow] .mu-toggle-group');
  const box = await group.boundingBox();
  expect(box!.width).toBeLessThanOrEqual(200);
  for (const label of await group.locator('.mu-toggle-label').all()) {
    expect(await label.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
    expect((await label.boundingBox())!.height).toBeGreaterThan(20);
    const linesPerWord = await label.evaluate((element) => {
      const node = element.firstChild!;
      return [...element.textContent!.matchAll(/\S+/g)].map((match) => {
        const range = document.createRange();
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);
        return new Set([...range.getClientRects()].map((rect) => rect.top)).size;
      });
    });
    expect(linesPerWord.every((lines) => lines === 1)).toBe(true);
  }
  const last = group.getByRole('button').last();
  await group.getByRole('button').first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(last).toBeFocused();
  await page.keyboard.press('Space');
  await expect(last).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => group.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  const key = await group.locator('.mu-segmented-key').boundingBox();
  const chosen = (await last.boundingBox())!;
  expect(Math.round(key!.height)).toBe(Math.round(chosen.height));
  await expect.poll(async () => Math.round((await group.locator('.mu-segmented-key').boundingBox())!.x)).toBe(Math.round(chosen.x));
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(page.viewportSize()!.width);
});

test('ToggleGroup: an unbroken label stays reachable without widening the page', async ({ page }) => {
  await open(page);
  const group = page.locator('#toggle-group [data-narrow] .mu-toggle-group');
  const last = group.getByRole('button').last();
  await last.locator('.mu-toggle-label').evaluate((element) => { element.textContent = 'Donaudampfschifffahrtsgesellschaft'; });
  await group.hover();
  await page.mouse.wheel(500, 0);
  await expect.poll(() => group.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  await last.focus();
  await expect(last.locator('.mu-toggle-label')).toHaveCSS('height', '20px');
  await page.keyboard.press('Space');
  await expect(last).toHaveAttribute('aria-pressed', 'true');
  expect((await group.boundingBox())!.width).toBeLessThanOrEqual(200);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(page.viewportSize()!.width);
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
