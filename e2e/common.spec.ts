import { test, expect } from '@playwright/test';

test.describe('共通項目（全ページ）のテスト', () => {
  test('COM-01: ヘッダー表示確認', async ({ page }) => {
    await page.goto('/');
    
    const header = await page.locator('header').first();
    await expect(header).toBeVisible();
    
    const logo = await header.locator('a').first();
    await expect(logo).toBeVisible();
    
    // header内には複数のnav(SNSアイコン列・HeaderNav・モバイルnav等)が存在するため、
    // strict modeに抵触しないよう先頭要素に絞る
    const navMenu = await header.locator('nav').first();
    await expect(navMenu).toBeVisible();
  });

  test('COM-02: ヘッダーナビゲーション機能', async ({ page }) => {
    await page.goto('/');

    // NOTE: header nav aにはSNSアイコン等の外部リンク(target="_blank"で新規タブが開く)や、
    // モバイル用SPNav内の非表示リンク(デスクトップビューポートではdisplay:none)も含まれる。
    // サイト内遷移かつ表示中のリンクのみを対象にする。
    const navLinkSelector = 'header nav a[href^="/"]:visible';
    const navLinks = await page.locator(navLinkSelector);
    const count = await navLinks.count();

    for (let i = 0; i < count; i++) {
      await page.goto('/'); // 毎回トップページに戻る

      const links = await page.locator(navLinkSelector);
      const href = await links.nth(i).getAttribute('href');
      if (href) {
        await links.nth(i).click();

        await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), { timeout: 15000 });
      }
    }
  });

  test('COM-03: フッター表示確認', async ({ page }) => {
    await page.goto('/');
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    const footer = await page.locator('footer').first();
    await expect(footer).toBeVisible();
    
    const copyright = await footer.getByText(/copyright|©/i);
    await expect(copyright).toBeVisible();
  });

  test('COM-04: レスポンシブ表示（PC/タブレット/スマホ）', async ({ page }) => {
    // NOTE: このテストの目的はビューポート別のメニュー表示確認のため、
    // 全画像のロード完了(loadイベント)は待たずDOM構築完了時点で先へ進む
    // (並列実行時に画像ロード待ちで30秒タイムアウトするフレークがあった)
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const desktopMenu = await page.locator('header nav').first();
    await expect(desktopMenu).toBeVisible();

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const hamburgerMenu = await page.locator('button[aria-label="メニュー"]').first();
    if (await hamburgerMenu.isVisible()) {
      await hamburgerMenu.click();
      const mobileMenu = await page.locator('nav').first();
      await expect(mobileMenu).toBeVisible();
    }
  });

  test('COM-05: 404エラーページ', async ({ page }) => {
    await page.goto('/存在しないページ');

    // "404"見出しと本文メッセージの両方が正規表現にマッチしうるため、strict mode違反を避けて先頭要素に絞る
    const notFoundText = await page.getByText(/見つかりません|not found|404/i).first();
    await expect(notFoundText).toBeVisible();

    const homeLink = await page.getByRole('link', { name: /ホーム|トップ|home/i }).first();
    await expect(homeLink).toBeVisible();
  });

  test('COM-06: 外部リンクの動作', async ({ page }) => {
    await page.goto('/');

    const externalLinks = await page.locator('a[href^="http"]:not([href*="' + page.url() + '"])');

    if (await externalLinks.count() > 0) {
      const firstExternalLink = externalLinks.first();

      const target = await firstExternalLink.getAttribute('target');
      const rel = await firstExternalLink.getAttribute('rel');

      expect(target).toBe('_blank');

      // NOTE: rel="noreferrer"はwindow.openerをnullにする点でnoopenerと同等のタブナビング対策になる
      // (実装: SocialMediaIcons/index.tsx)。どちらか一方が付与されていればセキュリティ要件を満たす。
      expect(rel).toMatch(/noopener|noreferrer/);
    }
  });

  test('COM-07: ページタイトル（<title>タグ）', async ({ page }) => {
    
    await page.goto('/');
    let title = await page.title();
    expect(title).toBeTruthy();
    
    const articleLink = await page.locator('a[href*="/blogs/"]').first();
    if (await articleLink.isVisible()) {
      await articleLink.click();
      await page.waitForLoadState('networkidle');
      title = await page.title();
      
      expect(title).toBeTruthy();
      expect(title).not.toBe('Ryota-Blog'); // トップページと異なるタイトルであること
    }
    
    await page.goto('/about');
    title = await page.title();
    expect(title).toBeTruthy();
  });

  test('COM-08: Faviconの表示', async ({ page }) => {
    await page.goto('/');
    
    const favicon = await page.locator('link[rel="icon"], link[rel="shortcut icon"]');
    await expect(favicon).toHaveCount(1);
  });
});
