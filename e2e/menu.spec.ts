import { expect, test, type Page } from '@playwright/test';
import { open } from './helpers';

const moreActions = (page: Page) => page.locator('#menu').getByRole('button', { name: 'More actions' });

test('Menu: keyboard opens it, moves through items, and returns focus on close', async ({ page }) => {
  await open(page);
  const trigger = moreActions(page);
  await trigger.focus();
  await page.keyboard.press('Enter');
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  await expect(trigger).toHaveAttribute('data-popup-open', '');
  // The popup takes focus without a ring; the highlighted item shows the `hover` fill (oklch(0.95 0.006 95) in Light), not a ring.
  await expect(menu).toHaveCSS('outline-style', 'none');
  await page.keyboard.press('ArrowDown');
  const edit = page.getByRole('menuitem', { name: /Edit/ });
  await expect(edit).toHaveAttribute('data-highlighted', '');
  await expect(edit).toHaveCSS('background-color', 'oklch(0.95 0.006 95)');
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

test('Menu: rows are 28px at sm and 32px at md', async ({ page }) => {
  for (const [size, height] of [['sm', 28], ['md', 32]] as const) {
    await open(page, { size });
    await moreActions(page).click();
    // Measured once the popup has risen into place.
    await expect.poll(async () => (await page.getByRole('menuitem', { name: /Pin/ }).boundingBox())?.height).toBe(height);
  }
});

test('Menu: 6px padding and separators, row-radius highlights, and a width between menu-width and menu-max-width', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [size, radius] of [['sm', '4px'], ['md', '6px']] as const) {
    await open(page, { size });
    await moreActions(page).click();
    const menu = page.getByRole('menu');
    expect(await menu.evaluate((element) => { const style = getComputedStyle(element); return parseFloat(style.paddingTop) + parseFloat(style.borderTopWidth); })).toBe(6);
    await expect(page.getByRole('menuitem', { name: /Pin/ })).toHaveCSS('border-radius', radius);
    const separator = menu.getByRole('separator');
    await expect(separator).toHaveCSS('margin-top', '6px');
    await expect(separator).toHaveCSS('margin-bottom', '6px');
    // Short labels: the menu sits at its 160px floor, not the old 200px.
    expect(Math.round((await menu.boundingBox())!.width)).toBe(160);
    await page.keyboard.press('Escape');
  }
  // A long label sets the width, up to 280px, and a long description wraps there.
  await open(page);
  await page.addStyleTag({ content: '.mu-menu-description::after { content: " and a long tail that needs more than one line at this width"; }' });
  await page.locator('#menu').getByRole('button', { name: 'Visibility' }).click();
  const menu = page.getByRole('menu');
  expect(Math.round((await menu.boundingBox())!.width)).toBe(280);
  const description = menu.locator('.mu-menu-description').first();
  expect((await description.boundingBox())!.height).toBeGreaterThan(30);
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
