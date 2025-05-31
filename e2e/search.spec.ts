import { test, expect } from '@playwright/test';

test.describe('検索機能のテスト', () => {
  test('SRCH-01: 検索（キーワード一致）', async ({ page }) => {
    await page.goto('/blogs');
    
    const searchForm = await page.locator('input[type="search"], input[name="keyword"], input[placeholder*="検索"]').first();
    
    if (await searchForm.count() > 0) {
      await searchForm.fill('テスト');
      
      const searchButton = await page.locator('button[type="submit"], button:has-text("検索")').first();
      
      await searchButton.click();
      
      await page.waitForURL('**/blogs?keyword=テスト');
      await expect(page.url()).toContain('keyword=テスト');
      
      const searchResults = await page.locator('article').first();
      if (await searchResults.count() > 0) {
        await expect(searchResults).toBeVisible();
      }
    }
  });

  test('SRCH-02: 検索（キーワード不一致）', async ({ page }) => {
    await page.goto('/blogs');
    
    const searchForm = await page.locator('input[type="search"], input[name="keyword"], input[placeholder*="検索"]').first();
    
    if (await searchForm.count() > 0) {
      await searchForm.fill('存在しないキーワード12345');
      
      const searchButton = await page.locator('button[type="submit"], button:has-text("検索")').first();
      
      await searchButton.click();
      
      await page.waitForURL('**/blogs?keyword=存在しないキーワード12345');
      
      const noResultsMessage = await page.locator('text=/記事が見つかりません|検索結果がありません|No results found/i').first();
      if (await noResultsMessage.count() > 0) {
        await expect(noResultsMessage).toBeVisible();
      } else {
        const articles = await page.locator('article');
        await expect(articles).toHaveCount(0);
      }
    }
  });

  test('SRCH-03: 検索（空文字）', async ({ page }) => {
    await page.goto('/blogs');
    
    const searchForm = await page.locator('input[type="search"], input[name="keyword"], input[placeholder*="検索"]').first();
    
    if (await searchForm.count() > 0) {
      await searchForm.fill('');
      
      const searchButton = await page.locator('button[type="submit"], button:has-text("検索")').first();
      
      await searchButton.click();
      
      
      await expect(page.url()).not.toContain('keyword=');
      
      const errorMessage = await page.locator('text=/キーワードを入力|入力してください|Please enter/i').first();
      if (await errorMessage.count() > 0) {
        await expect(errorMessage).toBeVisible();
      }
    }
  });

  test('SRCH-04: 検索（複数キーワード）', async ({ page }) => {
    await page.goto('/blogs');
    
    const searchForm = await page.locator('input[type="search"], input[name="keyword"], input[placeholder*="検索"]').first();
    
    if (await searchForm.count() > 0) {
      await searchForm.fill('テスト 検索');
      
      const searchButton = await page.locator('button[type="submit"], button:has-text("検索")').first();
      
      await searchButton.click();
      
      await page.waitForURL('**/blogs?keyword=テスト 検索');
      await expect(page.url()).toContain('keyword=テスト 検索');
      
      const searchResults = await page.locator('article').first();
      if (await searchResults.count() > 0) {
        await expect(searchResults).toBeVisible();
      }
    }
  });
});
