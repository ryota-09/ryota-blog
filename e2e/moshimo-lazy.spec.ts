import { test, expect, type Page } from '@playwright/test';

// もしもアフィリエイトウィジェットを9個含む記事(遅延初期化の検証対象)。
// 公開済み記事のURLは維持される運用のため、特定slugへの依存は安定している
const MOSHIMO_ARTICLE_PATH = '/ja/blogs/zakki/best-buy-2026-first-half';

// もしも関連の外部リクエスト(bundle.js・Amazon商品画像)のURLパターン
const MOSHIMO_RESOURCE_PATTERN = /msmstatic\.com|media-amazon\.com/;

// ページ内のもしも関連リクエストを記録するリスナーを仕掛ける
const trackMoshimoRequests = (page: Page): string[] => {
  const requests: string[] = [];
  page.on('request', (req) => {
    if (MOSHIMO_RESOURCE_PATTERN.test(req.url())) {
      requests.push(req.url());
    }
  });
  return requests;
};

test.describe('もしもウィジェットの遅延初期化(ExecutableScript lazyRootMargin)', () => {
  test('MOSHIMO-01: 初期ロードではもしも関連の外部リクエストが発生しない', async ({ page }) => {
    const moshimoRequests = trackMoshimoRequests(page);

    await page.goto(MOSHIMO_ARTICLE_PATH);
    await page.waitForLoadState('networkidle');

    // ウィジェットのプレースホルダー自体はSSRで9個描画されている
    await expect(page.locator('[id^="msmaflink-"]')).toHaveCount(9);

    // ファーストビュー外のウィジェットは初期化されず、bundle.js・商品画像とも未取得
    expect(moshimoRequests).toHaveLength(0);
  });

  test('MOSHIMO-02: ウィジェットへスクロールすると初期化され描画される', async ({ page }) => {
    const moshimoRequests = trackMoshimoRequests(page);

    await page.goto(MOSHIMO_ARTICLE_PATH);
    await page.waitForLoadState('networkidle');

    // 最初のウィジェットの位置までスクロールするとIntersectionObserverが発火する
    await page.locator('[id^="msmaflink-"]').first().scrollIntoViewIfNeeded();

    // bundle.jsが描画するカルーセル本体(.easyLink-box)の出現を待つ
    await expect(page.locator('.easyLink-box').first()).toBeVisible({ timeout: 15000 });

    // bundle.jsと1枚目の商品画像が取得されている
    expect(moshimoRequests.some((url) => url.includes('msmstatic.com'))).toBe(true);
    expect(moshimoRequests.some((url) => url.includes('media-amazon.com'))).toBe(true);
  });

  test('MOSHIMO-03: 記事末尾までスクロールすると全ウィジェットが描画される', async ({ page }) => {
    await page.goto(MOSHIMO_ARTICLE_PATH);
    await page.waitForLoadState('networkidle');

    // 実ユーザーのスクロールを模して段階的に最下部まで移動する
    // (一気に飛ぶと中間のウィジェットのIntersectionObserverが発火しないため)
    const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const viewport = page.viewportSize()?.height ?? 720;
    for (let y = 0; y < totalHeight; y += viewport) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(200);
    }

    // 9個すべてのウィジェットが描画される(bundle.jsは描画済みdivのidに-1を付けてリネームする)
    await expect(page.locator('.easyLink-box')).toHaveCount(9, { timeout: 15000 });
  });

  test('MOSHIMO-04: ソフトナビゲーションで遷移してもウィジェットが描画される', async ({ page }) => {
    // 一覧ページからLinkクリックでSPA遷移する(f0b1eb5の合成loadディスパッチのリグレッション防止)
    await page.goto('/ja/blogs');
    await page.waitForLoadState('networkidle');

    const articleLink = page.locator(`a[href*="best-buy-2026-first-half"]`).first();
    await expect(articleLink).toBeVisible();
    await articleLink.click();

    // SPA遷移完了(記事タイトル表示)を待つ
    await expect(page).toHaveURL(new RegExp('best-buy-2026-first-half'));
    await expect(page.locator('h1').first()).toBeVisible();

    // ウィジェットへスクロールして描画されることを確認する
    await page.locator('[id^="msmaflink-"]').first().scrollIntoViewIfNeeded();
    await expect(page.locator('.easyLink-box').first()).toBeVisible({ timeout: 15000 });
  });
});
