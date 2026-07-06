import { test, expect } from '@playwright/test';

test.describe('Aboutページのテスト', () => {
  test('ABOUT-01: プロフィール情報表示', async ({ page }) => {
    await page.goto('/about');

    const profileName = await page.locator('h1').first();
    await expect(profileName).toBeVisible();

    // NOTE: HeroSectionはモバイル用(md:hidden)/PC用(hidden md:grid)のレイアウトを
    // 両方DOMに描画し、CSSで出し分けている。そのため`p`の先頭は現在のビューポートによっては
    // 非表示側にヒットしうるため、表示されている要素のみを対象にする(:visible)
    const profileDescription = await page.locator('p:visible').first();
    await expect(profileDescription).toBeVisible();

    const profileImage = await page.locator('img:visible').first();
    await expect(profileImage).toBeVisible();
  });

  test('ABOUT-02: SNSリンク機能', async ({ page }) => {
    await page.goto('/about');

    const socialLinks = await page.locator('a[href*="twitter.com"], a[href*="github.com"], a[href*="facebook.com"], a[href*="linkedin.com"]').first();

    if (await socialLinks.count() > 0) {
      const href = await socialLinks.getAttribute('href');
      const target = await socialLinks.getAttribute('target');

      expect(target).toBe('_blank');

      expect(href).toMatch(/^https:\/\/(twitter|github|facebook|linkedin)\.com/);
    }
  });

  test('ABOUT-03: 主要セクションの h2 が並んでいる', async ({ page }) => {
    await page.goto('/about');
    // Projects / Credentials / Outputs / Now を除いた構成では 5 セクション分の h2 が並ぶ想定
    const h2Count = await page.locator('h2').count();
    expect(h2Count).toBeGreaterThanOrEqual(5);
  });

  test('ABOUT-04: キャリアタイムラインに3以上のエントリ', async ({ page }) => {
    await page.goto('/about');
    const items = page.locator('section[aria-labelledby="career-heading"] ol > li');
    await expect(items.first()).toBeVisible();
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('ABOUT-05: Contact セクションに連絡リンクが存在する', async ({ page }) => {
    await page.goto('/about');
    const contactLinks = page.locator('section[aria-labelledby="contact-heading"] a[href]');
    const count = await contactLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('ABOUT-08: 英語ロケール（/en/about）でも h1 が表示される', async ({ page }) => {
    await page.goto('/en/about');
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });
});
