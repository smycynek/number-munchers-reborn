import { expect, test } from '@playwright/test';

test('Has correct title, can start, and properly finish', async ({ page }) => {
  await page.goto('/?p=a');
  await expect(page).toHaveTitle('Number Munchers Reborn - Addition');

  const start = page.getByRole('button', { name: 'Start Playing' });
  await start.click();

  const sound = page.getByTitle('Sound Effects');
  await sound.click();

  const questionStart = page.getByTitle('message');
  let questionStartText = await questionStart.innerText();
  expect(questionStartText).toBe('Start clicking or tapping numbers!');

  const puzzleSymbols = page.getByTitle('puzzle-symbols');
  let puzzleSymbolsText = await puzzleSymbols.innerText();
  expect(puzzleSymbolsText).toEqual('(Puzzles: +)');

  for (let idx = 0; idx < 4; idx++) {
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
  }

  const questionDetailsEnd = page.getByTitle('message');
  let questionDetailsEndText = await questionDetailsEnd.innerText();
  expect(questionDetailsEndText).toBe('You found all the correct answers!');
});
