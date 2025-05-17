import { test, expect } from '@playwright/test';
import { baseURL } from '../src/config';

test('should pass a simple test', async () => {
  expect(true).toBe(true);
});

test('should navigate to baseURL and verify Ryota-Blog text', async ({ page }) => {
  await page.goto(baseURL);
  
  const title = await page.title();
  expect(title).toContain('Ryota-Blog');
  
  const content = await page.content();
  expect(content).toContain('Ryota-Blog');
  
  console.log('Successfully verified Ryota-Blog text on the page');
});
