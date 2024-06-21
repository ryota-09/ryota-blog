import { test, expect } from '@playwright/test';

const targetUrl = 'https://ryotablog.jp/blogs';

test('goto target page', async ({ page }) => {
  await page.goto(targetUrl);
});

