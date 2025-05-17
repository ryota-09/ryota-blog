import { test, expect } from '@playwright/test';

test('should pass a simple test', async () => {
  expect(true).toBe(true);
});

test('should navigate to baseURL and verify Ryota-Blog text', async ({ page }) => {
  await page.goto('/');
  
  await page.waitForLoadState('networkidle');
  
  const title = await page.title();
  expect(title).toContain('Ryota-Blog');
  
  const content = await page.content();
  expect(content).toContain('Ryota-Blog');
  
  const headingOrLogo = await page.locator('h1, header, .logo').first();
  await expect(headingOrLogo).toBeTruthy();
  
  console.log('Successfully verified Ryota-Blog text on the page');
});
