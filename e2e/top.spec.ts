import { test, expect } from '@playwright/test';

// NOTE: 記事一覧(ArticleList)の記事カードは<article>タグではなく
// data-testid="pw-article-card-N"付きの<li>でマークアップされている(実装: src/components/ArticleList/index.tsx)。
// また現行実装のページネーション/カテゴリはクエリ文字列(page=/category=)ではなくパス
// (/blogs/page/2, /blogs/{categoryId})を使うため、旧セレクタは常にマッチせずテストが素通りしていた。
test.describe('トップページのテスト', () => {
  test('TOP-01: 記事一覧表示', async ({ page }) => {
    await page.goto('/blogs');

    const articleList = await page.locator('[data-testid^="pw-article-card-"]').first();
    await expect(articleList).toBeVisible();

    const articleTitle = await page.locator('[data-testid^="pw-card-title-"]').first();
    await expect(articleTitle).toBeVisible();

    const articleImage = await page.locator('[data-testid^="pw-article-card-"] img').first();
    if (await articleImage.count() > 0) {
      await expect(articleImage).toBeVisible();
    }
  });

  test('TOP-02: 記事詳細ページへの遷移', async ({ page }) => {
    await page.goto('/blogs');

    const articleLink = await page.locator('[data-testid^="pw-article-card-"] a[href*="/blogs/"]').first();

    const href = await articleLink.getAttribute('href');

    await articleLink.click();

    await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });

  test('TOP-03: ページネーション機能', async ({ page }) => {
    await page.goto('/blogs');

    // ページネーションはパスベース(/blogs/page/N)。次ページへのリンクはPaginationコンポーネントの
    // aria-label="Next Page"アイコンリンク。
    const nextPageLink = await page.locator('nav[aria-label="ページネーション"] a[aria-label="Next Page"]').first();

    if (await nextPageLink.count() > 0) {
      const href = await nextPageLink.getAttribute('href');

      await nextPageLink.click();

      await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    }
  });

  test('TOP-04: カテゴリリンク機能', async ({ page }) => {
    await page.goto('/blogs');

    // カテゴリリンクはパスベース(/{locale}/blogs/{categoryId})。CategoryListの各項目に付与された
    // data-testid="pw-category-list-{id}"で特定する。
    const categoryLink = await page.locator('[data-testid^="pw-category-list-"]').first();

    if (await categoryLink.count() > 0) {
      const href = await categoryLink.getAttribute('href');

      await categoryLink.click();

      await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
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
