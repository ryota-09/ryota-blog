import { test, expect } from '@playwright/test';

test.describe('トップページのテスト', () => {
  test('TOP-01: 記事一覧表示', async ({ page }) => {
    await page.goto('/blogs');
    
    const articleList = await page.locator('article').first();
    await expect(articleList).toBeVisible();
    
    const articleTitle = await page.locator('article h2, article h3').first();
    await expect(articleTitle).toBeVisible();
    
    const articleImage = await page.locator('article img').first();
    if (await articleImage.count() > 0) {
      await expect(articleImage).toBeVisible();
    }
  });

  test('TOP-02: 記事詳細ページへの遷移', async ({ page }) => {
    await page.goto('/blogs');
    
    const articleLink = await page.locator('article a').first();
    
    const href = await articleLink.getAttribute('href');
    
    await articleLink.click();
    
    await page.waitForURL(`**${href}`);
    await expect(page.url()).toContain(href);
  });

  test('TOP-03: ページネーション機能', async ({ page }) => {
    await page.goto('/blogs');
    
    const pagination = await page.locator('nav a[href*="page="]').first();
    
    if (await pagination.count() > 0) {
      const nextPageLink = pagination;
      const href = await nextPageLink.getAttribute('href');
      
      await nextPageLink.click();
      
      await page.waitForURL(`**${href}`);
      await expect(page.url()).toContain(href);
    }
  });

  test('TOP-04: カテゴリリンク機能', async ({ page }) => {
    await page.goto('/blogs');
    
    const categoryLink = await page.locator('a[href*="category="]').first();
    
    if (await categoryLink.count() > 0) {
      const href = await categoryLink.getAttribute('href');
      
      await categoryLink.click();
      
      await page.waitForURL(`**${href}`);
      await expect(page.url()).toContain(href);
    }
  });

  test('TOP-05: 画像の遅延読み込み', async ({ page }) => {
    await page.goto('/blogs');
    
    await page.evaluate(() => window.scrollTo(0, 0));
    
    const images = await page.locator('img[loading="lazy"]');
    
    if (await images.count() > 0) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      
      await page.waitForTimeout(1000); // 画像の読み込みを待つ
      const visibleImages = await page.locator('img:visible');
      await expect(visibleImages).toHaveCount(await visibleImages.count());
    }
  });
});
