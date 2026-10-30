import { expect, test, type Locator, type Page } from '@playwright/test';
import { open } from './helpers';

// Icon-only controls are squares with the icon in the middle. Controls with an
// icon before their label have 2px less padding on the icon side
// (docs/components/button.md, docs/layout.md).

/** Padding, size and where the icon's center sits, relative to the control's center. */
function measure(control: Locator) {
  return control.evaluate((element) => {
    const style = getComputedStyle(element);
    const box = element.getBoundingClientRect();
    const icon = element.querySelector(':scope > svg')!.getBoundingClientRect();
    return {
      paddingStart: style.paddingInlineStart,
      paddingEnd: style.paddingInlineEnd,
      width: box.width,
      height: box.height,
      offsetX: icon.left + icon.width / 2 - (box.left + box.width / 2),
      offsetY: icon.top + icon.height / 2 - (box.top + box.height / 2),
    };
  });
}

async function expectCentered(control: Locator, label: string) {
  const { paddingStart, paddingEnd, width, height, offsetX, offsetY } = await measure(control);
  expect({ paddingStart, paddingEnd }, label).toEqual({ paddingStart: '0px', paddingEnd: '0px' });
  expect(width, label).toBe(height);
  expect(Math.abs(offsetX), label).toBeLessThanOrEqual(0.5);
  expect(Math.abs(offsetY), label).toBeLessThanOrEqual(0.5);
}

/** The control's --mu-row-padding and --mu-row-padding-icon, resolved to pixels. */
const rowPadding = (control: Locator) =>
  control.evaluate((element) => {
    const style = getComputedStyle(element);
    return { padding: style.getPropertyValue('--mu-row-padding').trim(), icon: style.getPropertyValue('--mu-row-padding-icon').trim() };
  });

/** Adds an element to the button section with the given classes and an icon, as an app does with buttonClasses(). */
async function addLink(page: Page, className: string) {
  await page.locator('#button').evaluate((section, classes) => {
    const link = document.createElement('a');
    link.href = '#button';
    link.className = classes;
    link.dataset.test = 'link';
    link.setAttribute('aria-label', 'Open');
    link.append(section.querySelector('svg')!.cloneNode(true));
    section.append(link);
  }, className);
  return page.locator('#button [data-test="link"]');
}

for (const size of ['xs', 'sm', 'md'] as const) {
  test.describe(`at ${size}`, () => {
    test('every icon-only button and toggle centers its icon in a square', async ({ page }) => {
      await open(page, { size });
      const controls = page.locator('.mu-button-icon, .mu-toggle-icon');
      const count = await controls.count();
      expect(count).toBeGreaterThan(5);
      for (let i = 0; i < count; i++) {
        const control = controls.nth(i);
        if (!(await control.isVisible())) continue;
        await expectCentered(control, `${await control.getAttribute('aria-label')} (${await control.getAttribute('class')})`);
      }
    });

    test('a link with buttonClasses({ iconOnly: true }) centers its icon too', async ({ page }) => {
      await open(page, { size });
      const iconButton = page.locator('#button .mu-button-icon').first();
      const link = await addLink(page, (await iconButton.getAttribute('class'))!);
      await expectCentered(link, 'link');
    });

    test('a button or toggle with an icon and a label has less padding on the icon side', async ({ page }) => {
      await open(page, { size });
      for (const selector of ['#button button.mu-button:not(.mu-button-icon)', '#toggle .mu-toggle:not(.mu-toggle-icon)']) {
        const control = page.locator(selector).filter({ has: page.locator(':scope > svg:first-child') }).first();
        const { padding, icon } = await rowPadding(control);
        await expect(control, selector).toHaveCSS('padding-inline-start', icon);
        await expect(control, selector).toHaveCSS('padding-inline-end', padding);
      }
    });
  });
}
