import { expect, test } from '@playwright/test';
import { open } from './helpers';

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
    const fills = await page.locator('[data-tag-colors] .mu-badge').first().evaluate((element) => ['#000000', '#ffffff'].map((color) => {
      (element as HTMLElement).style.setProperty('--mu-badge-color', color);
      return getComputedStyle(element).backgroundColor;
    }));
    // Lightness is kept between 50% and 75%, so neither black nor white is a fill the background swallows.
    for (const fill of fills)
      expect(fill).toMatch(/^oklch\(0\.(5|75)\b.* \/ 0\.18\)$/);
  }
});
