import { test, expect } from '@playwright/test';

test.describe('共通項目（全ページ）のテスト', () => {
  test('COM-01: ヘッダー表示確認', async ({ page }) => {
    await page.goto('/');
    
    const header = await page.locator('header').first();
    await expect(header).toBeVisible();
    
    const logo = await header.locator('a').first();
    await expect(logo).toBeVisible();
    
    const navMenu = await header.locator('nav');
    await expect(navMenu).toBeVisible();
  });

  test('COM-02: ヘッダーナビゲーション機能', async ({ page }) => {
    await page.goto('/');
    
    const navLinks = await page.locator('header nav a');
    const count = await navLinks.count();
    
    for (let i = 0; i < count; i++) {
      await page.goto('/'); // 毎回トップページに戻る
      
      const links = await page.locator('header nav a');
      const href = await links.nth(i).getAttribute('href');
      await links.nth(i).click();
      
      await page.waitForURL(`**${href}`);
      await expect(page).toHaveURL(new RegExp(href));
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
    
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    const desktopMenu = await page.locator('header nav').first();
    await expect(desktopMenu).toBeVisible();
    
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const hamburgerMenu = await page.locator('button[aria-label="メニュー"]').first();
    if (await hamburgerMenu.isVisible()) {
      await hamburgerMenu.click();
      const mobileMenu = await page.locator('nav').first();
      await expect(mobileMenu).toBeVisible();
    }
  });

  test('COM-05: 404エラーページ', async ({ page }) => {
    await page.goto('/存在しないページ');
    
    const notFoundText = await page.getByText(/見つかりません|not found|404/i);
    await expect(notFoundText).toBeVisible();
    
    const homeLink = await page.getByRole('link', { name: /ホーム|トップ|home/i });
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
      
      expect(rel).toContain('noopener');
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
