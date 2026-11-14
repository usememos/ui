import { expect, test } from '@playwright/test';
import { open } from './helpers';

test('Collapsible: the trigger toggles the panel and says whether it is open', async ({ page }) => {
  await open(page);
  const trigger = page.getByRole('button', { name: 'Advanced settings' });
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(trigger.locator('.mu-collapsible-chevron')).toHaveCSS('rotate', '180deg');
  await expect(trigger.locator('.mu-collapsible-chevron')).toHaveCSS('transition-duration', '0s');
  await expect(page.getByText('Webhooks, storage and the access token for scripts.')).toBeVisible();
  await page.keyboard.press('Space');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('Collapsible: the panel has no transition under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  const translate = await page.evaluate(() => {
    const element = document.createElement('div');
    element.className = 'mu-collapsible-panel';
    element.setAttribute('data-starting-style', '');
    document.body.append(element);
    const value = getComputedStyle(element).translate;
    element.remove();
    return value;
  });
  expect(translate).toBe('none');
  await page.getByRole('button', { name: 'Advanced settings' }).click();
  await expect(page.getByText('Webhooks, storage and the access token for scripts.')).toHaveCSS('transition-duration', '0s');
});
