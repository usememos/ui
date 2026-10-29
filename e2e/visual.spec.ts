// One screenshot per playground section, theme and size. The baselines are
// made on Linux in CI (the "Screenshots" workflow), so this project runs in
// CI only: local browsers and fonts render a few pixels differently.
import { expect, test } from '@playwright/test';
import { open, themes } from './helpers';

const sizes = ['sm', 'md', 'lg'] as const;

for (const theme of themes) {
  for (const size of sizes) {
    test(`${theme} ${size}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await open(page, { theme, size });
      // The sticky header would cover sections scrolled under it.
      await page.addStyleTag({ content: '.pg-header { position: static; }' });
      const ids = await page.locator('main > section[id]').evaluateAll((sections) => sections.map((section) => section.id));
      for (const id of ids) {
        await expect(page.locator(`#${id}`), id).toHaveScreenshot(`${id}-${theme}-${size}.png`, { animations: 'disabled', maxDiffPixelRatio: 0.002 });
      }
    });
  }
}
