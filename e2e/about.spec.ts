import { test, expect } from '@playwright/test';

test.describe('Aboutページのテスト', () => {
  test('ABOUT-01: プロフィール情報表示', async ({ page }) => {
    await page.goto('/about');
    
    const profileName = await page.locator('h1').first();
    await expect(profileName).toBeVisible();
    
    const profileDescription = await page.locator('p').first();
    await expect(profileDescription).toBeVisible();
    
    const profileImage = await page.locator('img').first();
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
});
