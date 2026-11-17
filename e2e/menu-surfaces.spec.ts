import { expect, test, type Locator, type Page } from '@playwright/test';
import { open, themes } from './helpers';

// Context DPR emulation alone leaves Chromium's native border snapping at 1x.
test.use({ launchOptions: { executablePath: process.env.PW_CHROMIUM_PATH, args: ['--force-device-scale-factor=2'] } });
test.skip(({ browserName }) => browserName !== 'chromium', 'Native Chromium display-density checks.');

const moreActions = (page: Page) => page.locator('#menu').getByRole('button', { name: 'More actions' });

async function expectMenuSurface(menu: Locator, edge: number, depth: 'menu-depth' | 'menu-nested-depth') {
  const surface = await menu.evaluate((element, depth) => {
    const style = getComputedStyle(element);
    return {
      edge: parseFloat(style.borderTopWidth),
      inset: parseFloat(style.paddingTop) + parseFloat(style.borderTopWidth),
      shadow: style.boxShadow,
      depth: style.getPropertyValue(`--mu-${depth}`).trim(),
      outline: style.outlineStyle,
    };
  }, depth);
  expect(surface.edge).toBe(edge);
  expect(surface.inset).toBe(6);
  expect(surface.shadow).not.toBe('none');
  expect(surface.depth).not.toBe('none');
  expect(surface.outline).toBe('none');
}

for (const density of [1, 2]) {
  test.describe(`Menu surfaces at ${density}x`, () => {
    test.use({ deviceScaleFactor: density });
    for (const theme of themes) {
      test(`fine edges, front-layer depth and separator geometry in ${theme}`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await open(page, { theme });
        await moreActions(page).click();
        const parent = page.getByRole('menu').first();
        await expectMenuSurface(parent, density === 2 ? 0.5 : 1, 'menu-depth');
        const separator = parent.getByRole('separator');
        const [outer, line] = await Promise.all([parent.boundingBox(), separator.boundingBox()]);
        const edge = density === 2 ? 0.5 : 1;
        expect(line!.x - outer!.x).toBe(edge);
        expect(outer!.x + outer!.width - line!.x - line!.width).toBe(edge);
        const move = page.getByRole('menuitem', { name: 'Move to' });
        await move.focus();
        await page.keyboard.press('ArrowRight');
        const child = page.getByRole('menu').nth(1);
        await expectMenuSurface(child, edge, 'menu-nested-depth');
        const [trigger, first, childBox] = await Promise.all([move.boundingBox(), child.getByRole('menuitem').first().boundingBox(), child.boundingBox()]);
        expect(first!.y).toBeCloseTo(trigger!.y, 3);
        expect(childBox!.x).toBeCloseTo(outer!.x + outer!.width - 2, 3);
        await expect(child).not.toHaveCSS('box-shadow', await parent.evaluate(element => getComputedStyle(element).boxShadow));
        await page.keyboard.press('Escape');
        await page.keyboard.press('Escape');
        await page.locator('#popover').getByRole('button', { name: 'Account', exact: true }).click();
        const panel = page.locator('.mu-popover-popup');
        await expect(panel).toHaveCSS('border-top-width', '1px');
        await expect(panel).toHaveCSS('box-shadow', 'none');
        const [panelBox, panelLine] = await Promise.all([panel.boundingBox(), panel.getByRole('separator').boundingBox()]);
        expect(panelLine!.x - panelBox!.x).toBe(1);
        await panel.getByRole('button', { name: /Theme/ }).click();
        await expectMenuSurface(page.getByRole('menu'), edge, 'menu-nested-depth');
      });
    }

    test('forced colors removes depth and keeps the 1px edge and 6px inset', async ({ page }) => {
      await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
      await open(page);
      await moreActions(page).click();
      await page.getByRole('menuitem', { name: 'Move to' }).focus();
      await page.keyboard.press('ArrowRight');
      for (const menu of await page.getByRole('menu').all()) {
        await expect(menu).toHaveCSS('border-top-width', '1px');
        await expect(menu).toHaveCSS('box-shadow', 'none');
        expect(await menu.evaluate(element => parseFloat(getComputedStyle(element).paddingTop) + parseFloat(getComputedStyle(element).borderTopWidth))).toBe(6);
      }
    });
  });
}

