import { test, expect } from '@playwright/test';

// NOTE: SearchBar(src/components/SearchBar/index.tsx)は
// - input type="text" name="keyword" (type="search"ではない)
// - button type="submit" (テキストラベル無し、SVGアイコンのみ)
// - 送信はrouter.replaceによるSPA遷移(pushStateベース)であり、ブラウザのload/domcontentloadedイベントは
//   発火しない。そのためpage.waitForURL({waitUntil:'load'})相当の待機はタイムアウトする(#238引き継ぎ)。
//   expect(page).toHaveURL(...)のポーリングベースの待機に統一する。
test.describe('検索機能のテスト', () => {
  test('SRCH-00: 検索フォームが存在する', async ({ page }) => {
    await page.goto('/blogs');

    // NOTE: 旧テストは `if (await searchForm.count() > 0)` で検索フォーム未検出時に
    // 何も検証せずパスしていたため、回帰(フォームが消えても気づけない)が起きうる状態だった。
    // フォーム存在を必須アサーションにする(#241)。
    const searchInput = page.locator('[data-testid=pw-search-bar-input]');
    await expect(searchInput).toBeVisible();

    const searchButton = page.locator('[data-testid=pw-search-bar-button]');
    await expect(searchButton).toBeVisible();
  });

  test('SRCH-01: 検索（キーワード一致）', async ({ page }) => {
    await page.goto('/blogs');

    const searchForm = page.locator('[data-testid=pw-search-bar-input]');
    await expect(searchForm).toBeVisible();

    await searchForm.fill('テスト');

    const searchButton = page.locator('[data-testid=pw-search-bar-button]');
    await searchButton.click();

    // 検索結果は動的レンダリング専用の /blogs/search に遷移する(Issue #225)
    await expect(page).toHaveURL(/\/blogs\/search\?keyword=%E3%83%86%E3%82%B9%E3%83%88/);
    expect(page.url()).toContain('keyword=');

    const searchResults = page.locator('[data-testid^="pw-article-card-"]').first();
    if (await searchResults.count() > 0) {
      await expect(searchResults).toBeVisible();
    }
  });

  test('SRCH-02: 検索（キーワード不一致）', async ({ page }) => {
    await page.goto('/blogs');

    const searchForm = page.locator('[data-testid=pw-search-bar-input]');
    await expect(searchForm).toBeVisible();

    await searchForm.fill('存在しないキーワード12345');

    const searchButton = page.locator('[data-testid=pw-search-bar-button]');
    await searchButton.click();

    await expect(page).toHaveURL(/keyword=/);

    // 0件時はNoContentsPage(data-testid="pw-no-content-page")が表示される
    const noContent = page.locator('[data-testid=pw-no-content-page]');
    await expect(noContent).toBeVisible();

    const articles = page.locator('[data-testid^="pw-article-card-"]');
    await expect(articles).toHaveCount(0);
  });

  test('SRCH-03: 検索（空文字）', async ({ page }) => {
    await page.goto('/blogs');

    const searchForm = page.locator('[data-testid=pw-search-bar-input]');
    await expect(searchForm).toBeVisible();

    await searchForm.fill('');

    const searchButton = page.locator('[data-testid=pw-search-bar-button]');
    await searchButton.click();

    // 空文字はkeywordクエリを付けずに/blogsへ戻る(SearchBarのhandleSubmit実装)
    await expect(page).toHaveURL(/\/blogs\/?$/);
    expect(page.url()).not.toContain('keyword=');
  });

  test('SRCH-04: 検索（複数キーワード）', async ({ page }) => {
    await page.goto('/blogs');

    const searchForm = page.locator('[data-testid=pw-search-bar-input]');
    await expect(searchForm).toBeVisible();

    await searchForm.fill('テスト 検索');

    const searchButton = page.locator('[data-testid=pw-search-bar-button]');
    await searchButton.click();

    await expect(page).toHaveURL(/keyword=/);
    expect(page.url()).toContain('keyword=');
  });
});
