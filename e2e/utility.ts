import { expect, test } from '@playwright/test';

export async function buttonClick(page: any, title: string) {
  const button = page.getByTitle(title);
  return await button.click();
}

export async function checkText(page: any, title: string, contains: string) {
  const itemText = page.getByTitle(title);
  const itemTextText = await itemText.innerText();
  expect(itemTextText).toContain(contains);
}
