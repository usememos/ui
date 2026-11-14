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

test('Tabs: arrow keys move between tabs and the key follows', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  const list = page.locator('#tabs [role="tablist"]');
  const tabs = list.getByRole('tab');
  await tabs.first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(1)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#tabs [role="tabpanel"]:not([inert])')).toHaveText('What we tell you about, and how.');
  expect(await keyBox(list)).toEqual(await itemBox(list, tabs.nth(1)));
  await page.keyboard.press('ArrowLeft');
  await expect(tabs.first()).toBeFocused();
});
