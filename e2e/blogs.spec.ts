import { test, expect } from '@playwright/test';

// NOTE(#241 移行):
// - 旧テストは `@/config` のbaseURL(dev用ポート3006)へ直接アクセスしていたため接続不能だった。
//   playwright.config.tsのbaseURL(3001)に任せる相対パスに統一する。
// - カテゴリはクエリ(?category=CSS)ではなくパス(/{locale}/blogs/{categoryId})ベースに移行済み。
// - 検索遷移(SearchBar)はrouter.replaceによるSPA遷移でloadイベントが発火しないため、
//   waitForURLではなくexpect(page).toHaveURL(...)のポーリングで待つ(#238引き継ぎ)。

const targetUrl = '/blogs';
// /blogsはmiddlewareでデフォルトロケールの/ja/blogsへ301リダイレクトされる
const canonicalBlogsPattern = /\/ja\/blogs\/?$/;

// Description: Render Test for Blogs Page

test('goto target page', async ({ page }) => {
  await page.goto(targetUrl);
  await expect(page).toHaveURL(canonicalBlogsPattern);
});

test('should render 4 article cards', async ({ page }) => {
  await page.goto(targetUrl);
  // PER_PAGE=4: 現データ(ja 30記事)では1ページ目に必ず4枚のカードが表示される
  await page.waitForSelector('[data-testid=pw-article-card-3]');
  const articleCard = await page.$('[data-testid=pw-article-card-3]');
  expect(articleCard).not.toBeNull();
});

test('should render "New" label', async ({ page }) => {
  // NOTE: Newラベルは公開から2週間以内の記事にのみ付く(isWithinTwoWeeks)。
  // コンテンツフリーズ後に最新記事が2週間より古くなると成立しなくなる、実データ依存のテスト。
  await page.goto(targetUrl);
  await page.waitForSelector('[data-testid=pw-new-label]');
  const label = await page.$('[data-testid=pw-new-label]');
  expect(label).not.toBeNull();
});

test('should render search bar', async ({ page }) => {
  await page.goto(targetUrl);
  await page.waitForSelector('[data-testid=pw-search-bar]');
  const searchBar = await page.$('[data-testid=pw-search-bar]');
  expect(searchBar).not.toBeNull();
});

test('should render category list', async ({ page }) => {
  await page.goto(targetUrl);
  await page.waitForSelector('[data-testid=pw-category-list]');
  const categoryList = await page.$('[data-testid=pw-category-list]');
  expect(categoryList).not.toBeNull();
});

// Description: Navigation Test for Blogs Page

test('should navigate to the first article', async ({ page }) => {
  await page.goto(targetUrl);
  await page.waitForSelector('[data-testid=pw-card-title-0]');
  // カードのラッパー(li)ではなくタイトルリンクをクリックする(liの中央は非リンク領域のことがある)
  await page.click('[data-testid=pw-card-title-0]');
  await expect(page).toHaveURL(/\/ja\/blogs\/[^/]+\/[^/]+/);
});

test('should navigate to category page', async ({ page }) => {
  await page.goto(targetUrl);
  // カテゴリはパスベース(/ja/blogs/css)。cssカテゴリは実データに存在する(2記事)
  await page.waitForSelector('[data-testid=pw-category-list-css]');
  await page.click('[data-testid=pw-category-list-css]');

  await expect(page).toHaveURL(/\/ja\/blogs\/css\/?$/);
});

test('should navigate to the Zenn page', async ({ page }) => {
  await page.goto(targetUrl);
  await page.waitForSelector('[data-testid=pw-blog-type-tabs-zenn]');
  await page.click('[data-testid=pw-blog-type-tabs-zenn]');

  await expect(page).toHaveURL(/\/ja\/blogs\/zenn\/?$/);
});

test('should navigate to the default page', async ({ page }) => {
  await page.goto('/blogs/zenn');
  await page.waitForSelector('[data-testid=pw-blog-type-tabs-blogs]');
  await page.click('[data-testid=pw-blog-type-tabs-blogs]');

  // ソフトナビゲーション(RSCフェッチ込み)が既定の5秒を超えることがあるため余裕を持たせる
  await expect(page).toHaveURL(canonicalBlogsPattern, { timeout: 15000 });
});

// Description: Search Test for Blogs Page

test('should search articles', async ({ page }) => {
  await page.goto(targetUrl);
  await page.waitForSelector('[data-testid=pw-search-bar-input]');
  await page.fill('[data-testid=pw-search-bar-input]', 'test');
  await page.click('[data-testid=pw-search-bar-button]');

  // 検索結果は動的レンダリング専用の /blogs/search に遷移する(Issue #225)
  await expect(page).toHaveURL(/\/ja\/blogs\/search\?keyword=test/);
});

test('should render Search State Chip', async ({ page }) => {
  // localeなしURLのクエリがリダイレクトで維持されること(middlewareのクエリ引き継ぎ)も同時に検証する
  await page.goto('/blogs?keyword=test');
  await page.waitForSelector('[data-testid=pw-search-chip-keyword]');
  const chip = await page.$('[data-testid=pw-search-chip-keyword]');
  expect(chip).not.toBeNull();
});

test('should render No content page', async ({ page }) => {
  await page.goto('/blogs?keyword=%40%40%40%40%40%40%40%40%40%40%40%40');
  await page.waitForSelector('[data-testid=pw-no-content-page]');
  const noContent = await page.$('[data-testid=pw-no-content-page]');
  expect(noContent).not.toBeNull();
});

test('should reset search condition', async ({ page }) => {
  await page.goto('/blogs?keyword=test');
  await page.waitForSelector('[data-testid=pw-reset-search-state]');
  // ラッパーdivの中のリンク本体をクリックする
  await page.click('[data-testid=pw-reset-search-state] a');

  await expect(page).toHaveURL(canonicalBlogsPattern);
});

test('should search articles with category', async ({ page }) => {
  // カテゴリページ(パスベース)上で検索すると、カテゴリを保持したまま/blogs/searchへ遷移する
  // (SearchBarのhandleSubmit: /{locale}/blogs/search?keyword=...&category={categoryId})
  await page.goto('/blogs/typescript');
  await page.waitForSelector('[data-testid=pw-search-bar-input]');
  await page.fill('[data-testid=pw-search-bar-input]', 'API');
  await page.click('[data-testid=pw-search-bar-button]');

  await expect(page).toHaveURL(/\/ja\/blogs\/search\?keyword=API&category=typescript/);
});
