import { expect, test } from '@playwright/test';
import { buttonClick, checkText } from './utility';

test('Can execute dialogs', async ({ page }) => {
  await page.goto('/?p=a');
  await expect(page).toHaveTitle('Number Munchers Reborn - Addition');

  await buttonClick(page, 'Start Playing');
  await buttonClick(page, 'Sound Effects');
  await buttonClick(page, 'Help Button');

  await checkText(
    page,
    'helpSummary',
    'Number Munchers Reborn is a re-imagining of the classic 90s game.'
  );
  await page.keyboard.press('Escape');

  await buttonClick(page, 'Select puzzle types');
  await buttonClick(page, 'Subtraction');
  await buttonClick(page, 'Addition');
  await buttonClick(page, 'Settings OK');
  await expect(page).toHaveTitle('Number Munchers Reborn - Subtraction');

  await checkText(page, 'Question text', 'differences');
});
