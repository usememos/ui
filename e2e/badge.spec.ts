import { expect, test } from '@playwright/test';
import { open, themes } from './helpers';

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

for (const theme of themes) {
  for (const size of ['xs', 'sm'] as const) {
    test(`Badge: ${theme} ${size} text density keeps pill height and icon geometry`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await open(page, { theme, size });
      const examples = page.locator('[data-badge-props] > .mu-badge, [data-tag-colors] .mu-badge, [data-badge-truncated] .mu-badge');
      const defaults = page.locator('[data-badge-complements] .mu-badge');
      for (const [badges, fontSize, lineHeight, inset] of [
        [examples, size === 'xs' ? '11px' : '13px', size === 'xs' ? '16px' : '18px', size === 'xs' ? 6 : 8],
        [defaults, '13px', '18px', 8],
      ] as const) {
        expect(await badges.count()).toBeGreaterThan(0);
        for (const badge of await badges.all()) {
          await expect(badge).toHaveCSS('border-top-left-radius', '9999px');
          const insets = await badge.evaluate((element) => {
            const style = getComputedStyle(element);
            return [parseFloat(style.paddingLeft) + parseFloat(style.borderLeftWidth), parseFloat(style.paddingRight) + parseFloat(style.borderRightWidth)];
          });
          expect(insets).toEqual([inset, inset]);
          expect((await badge.boundingBox())!.height).toBe(20);
          await expect(badge).toHaveCSS('font-size', fontSize);
          await expect(badge).toHaveCSS('line-height', lineHeight);
          await expect(badge).toHaveCSS('font-weight', '400');
          await expect(badge).not.toHaveAttribute('size');
          for (const icon of await badge.locator('svg').all()) {
            await expect(icon).toHaveCSS('width', '12px');
            await expect(icon).toHaveCSS('height', '12px');
            await expect(icon).toHaveCSS('stroke-width', '1.25px');
            const badgeBox = (await badge.boundingBox())!;
            const iconBox = (await icon.boundingBox())!;
            expect(Math.abs(iconBox.y + iconBox.height / 2 - badgeBox.y - badgeBox.height / 2)).toBeLessThanOrEqual(0.5);
          }
        }
      }
      const explicit = page.locator('[data-badge-props] > .mu-badge-primary');
      const defaultBadge = defaults.filter({ hasText: 'New' });
      if (size === 'xs') expect((await explicit.locator('.mu-badge-label').boundingBox())!.width).toBeLessThan((await defaultBadge.locator('.mu-badge-label').boundingBox())!.width);
      const label = page.locator('[data-badge-truncated] .mu-badge-label');
      expect(await label.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
      await expect(label).toHaveCSS('text-overflow', 'ellipsis');
    });
  }
}

for (const touch of [false, true]) {
  test.describe(touch ? 'touch composition' : 'mouse composition', () => {
    test.use({ hasTouch: touch, isMobile: touch, viewport: { width: touch ? 320 : 1000, height: 800 } });

    for (const theme of themes) {
      test(`Badge: mixed text roles align and localized labels fit in ${theme}`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await open(page, { theme, size: 'xs' });
        const metadata = page.locator('[data-badge-context="metadata"]');
        await expect(metadata.locator('.pg-badge-meta')).toHaveCSS('font-size', '13px');
        await expect(metadata.locator('.mu-badge').filter({ hasText: /^New$/ })).toHaveCSS('font-size', '11px');
        await expect(metadata.locator('.mu-badge').filter({ hasText: /^Private$/ })).toHaveCSS('font-size', '13px');
        const action = metadata.getByRole('button', { name: 'Open', exact: true });
        await expect(action).toHaveCSS('height', '20px');
        await action.focus();
        await expect(action).toBeFocused();
        const centers = await metadata.locator(':scope > *').evaluateAll((elements) => elements.map((element) => {
          const box = element.getBoundingClientRect();
          return box.y + box.height / 2;
        }));
        expect(Math.max(...centers) - Math.min(...centers)).toBeLessThanOrEqual(0.5);

        const localized = page.locator('[data-badge-context="localized"]');
        await expect(localized).toHaveAttribute('lang', 'zh-CN');
        for (const label of ['新', '已同步']) {
          const badge = localized.locator('.mu-badge').filter({ hasText: new RegExp(`^${label}$`) });
          await expect(badge).toHaveCSS('font-size', '11px');
          expect((await badge.boundingBox())!.height).toBe(20);
        }
        await expect(localized.locator('.mu-badge').filter({ hasText: /^工作$/ })).toHaveCSS('font-size', '13px');
        await expect(localized.locator('[data-badge-count]')).toHaveText('999');
        await expect(localized.locator('[data-badge-count]')).toHaveCSS('font-variant-numeric', 'tabular-nums');
        const longBadge = localized.locator('.pg-badge-long-label .mu-badge');
        await expect(longBadge).toHaveAttribute('title', '同步完成，所有更改已保存至服务器');
        const longLabel = longBadge.locator('.mu-badge-label');
        expect(await longLabel.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
        await expect(longLabel).toHaveCSS('text-overflow', 'ellipsis');

        for (const row of [metadata, localized]) {
          const bounds = (await row.boundingBox())!;
          for (const child of await row.locator(':scope > *').all()) {
            const box = (await child.boundingBox())!;
            expect(box.x).toBeGreaterThanOrEqual(bounds.x - 0.5);
            expect(box.x + box.width).toBeLessThanOrEqual(bounds.x + bounds.width + 0.5);
          }
        }
      });
    }
  });
}

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
