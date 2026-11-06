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
  // The popup takes focus without a ring; the highlighted item shows the `hover` fill (#ececec in Light), not a ring.
  await expect(menu).toHaveCSS('outline-style', 'none');
  await page.keyboard.press('ArrowDown');
  const edit = page.getByRole('menuitem', { name: /Edit/ });
  await expect(edit).toHaveAttribute('data-highlighted', '');
  await expect(edit).toHaveCSS('background-color', 'rgb(236, 236, 236)');
  await expect(edit).toHaveCSS('outline-style', 'none');
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

test('Menu: a submenu touches its parent and its first row lines up with the trigger row', async ({ page }) => {
  // No rise on open, so the boxes are measured where they come to rest.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  await moreActions(page).click();
  const moveTo = page.getByRole('menuitem', { name: 'Move to' });
  await moveTo.focus();
  await page.keyboard.press('ArrowRight');
  const inbox = page.getByRole('menuitem', { name: 'Inbox' });
  await expect(inbox).toBeVisible();
  const [parentMenu, submenu] = [page.getByRole('menu').first(), page.getByRole('menu').nth(1)];
  await expect(submenu).toHaveAttribute('data-align', 'start');
  const [trigger, first, parentBox, subBox] = await Promise.all([moveTo.boundingBox(), inbox.boundingBox(), parentMenu.boundingBox(), submenu.boundingBox()]);
  expect(first!.y).toBeCloseTo(trigger!.y, 0);
  expect(subBox!.x).toBeCloseTo(parentBox!.x + parentBox!.width, 0);
});

test('Menu: a submenu that opens upward lines its last row up with the trigger row', async ({ page }) => {
  // A short window and taller submenu rows leave no room below, so the submenu aligns to the trigger's end.
  await page.setViewportSize({ width: 640, height: 320 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  await page.addStyleTag({ content: '#menu { position: fixed; inset: 0 auto auto 24px; margin: 0; } .mu-menu-popup[data-nested] .mu-menu-item { height: 60px; }' });
  await moreActions(page).click();
  const moveTo = page.getByRole('menuitem', { name: 'Move to' });
  await moveTo.focus();
  await page.keyboard.press('ArrowRight');
  const submenu = page.getByRole('menu').nth(1);
  await expect(submenu).toBeVisible();
  await expect(submenu).toHaveAttribute('data-align', 'end');
  const [trigger, last] = await Promise.all([moveTo.boundingBox(), submenu.getByRole('menuitem').last().boundingBox()]);
  expect(last!.y + last!.height).toBeCloseTo(trigger!.y + trigger!.height, 0);
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
  for (const [size, height] of [['sm', 24], ['md', 32]] as const) {
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

test('Popover: opens below its trigger and returns focus on Escape', async ({ page }) => {
  await open(page);
  const trigger = page.locator('#popover').getByRole('button', { name: 'Share' });
  await trigger.click();
  const popup = page.getByRole('dialog', { name: 'Share this note' });
  await expect(popup).toBeVisible();
  await expect(popup).toHaveCSS('outline-style', 'none');
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
  // The previous button's tooltip may still be fading out, so look for the open one.
  const tooltip = page.locator('.mu-tooltip-popup[data-open]');
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveText('Archive⌘ E');
});

test('Toast: shows a toast with its action, and the X closes it', async ({ page }) => {
  await open(page);
  await page.locator('#toast').getByRole('button', { name: 'Archive' }).click();
  const toast = page.locator('.mu-toast', { hasText: 'Note archived' });
  await expect(toast).toBeVisible();
  await expect(toast.getByRole('button', { name: 'Undo' })).toBeVisible();
  // Top right, space-6 from the edges, once it has slid in.
  await expect.poll(async () => toast.boundingBox().then((box) => [Math.round(box!.y), Math.round(page.viewportSize()!.width - box!.x - box!.width)])).toEqual([24, 24]);
  // Base UI hides the X from screen readers; Escape and F6 reach the toast instead.
  await toast.locator('.mu-toast-close').click();
  await expect(toast).toHaveCount(0);
});

test('Toast: a toast behind hides its text at once and shows its edge; fanned out, it shows both again', async ({ page }) => {
  await open(page);
  const triggers = page.locator('#toast');
  await triggers.getByRole('button', { name: 'Archive' }).click();
  await triggers.getByRole('button', { name: 'Save' }).click();
  await page.mouse.move(5, 5);
  // Archive's toast is taller than Save's; its text must not fade out below the shorter front toast.
  const behind = page.locator('.mu-toast', { hasText: 'Note archived' }).locator('.mu-toast-content');
  await expect(behind).toHaveAttribute('data-behind', '');
  await expect(behind).toHaveCSS('transition-duration', '0s');
  await expect(behind).toHaveCSS('opacity', '0');
  // The 1px `edge` (#d0d0d0 in Light) keeps the peek visible.
  await expect(behind).toHaveCSS('box-shadow', 'rgb(208, 208, 208) 0px 0px 0px 1px inset');
  await page.locator('.mu-toast', { hasText: 'Settings saved' }).hover();
  await expect(behind).toHaveAttribute('data-expanded', '');
  await expect(behind).toHaveCSS('opacity', '1');
  await expect(behind).toHaveCSS('box-shadow', 'none');
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

test('Menu: a row with a description grows, keeps the check on the label line, and closes on click', async ({ page }) => {
  await open(page);
  await page.locator('#menu').getByRole('button', { name: 'Visibility' }).click();
  const workspace = page.getByRole('menuitemradio', { name: 'Workspace' });
  await expect(workspace).toHaveAccessibleDescription('Members of this workspace');
  const box = await workspace.boundingBox();
  expect(box!.height).toBeGreaterThan(40);
  await workspace.click();
  await expect(page.getByRole('menu')).toBeHidden();
});

test('Popover list: rows drawn with menuClasses on a button and a link start their text at the start edge', async ({ page }) => {
  await open(page);
  await page.locator('#popover').getByRole('button', { name: 'Account' }).click();
  const popup = page.locator('.mu-popover-popup');
  await expect(popup).toHaveCSS('padding-top', '4px');
  await expect(popup).toHaveCSS('row-gap', '0px');
  for (const row of [popup.getByRole('button', { name: 'Settings' }), popup.getByRole('link', { name: 'Sign out' })]) {
    await expect(row).toHaveCSS('text-align', 'start');
    await expect(row).toHaveCSS('height', '32px');
    const [rowBox, popupBox] = await Promise.all([row.boundingBox(), popup.boundingBox()]);
    expect(Math.round(rowBox!.width)).toBe(Math.round(popupBox!.width - 8));
  }
});

test('Popover list: a row that opens a Menu beside the panel lines its first choice up with the row', async ({ page }) => {
  // No rise on open, so the boxes are measured where they come to rest.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  await page.locator('#popover').getByRole('button', { name: 'Account' }).click();
  const row = page.locator('.mu-popover-popup').getByRole('button', { name: /Theme/ });
  await row.click();
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  await expect(menu).toHaveAttribute('data-side', 'inline-end');
  await expect(menu).toHaveAttribute('data-align', 'start');
  const [rowBox, first, panel, menuBox] = await Promise.all([row.boundingBox(), menu.getByRole('menuitemradio').first().boundingBox(), page.locator('.mu-popover-popup').boundingBox(), menu.boundingBox()]);
  expect(first!.y).toBeCloseTo(rowBox!.y, 0);
  expect(menuBox!.x).toBeCloseTo(panel!.x + panel!.width, 0);  // The row keeps its highlight while its menu is open.
  await expect(row).toHaveAttribute('data-popup-open', '');
  expect(await row.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
});

test('Popover list: a row\'s Menu that opens upward lines its last choice up with the row', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  // Taller choices and a window that ends just below the row leave no room below.
  await page.addStyleTag({ content: '#popover { position: fixed; inset: 0 auto auto 24px; margin: 0; } .mu-menu-popup .mu-menu-item { height: 60px; }' });
  await page.locator('#popover').getByRole('button', { name: 'Account' }).click();
  const row = page.locator('.mu-popover-popup').getByRole('button', { name: /Theme/ });
  const box = await row.boundingBox();
  await page.setViewportSize({ width: 1000, height: Math.round(box!.y + box!.height + 60) });
  await row.click();
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  await expect(menu).toHaveAttribute('data-align', 'end');
  const [rowBox, last] = await Promise.all([row.boundingBox(), menu.getByRole('menuitemradio').last().boundingBox()]);
  expect(last!.y + last!.height).toBeCloseTo(rowBox!.y + rowBox!.height, 0);
});

test('Menu: a menu that opens below its trigger does not move along it', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  await moreActions(page).click();
  const menu = page.getByRole('menu');
  await expect(menu).toHaveAttribute('data-side', 'bottom');
  const [trigger, menuBox] = await Promise.all([moreActions(page).boundingBox(), menu.boundingBox()]);
  // Centered under the trigger, as Base UI places it.
  expect(menuBox!.x + menuBox!.width / 2).toBeCloseTo(trigger!.x + trigger!.width / 2, 0);
});

test('Dialog bare: content runs edge to edge with no X, and Escape closes it', async ({ page }) => {
  await open(page);
  const trigger = page.getByRole('button', { name: 'Quick find' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Quick find' });
  await expect(dialog).toHaveCSS('padding-top', '0px');
  await expect(dialog.getByRole('button', { name: 'Close' })).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('Drawer: slides from its edge, closes on Escape, and returns focus', async ({ page }) => {
  await open(page);
  const trigger = page.getByRole('button', { name: 'Open navigation' });
  await trigger.click();
  const drawer = page.getByRole('dialog', { name: 'Navigation' });
  await expect(drawer).toBeVisible();
  // Poll until it has slid in: the transition starts a frame after the drawer mounts.
  await expect.poll(async () => drawer.boundingBox().then((box) => box!.x)).toBe(0);
  expect((await drawer.boundingBox())!.height).toBe(page.viewportSize()!.height);
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
  await expect(trigger).toBeFocused();

  await page.getByRole('button', { name: 'Note details' }).click();
  const details = page.getByRole('dialog', { name: 'Note details' });
  await expect(details).toBeVisible();
  await expect.poll(async () => details.boundingBox().then((box) => Math.round(box!.x + box!.width))).toBe(page.viewportSize()!.width);
  expect(Math.round((await details.boundingBox())!.width)).toBe(320);
  await details.getByRole('button', { name: 'Close' }).click();
  await expect(details).toBeHidden();
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
    await expectNoAxeViolations(page, '.mu-toast-viewport');
  });
}

test('Dialog: fullScreen covers the viewport with square corners', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: 'View image' }).click();
  const dialog = page.locator('[data-full-screen]');
  await expect(dialog).toBeVisible();
  await expect.poll(async () => dialog.boundingBox().then((box) => `${Math.round(box!.x)},${Math.round(box!.y)},${Math.round(box!.width)}x${Math.round(box!.height)}`)).toBe(`0,0,${page.viewportSize()!.width}x${page.viewportSize()!.height}`);
  await expect(dialog).toHaveCSS('border-top-left-radius', '0px');
  await dialog.getByRole('button', { name: 'Close' }).click();
  await expect(dialog).toBeHidden();
});

test('Drawer: bare content is the drawer height, the side drawer has an inner edge, and a hidden Close', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  const drawer = page.getByRole('dialog', { name: 'Navigation' });
  await expect.poll(async () => drawer.boundingBox().then((box) => box!.x)).toBe(0);
  await expect(drawer).toHaveCSS('border-right-width', '1px');
  const content = drawer.locator('.mu-drawer-content');
  expect(Math.round((await content.boundingBox())!.height)).toBe(page.viewportSize()!.height);
  const close = drawer.locator('.mu-drawer-sr-close');
  await expect(close).toHaveAttribute('tabindex', '-1');
  await expect(close).toHaveText('Close');
  await close.dispatchEvent('click');
  await expect(drawer).toBeHidden();
});
