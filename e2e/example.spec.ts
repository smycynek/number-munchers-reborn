import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('Number Munchers Reborn');

  // Create a locator.
const start = page.getByRole('button', { name: 'Start Playing' });

// Click it.
await start.click();

});
