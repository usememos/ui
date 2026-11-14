import { expect, test } from '@playwright/test';
import { open } from './helpers';

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
