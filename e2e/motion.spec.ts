import { expect, test, type Page } from '@playwright/test';
import { open, themes } from './helpers';

type Transition = { property: string; closing: boolean; duration: number };
declare global {
  interface Window { motionTransitions: Transition[] }
}

const overlays = [
  { name: 'Menu', selector: '.mu-menu-popup', trigger: '#menu button', label: 'More actions', duration: 100 },
  { name: 'Select', selector: '.mu-select-popup', trigger: '#select [role="combobox"]', label: 'Visibility', duration: 100 },
  { name: 'Combobox', selector: '.mu-combobox-popup', trigger: '#combobox button', label: 'Tag', duration: 100 },
  { name: 'Popover', selector: '.mu-popover-popup', trigger: '#popover button', label: 'Share', duration: 100 },
  { name: 'Tooltip', selector: '.mu-tooltip-popup', trigger: '#tooltip button', label: 'Archive', duration: 100 },
  { name: 'Dialog', selector: '.mu-dialog-popup', trigger: '#dialog button', label: 'Create access token', duration: 150 },
  { name: 'Drawer', selector: '.mu-drawer-popup', trigger: '#drawer button', label: 'Note details', duration: 150 },
  { name: 'Collapsible', selector: '#collapsible .mu-collapsible-panel', trigger: '#collapsible button', label: 'Advanced settings', duration: 100 },
  { name: 'Toast', selector: '.mu-toast', trigger: '#toast button', label: 'Fail', duration: 150 },
] as const;

async function recordTransitions(page: Page, selector: string, pauseOpening = false) {
  await page.evaluate(({ selector, pauseOpening }) => {
    window.motionTransitions = [];
    const paused = new Set<string>();
    document.addEventListener('transitionrun', (event) => {
      if (!(event.target instanceof HTMLElement) || !event.target.matches(selector)) return;
      const animation = event.target.getAnimations().find((animation) => animation instanceof CSSTransition && animation.transitionProperty === event.propertyName);
      if (pauseOpening && !event.target.hasAttribute('data-ending-style') && animation && !paused.has(event.propertyName)) {
        animation.pause();
        animation.currentTime = 40;
        paused.add(event.propertyName);
      }
      window.motionTransitions.push({
        property: event.propertyName,
        closing: event.target.hasAttribute('data-ending-style'),
        duration: Number(animation?.effect?.getTiming().duration),
      });
    });
  }, { selector, pauseOpening });
}

async function show(page: Page, overlay: typeof overlays[number]) {
  const trigger = page.locator(overlay.trigger).and(page.getByRole(overlay.name === 'Select' ? 'combobox' : 'button', { name: overlay.label, exact: true }));
  if (overlay.name === 'Tooltip') await trigger.hover();
  else await trigger.click();
}

async function hide(page: Page, overlay: typeof overlays[number]) {
  if (overlay.name === 'Collapsible') await page.locator('#collapsible').getByRole('button', { name: overlay.label }).click();
  else if (overlay.name === 'Toast') await page.locator('.mu-toast-close').click();
  else if (overlay.name === 'Tooltip') await page.mouse.move(0, 0);
  else await page.keyboard.press('Escape');
}

for (const theme of themes) {
  for (const overlay of overlays) {
    test(`${overlay.name}: minimal entrance and exit in ${theme}`, async ({ page }) => {
      await open(page, { theme });
      await recordTransitions(page, overlay.selector);
      await show(page, overlay);
      const popup = page.locator(overlay.selector).filter({ visible: true }).first();
      await expect(popup).toBeVisible();
      const property = overlay.name === 'Drawer' || overlay.name === 'Toast' ? 'translate' : 'opacity';
      await expect.poll(() => page.evaluate(({ property, duration }) => window.motionTransitions.some((event) => !event.closing && event.property === property && event.duration === duration), { property, duration: overlay.duration })).toBe(true);
      await expect.poll(() => popup.evaluate((element) => element.getAnimations().length)).toBe(0);
      await expect(popup).toHaveCSS('opacity', '1');
      if (overlay.name !== 'Toast') await expect(popup).toHaveCSS('scale', 'none');
      if (overlay.name === 'Dialog' || overlay.name === 'Drawer') {
        await expect(page.locator(`.mu-${overlay.name.toLowerCase()}-backdrop`)).toHaveCSS('transition-duration', '0.15s');
      }
      await hide(page, overlay);
      await expect.poll(() => page.evaluate(({ property, duration }) => window.motionTransitions.some((event) => event.closing && event.property === property && event.duration === duration), { property, duration: overlay.duration })).toBe(true);
      await expect(page.locator(overlay.selector).filter({ visible: true })).toHaveCount(overlay.name === 'Collapsible' ? 1 : 0);
      const events = await page.evaluate(() => window.motionTransitions);
      expect(events.every(({ property }) => ['opacity', 'translate'].includes(property))).toBe(true);
    });
  }

  test(`keyboard opening and rapid reversal keep popup motion connected in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    await recordTransitions(page, '.mu-menu-popup', true);
    const trigger = page.locator('#menu').getByRole('button', { name: 'More actions' });
    await trigger.focus();
    await page.keyboard.press('Enter');
    const popup = page.getByRole('menu');
    await expect(popup).toBeVisible();
    await expect(popup).toHaveCSS('transition-duration', '0.1s, 0.1s');
    await expect.poll(() => page.evaluate(() => window.motionTransitions.some(({ closing }) => !closing))).toBe(true);
    expect(await popup.evaluate((element) => element.getAnimations().filter((animation) => animation.playState === 'paused').length)).toBeGreaterThan(0);
    await page.keyboard.press('Escape');
    // Reopen during dismissal rather than waiting for the exit to unmount it.
    await trigger.dispatchEvent('click');
    await expect(trigger).toHaveAttribute('data-popup-open', '');
    await expect(popup).toHaveCount(1);
    await expect(popup).toHaveCSS('opacity', '1');
    await expect(popup).toHaveCSS('translate', 'none');
    await page.keyboard.press('ArrowDown');
    await expect(popup.getByRole('menuitem', { name: /Edit/ })).toHaveAttribute('data-highlighted', '');
    await page.keyboard.press('Escape');
    await expect(popup).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test(`grouped tooltips skip repeated entrance motion in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    const section = page.locator('#tooltip');
    await section.getByRole('button', { name: 'Archive' }).hover();
    await expect(page.locator('.mu-tooltip-popup[data-open]')).toHaveText('Archive⌘ E');
    await section.getByRole('button', { name: 'Share' }).hover();
    const tooltip = page.locator('.mu-tooltip-popup[data-open]');
    await expect(tooltip).toHaveText('Share');
    await expect(tooltip).toHaveCSS('transition-duration', '0s');
  });

  test(`reduced motion disables content and backdrop transitions in ${theme}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const overlay of overlays) {
      await open(page, { theme });
      await recordTransitions(page, overlay.selector);
      await show(page, overlay);
      const popup = page.locator(overlay.selector).filter({ visible: true }).first();
      await expect(popup).toBeVisible();
      await expect(popup).toHaveCSS('transition-duration', '0s');
      await expect(popup).toHaveCSS('opacity', '1');
      if (overlay.name === 'Dialog' || overlay.name === 'Drawer') {
        await expect(page.locator(`.mu-${overlay.name.toLowerCase()}-backdrop`)).toHaveCSS('transition-duration', '0s');
      }
      await hide(page, overlay);
      await expect(page.locator(overlay.selector).filter({ visible: true })).toHaveCount(overlay.name === 'Collapsible' ? 1 : 0);
      expect(await page.evaluate(() => window.motionTransitions)).toEqual([]);
    }
  });
}
