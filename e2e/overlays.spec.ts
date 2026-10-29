import { expect, test, type Page } from '@playwright/test';
import { expectNoAxeViolations, open, themes } from './helpers';

const moreActions = (page: Page) => page.locator('#menu').getByRole('button', { name: 'More actions' });

test('Menu: keyboard opens it, moves through items, and returns focus on close', async ({ page }) => {
  await open(page);
  const trigger = moreActions(page);
  await trigger.focus();
  await page.keyboard.press('Enter');
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  await expect(trigger).toHaveAttribute('data-popup-open', '');
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: /Edit/ })).toHaveAttribute('data-highlighted', '');
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('Menu: a submenu opens to the side with ArrowRight', async ({ page }) => {
  await open(page);
  await moreActions(page).click();
  const moveTo = page.getByRole('menuitem', { name: 'Move to' });
  await moveTo.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('menuitem', { name: 'Inbox' })).toBeVisible();
  const [parent, child] = await Promise.all([moveTo.boundingBox(), page.getByRole('menuitem', { name: 'Inbox' }).boundingBox()]);
  expect(child!.x).toBeGreaterThan(parent!.x + parent!.width - 1);
});

test('Menu: checkbox items stay open and toggle', async ({ page }) => {
  await open(page);
  await page.locator('#menu').getByRole('button', { name: 'View' }).click();
  const archived = page.getByRole('menuitemcheckbox', { name: 'Show archived' });
  await archived.click();
  await expect(archived).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByRole('menu')).toBeVisible();
});

test('Menu: rows are a control tall at each size', async ({ page }) => {
  for (const [size, height] of [['sm', 24], ['md', 32], ['lg', 40]] as const) {
    await open(page, { size });
    await moreActions(page).click();
    // Measured once the popup has risen into place.
    await expect.poll(async () => (await page.getByRole('menuitem', { name: /Pin/ }).boundingBox())?.height).toBe(height);
  }
});

test('Select: picks a value with the keyboard and shows its label', async ({ page }) => {
  await open(page);
  const trigger = page.locator('#select').getByRole('combobox').nth(1);
  await expect(trigger).toHaveText('Choose a language');
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('listbox')).toBeVisible();
  await page.getByRole('option', { name: 'Deutsch' }).click();
  await expect(page.getByRole('listbox')).toBeHidden();
  await expect(trigger).toHaveText('Deutsch');
  await expect(trigger).toBeFocused();
});

test('Select: the field label names the trigger', async ({ page }) => {
  await open(page);
  await expect(page.locator('#select').getByRole('combobox', { name: 'Visibility' })).toBeVisible();
});

test('Dialog: focus moves in, Escape closes it, and focus returns to the trigger', async ({ page }) => {
  await open(page);
  const trigger = page.getByRole('button', { name: 'Create access token' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Create access token' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('textbox')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('Dialog: the X closes it', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: 'Create access token' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('AlertDialog: a backdrop click does not close it; Cancel does', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: 'Delete note' }).click();
  const alert = page.getByRole('alertdialog', { name: 'Delete this note?' });
  await expect(alert).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(alert).toBeVisible();
  await alert.getByRole('button', { name: 'Cancel' }).click();
  await expect(alert).toBeHidden();
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

  test('Toasts span the width at the bottom', async ({ page }) => {
    await open(page);
    await page.locator('#toast').getByRole('button', { name: 'Save' }).click();
    const toast = page.locator('.mu-toast').first();
    await expect(toast).toBeVisible();
    const box = (await toast.boundingBox())!;
    expect(Math.round(box.width)).toBe(390 - 32);
  });
});

test('Popover: opens below its trigger and returns focus on Escape', async ({ page }) => {
  await open(page);
  const trigger = page.locator('#popover').getByRole('button', { name: 'Share' });
  await trigger.click();
  const popup = page.getByRole('dialog', { name: 'Share this note' });
  await expect(popup).toBeVisible();
  const [t, p] = await Promise.all([trigger.boundingBox(), popup.boundingBox()]);
  expect(p!.y).toBeGreaterThan(t!.y + t!.height);
  await page.keyboard.press('Escape');
  await expect(popup).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('Tooltip: opens at once on keyboard focus, and names the trigger', async ({ page }) => {
  await open(page);
  const pin = page.locator('#tooltip').getByRole('button', { name: 'Archive' });
  await pin.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  const tooltip = page.locator('.mu-tooltip-popup');
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveText('Archive⌘ E');
});

test('Toast: shows a toast with its action, and the X closes it', async ({ page }) => {
  await open(page);
  await page.locator('#toast').getByRole('button', { name: 'Archive' }).click();
  const toast = page.locator('.mu-toast', { hasText: 'Note archived' });
  await expect(toast).toBeVisible();
  await expect(toast.getByRole('button', { name: 'Undo' })).toBeVisible();
  // Base UI hides the X from screen readers; Escape and F6 reach the toast instead.
  await toast.locator('.mu-toast-close').click();
  await expect(toast).toHaveCount(0);
});

test('popups only fade under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  const translate = await page.evaluate(() =>
    ['mu-popup-motion', 'mu-dialog-popup'].map((className) => {
      const element = document.createElement('div');
      element.className = className;
      element.setAttribute('data-starting-style', '');
      document.body.append(element);
      const value = getComputedStyle(element).translate;
      element.remove();
      return value;
    }),
  );
  expect(translate).toEqual(['none', 'none']);
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
    await page.locator('#toast').getByRole('button', { name: 'Fail' }).click();
    await expectNoAxeViolations(page, '.mu-toast-viewport');
  });
}
