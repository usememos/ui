import { expect, test, type Page } from '@playwright/test';
import { open, themes } from './helpers';

const moreActions = (page: Page) => page.locator('#menu').getByRole('button', { name: 'More actions' });

for (const direction of ['ltr', 'rtl'] as const) {
  test(`Menu: collision flipping keeps 2px overlap and row alignment in ${direction}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/?dir=${direction}`);
    await page.addStyleTag({ content: '#menu [aria-label="More actions"] { position: fixed; top: 80px; right: 8px; }' });
    await moreActions(page).click();
    const move = page.getByRole('menuitem', { name: 'Move to' });
    await move.focus();
    await page.keyboard.press(direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
    const parent = page.getByRole('menu').first();
    const child = page.getByRole('menu').nth(1);
    const [outer, sub, trigger, first] = await Promise.all([parent.boundingBox(), child.boundingBox(), move.boundingBox(), child.getByRole('menuitem').first().boundingBox()]);
    expect(sub!.x).toBeLessThan(outer!.x);
    expect(sub!.x + sub!.width).toBeCloseTo(outer!.x + 2, 3);
    expect(first!.y).toBeCloseTo(trigger!.y, 3);
    await page.keyboard.press('Escape');
    await expect(child).toBeHidden();
    await expect(move).toBeFocused();
  });
}

test('Menu: diagonal pointer travel keeps the parent open and reaches the submenu', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  await moreActions(page).click();
  const move = page.getByRole('menuitem', { name: 'Move to' });
  await move.hover();
  const reading = page.getByRole('menuitem', { name: 'Reading', exact: true });
  await expect(reading).toBeVisible();
  const box = (await reading.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 12 });
  await expect(page.getByRole('menu')).toHaveCount(2);
  await expect(move).toHaveAttribute('data-popup-open', '');
  await reading.click();
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(moreActions(page)).toBeFocused();
});

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

test('Menu: a submenu overlaps its parent by 2px and its first row lines up with the trigger row', async ({ page }) => {
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
  expect(subBox!.x).toBeCloseTo(parentBox!.x + parentBox!.width - 2, 3);
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

for (const theme of themes) {
  test(`Menu: root menus and submenus keep one density across size contexts in ${theme}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const size of ['xs', 'sm', 'md'] as const) {
      await open(page, { theme, size });
      // Table.Root supplies a real inherited size context; the standalone menu has an explicitly sized trigger.
      for (const trigger of [moreActions(page), page.locator('#table .mu-menu-trigger').first()]) {
        await trigger.click();
        const row = page.getByRole('menuitem').first();
        await expect(row).toHaveCSS('height', '28px');
        await expect(row).toHaveCSS('font-size', '13px');
        await expect(row).toHaveCSS('line-height', '18px');
        await expect(row).toHaveCSS('font-weight', '400');
        await expect(row).toHaveCSS('border-radius', '4px');
        await page.keyboard.press('Escape');
      }
      await moreActions(page).click();
      await expect(page.getByRole('menuitem', { name: /Pin/ }).locator('svg')).toHaveCSS('width', '14px');
      const move = page.getByRole('menuitem', { name: 'Move to' });
      await expect(move.locator('svg').last()).toHaveCSS('width', '14px');
      await move.focus();
      await page.keyboard.press('ArrowRight');
      const inbox = page.getByRole('menuitem', { name: 'Inbox' });
      await expect(inbox).toHaveCSS('height', '28px');
      await expect(inbox).toHaveCSS('font-size', '13px');
      await expect(inbox).toHaveCSS('border-radius', '4px');
      await page.keyboard.press('Escape');
      await page.keyboard.press('Escape');
    }
  });
}

test('Menu: 6px padding and separators, row-radius highlights, and a width between menu-width and menu-max-width', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const size of ['sm', 'md'] as const) {
    await open(page, { size });
    await moreActions(page).click();
    const menu = page.getByRole('menu');
    expect(await menu.evaluate((element) => { const style = getComputedStyle(element); return parseFloat(style.paddingTop) + parseFloat(style.borderTopWidth); })).toBe(6);
    await expect(page.getByRole('menuitem', { name: /Pin/ })).toHaveCSS('border-radius', '4px');
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
  expect(box!.height).toBeGreaterThan(28);
  const [label, indicator] = await Promise.all([workspace.locator('.mu-menu-label').boundingBox(), workspace.locator('.mu-menu-indicator').boundingBox()]);
  expect(indicator!.y + indicator!.height / 2).toBeCloseTo(label!.y + label!.height / 2, 0);
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
