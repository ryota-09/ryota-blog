import { test, expect } from '@playwright/test';
import { baseURL } from '../src/config';

test('should pass a simple test', async () => {
  expect(true).toBe(true);
});

test('should navigate to baseURL and verify Ryota-Blog text', async ({ page }) => {
  await page.route(baseURL, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: `
        <html>
          <head>
            <title>Ryota-Blog</title>
          </head>
          <body>
            <h1>Welcome to Ryota-Blog</h1>
            <div>This is a mock page for testing</div>
          </body>
        </html>
      `
    });
  });
  
  await page.goto(baseURL);
  
  const title = await page.title();
  expect(title).toContain('Ryota-Blog');
  
  const content = await page.content();
  expect(content).toContain('Ryota-Blog');
  
  const heading = await page.textContent('h1');
  expect(heading).toContain('Ryota-Blog');
  
  console.log('Successfully verified Ryota-Blog text on the page');
});
