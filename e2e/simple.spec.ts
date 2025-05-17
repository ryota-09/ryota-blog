import { test, expect } from '@playwright/test';

test('should pass a simple test', async () => {
  expect(true).toBe(true);
});

test('should create and verify page content', async ({ page }) => {
  await page.setContent(`
    <html>
      <head>
        <title>Ryota-Blog Test Page</title>
      </head>
      <body>
        <h1>Welcome to Ryota-Blog</h1>
        <nav>
          <a href="/blogs">Blogs</a>
          <a href="/about">About</a>
        </nav>
      </body>
    </html>
  `);
  
  const title = await page.title();
  expect(title).toBe('Ryota-Blog Test Page');
  
  const heading = await page.textContent('h1');
  expect(heading).toBe('Welcome to Ryota-Blog');
  
  const blogLink = await page.$('nav a[href="/blogs"]');
  expect(await blogLink?.textContent()).toBe('Blogs');
});
