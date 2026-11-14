import { expect, test, type Locator, type Page } from '@playwright/test';
import { expectNoAxeViolations, open, themes } from './helpers';

const moreActions = (page: Page) => page.locator('#menu').getByRole('button', { name: 'More actions' });

test.describe('on a touch screen', () => {
  test.use({ hasTouch: true, isMobile: true });
  test('sm checkbox, switch and radio keep their size without extra margins or hit areas', async ({ page }) => {
    await open(page, { size: 'sm' });
    for (const [selector, height] of [['#checkbox .mu-checkbox', 16], ['#switch .mu-switch', 18], ['#radio-group .mu-radio', 16]] as const) {
      const control = page.locator(selector).first();
      expect((await control.boundingBox())!.height, selector).toBe(height);
      await expect(control).toHaveCSS('margin', '0px');
      expect(await control.evaluate((element) => getComputedStyle(element, '::after').content), selector).toBe('none');
    }
  });
});

test('mu-compact: md controls inside are 28px tall, sm outside it stays 24px', async ({ page }) => {
  await open(page);
  const compact = page.locator('[data-compact]').getByRole('combobox');
  expect((await compact.boundingBox())!.height).toBe(28);
  const plain = page.locator('#select').getByRole('combobox', { name: 'Space', exact: true });
  expect((await plain.boundingBox())!.height).toBe(32);
});

test('Select and Combobox: sm list rows are 28px with row-radius highlights and 6px padding', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page, { size: 'sm' });
  await page.locator('#select').getByRole('combobox').nth(1).click();
  const listbox = page.getByRole('listbox');
  await expect(listbox).toBeVisible();
  const option = page.getByRole('option', { name: 'Deutsch' });
  await expect.poll(async () => (await option.boundingBox())?.height).toBe(28);
  await expect(option).toHaveCSS('border-radius', '4px');
  expect(await page.locator('.mu-select-popup').evaluate((element) => { const style = getComputedStyle(element); return parseFloat(style.paddingTop) + parseFloat(style.borderTopWidth); })).toBe(6);
  await page.keyboard.press('Escape');
  await page.getByPlaceholder('Find a tag').click();
  await page.keyboard.press('ArrowDown');
  const comboOption = page.locator('.mu-combobox-list').getByRole('option').first();
  await expect.poll(async () => (await comboOption.boundingBox())?.height).toBe(28);
  await expect(comboOption).toHaveCSS('border-radius', '4px');
  expect(await page.locator('.mu-combobox-list').first().evaluate((element) => parseFloat(getComputedStyle(element).paddingTop) + parseFloat(getComputedStyle(element.parentElement!).borderTopWidth))).toBe(6);
});

for (const theme of themes) {
  for (const size of ['sm', 'md'] as const) {
    test(`floating-list items keep 8px content edges at ${size} in ${theme}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await open(page, { theme, size });
      const expectInset = async (...parts: Locator[]) => {
        for (const part of parts) {
          await expect(part).toHaveCSS('padding-inline-start', '8px');
          await expect(part).toHaveCSS('padding-inline-end', '8px');
        }
      };
      await moreActions(page).click();
      const pin = page.getByRole('menuitem', { name: /Pin/ });
      const move = page.getByRole('menuitem', { name: 'Move to' });
      await expectInset(pin, move);
      const [icon, label] = await Promise.all([pin.locator('svg').boundingBox(), pin.locator('.mu-menu-label').boundingBox()]);
      expect(label!.x - icon!.x - icon!.width).toBe(8);
      const [row, arrow] = await Promise.all([move.boundingBox(), move.locator('svg').last().boundingBox()]);
      expect(row!.x + row!.width - arrow!.x - arrow!.width).toBe(6);
      await move.focus();
      await page.keyboard.press('ArrowRight');
      await expectInset(page.getByRole('menuitem', { name: 'Inbox' }));
      await page.keyboard.press('Escape');
      await page.keyboard.press('Escape');
      await page.locator('#menu').getByRole('button', { name: 'View', exact: true }).click();
      await expectInset(page.getByRole('menuitemcheckbox', { name: 'Show archived' }), page.locator('.mu-menu-group-label'));
      await page.keyboard.press('Escape');
      await page.locator('#menu').getByRole('button', { name: 'Visibility', exact: true }).click();
      await expectInset(page.getByRole('menuitemradio', { name: 'Workspace' }));
      await page.keyboard.press('Escape');
      await page.locator('#select').getByRole('combobox', { name: 'Visibility', exact: true }).click();
      await expectInset(page.getByRole('option', { name: 'Private' }));
      await page.keyboard.press('Escape');
      await page.locator('#select').getByRole('combobox').nth(1).click();
      await expectInset(page.getByRole('option', { name: 'Deutsch' }), page.locator('.mu-select-group-label').first());
      await page.keyboard.press('Escape');
      await page.getByRole('combobox', { name: 'Tag', exact: true }).fill('book');
      const book = page.getByRole('option', { name: 'book', exact: true });
      await expectInset(book);
      // A leading icon must not move the content edge.
      await book.evaluate((element) => element.prepend(document.querySelector('#menu svg')!.cloneNode(true)));
      await expectInset(book);
      await page.keyboard.press('Escape');
      await page.locator('#popover').getByRole('button', { name: 'Account', exact: true }).click();
      const popup = page.locator('.mu-popover-popup');
      const themeRow = popup.getByRole('button', { name: /Theme/ });
      await expectInset(popup.getByRole('button', { name: 'Settings' }), popup.getByRole('link', { name: 'Sign out' }), themeRow, popup.locator('.mu-popover-title'), popup.locator('.mu-popover-description'));
      const [customRow, customArrow] = await Promise.all([themeRow.boundingBox(), themeRow.locator('svg').last().boundingBox()]);
      expect(customRow!.x + customRow!.width - customArrow!.x - customArrow!.width).toBe(6);
    });
  }
}

test('Dialog and Drawer: the description sits 4px under the title, and blocks stack 16px apart', async ({ page }) => {
  // A panel moves while it opens. With reduced motion it does not, and both parts are read in one
  // call, so the gap never mixes two moments of that movement.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  /** The space between the bottom of one part and the top of the next. */
  const gap = async (above: Locator, below: Locator) => {
    const next = await below.elementHandle();
    return above.evaluate((a, b) => Math.round(b!.getBoundingClientRect().top - a.getBoundingClientRect().bottom), next);
  };
  for (const trigger of ['Create access token', 'Note details']) {
    await page.getByRole('button', { name: trigger }).click();
    const dialog = page.getByRole('dialog');
    const description = dialog.locator('.mu-dialog-description, .mu-drawer-description');
    await expect(dialog).toBeVisible();
    expect(await gap(dialog.getByRole('heading'), description)).toBe(4);
    expect(await gap(description, dialog.locator('.mu-field-root').first())).toBe(16);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  }
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 760 } });
  test('Dialog becomes a sheet at the bottom with stacked buttons', async ({ page }) => {
    await open(page);
    await page.getByRole('button', { name: 'Create access token' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    // The sheet slides up over duration-settle.
    await expect.poll(async () => dialog.boundingBox().then((box) => Math.round(box!.y + box!.height))).toBe(760);
    expect((await dialog.boundingBox())!.width).toBe(390);
    const [cancel, create] = await Promise.all([dialog.getByRole('button', { name: 'Cancel' }).boundingBox(), dialog.getByRole('button', { name: 'Create' }).boundingBox()]);
    expect(create!.y).toBeLessThan(cancel!.y);
    expect(create!.width).toBe(cancel!.width);
  });
  test('Toasts span the width at the top', async ({ page }) => {
    await open(page);
    await page.locator('#toast').getByRole('button', { name: 'Save' }).click();
    const toast = page.locator('.mu-toast').first();
    await expect(toast).toBeVisible();
    const box = (await toast.boundingBox())!;
    expect(Math.round(box.width)).toBe(390 - 32);
    await expect.poll(async () => Math.round((await toast.boundingBox())!.y)).toBe(16);
  });
});

for (const theme of themes) {
  test(`built-in close tooltips preserve keyboard activation in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    await page.keyboard.press('Tab');
    for (const [name, selector] of [['Create access token', '.mu-dialog-x'], ['Note details', '.mu-drawer-x']] as const) {
      const trigger = page.getByRole('button', { name, exact: true });
      await trigger.click();
      const close = page.locator(selector);
      await close.focus();
      await page.keyboard.press('Shift+Tab');
      await page.keyboard.press('Tab');
      await expect(close).toBeFocused();
      await expect(page.locator('.mu-tooltip-popup[data-open]')).toHaveText('Close');
      await page.keyboard.press('Enter');
      await expect(close).toHaveCount(0);
      await expect(trigger).toBeFocused();
    }
    await page.locator('#toast').getByRole('button', { name: 'Fail', exact: true }).click();
    const close = page.locator('.mu-toast-close');
    await close.hover();
    await expect(page.locator('.mu-tooltip-popup[data-open]')).toHaveText('Close');
    await close.click();
    await expect(page.locator('.mu-toast')).toHaveCount(0);
  });
}

test('popup motion is disabled under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  const styles = await page.evaluate(() => ['mu-popup-motion', 'mu-dialog-popup'].map((className) => {
    const element = document.createElement('div');
    element.className = className;
    element.setAttribute('data-starting-style', '');
    document.body.append(element);
    const style = getComputedStyle(element);
    const value = { translate: style.translate, duration: style.transitionDuration };
    element.remove();
    return value;
  }));
  expect(styles).toEqual([{ translate: 'none', duration: '0s' }, { translate: 'none', duration: '0s' }]);
});

for (const theme of themes) {
  test(`open overlays have no axe violations in ${theme}`, async ({ page }) => {
    await open(page, { theme });
    await moreActions(page).click();
    await expectNoAxeViolations(page, '[role="menu"]');
    await page.keyboard.press('Escape');
    await page.locator('#select').getByRole('combobox').first().click();
    await expectNoAxeViolations(page, '[role="listbox"]');
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Create access token' }).click();
    await expectNoAxeViolations(page, '[role="dialog"]');
    await page.keyboard.press('Escape');
    await page.locator('#menu').getByRole('button', { name: 'Visibility' }).click();
    await expectNoAxeViolations(page, '[role="menu"]');
    await page.keyboard.press('Escape');
    await page.locator('#popover').getByRole('button', { name: 'Account' }).click();
    await expectNoAxeViolations(page, '.mu-popover-popup');
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Note details' }).click();
    await expectNoAxeViolations(page, '.mu-drawer-popup');
    await page.keyboard.press('Escape');
    await page.locator('#toast').getByRole('button', { name: 'Fail' }).click();
    await expect(page.locator('.mu-toast')).toBeVisible();
    await expectNoAxeViolations(page, '.mu-toast-viewport');
  });
}

test('Form: bordered has a List edge and a canvas footer bar that runs to the edges', async ({ page }) => {
  await open(page);
  const form = page.locator('#form form[data-bordered]');
  await expect(form).toHaveCSS('border-top-width', '1px');
  await expect(page.getByRole('form', { name: 'Add a tag rule' })).toBeVisible();
  const footer = form.locator('.mu-form-footer');
  await expect(footer).toHaveCSS('background-color', 'oklch(0.982 0.004 95)');
  const [formBox, footerBox] = [await form.boundingBox(), await footer.boundingBox()];
  expect(Math.round(footerBox!.width)).toBe(Math.round(formBox!.width) - 2);
  expect(Math.round(footerBox!.y + footerBox!.height)).toBe(Math.round(formBox!.y + formBox!.height) - 1);
  await expect(page.locator('#form form').nth(1)).toHaveCSS('border-top-width', '0px');
});
