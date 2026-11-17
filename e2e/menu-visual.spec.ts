import { expect, test } from '@playwright/test';
import { around, open, themes } from './helpers';

test.use({ deviceScaleFactor: 2, launchOptions: { executablePath: process.env.PW_CHROMIUM_PATH, args: ['--disable-lcd-text', '--force-device-scale-factor=2'] } });

for (const theme of themes) {
  test(`Menu: high-density submenu seam in ${theme}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page, { theme });
    await page.locator('#menu').getByRole('button', { name: 'More actions', exact: true }).click();
    await page.getByRole('menuitem', { name: 'Move to' }).focus();
    await page.keyboard.press('ArrowRight');
    const menus = page.getByRole('menu');
    await expect(menus).toHaveCount(2);
    for (const menu of await menus.all()) await expect(menu).toHaveCSS('border-top-width', '0.5px');
    await expect(page).toHaveScreenshot(`overlay-menu-submenu-${theme}-2x.png`, { animations: 'disabled', maxDiffPixelRatio: 0.002, clip: await around(menus, 32) });
  });
}
