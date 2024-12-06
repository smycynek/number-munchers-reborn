import { expect, test } from '@playwright/test';
import { buttonClick, checkText } from './utility';

test('Has correct title, can start, and properly finish', async ({ page }) => {
  await page.goto('/?p=a');
  await expect(page).toHaveTitle('Number Munchers Reborn - Addition');
  await buttonClick(page, 'Start Playing');
  await buttonClick(page, 'Sound Effects');
  await checkText(page, 'message', 'Start clicking or tapping numbers!');
  await checkText(page, 'puzzle-symbols', '(Puzzles: +)');

  for (let idx = 0; idx < 4; idx++) {
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
  }
  await checkText(page, 'message', 'You found all the correct answers!');
});
