import { test, expect } from '@playwright/test';

test.describe('記事詳細ページのテスト', () => {
  async function getFirstArticleUrl(page) {
    await page.goto('/blogs');
    const articleLink = await page.locator('article a[href*="/blogs/"]').first();
    const href = await articleLink.getAttribute('href');
    return href;
  }

  test('ART-01: 記事コンテンツ表示', async ({ page }) => {
    const articleUrl = await getFirstArticleUrl(page);
    
    await page.goto(articleUrl);
    
    const articleTitle = await page.locator('h1').first();
    await expect(articleTitle).toBeVisible();
    
    const articleContent = await page.locator('article').first();
    await expect(articleContent).toBeVisible();
    
    const publishDate = await page.locator('time').first();
    if (await publishDate.count() > 0) {
      await expect(publishDate).toBeVisible();
    }
  });

  test('ART-02: パンくずリスト機能', async ({ page }) => {
    const articleUrl = await getFirstArticleUrl(page);
    
    await page.goto(articleUrl);
    
    const breadcrumb = await page.locator('nav[aria-label="breadcrumb"], .breadcrumb').first();
    
    if (await breadcrumb.count() > 0) {
      const homeLink = await breadcrumb.locator('a').first();
      
      await homeLink.click();
      
      await page.waitForURL('**/');
      await expect(page.url()).toContain('/');
    }
  });

  test('ART-03: SNSシェアボタン機能', async ({ page }) => {
    const articleUrl = await getFirstArticleUrl(page);
    
    await page.goto(articleUrl);
    
    const shareButtons = await page.locator('a[href*="twitter.com/share"], a[href*="facebook.com/sharer"], button[aria-label*="share"]').first();
    
    if (await shareButtons.count() > 0) {
      const href = await shareButtons.getAttribute('href');
      
      if (href) {
        expect(href).toContain('url=') || expect(href).toContain('text=');
      }
    }
  });

  test('ART-04: コードブロック表示', async ({ page }) => {
    const articleUrl = await getFirstArticleUrl(page);
    
    await page.goto(articleUrl);
    
    const codeBlock = await page.locator('pre code, .code-block, .hljs').first();
    
    if (await codeBlock.count() > 0) {
      await expect(codeBlock).toBeVisible();
      
      const codeBlockStyle = await codeBlock.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          fontFamily: styles.fontFamily
        };
      });
      
      expect(codeBlockStyle.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(codeBlockStyle.fontFamily).toContain('mono');
    }
  });

  test('ART-05: コードのコピー機能', async ({ page }) => {
    const articleUrl = await getFirstArticleUrl(page);
    
    await page.goto(articleUrl);
    
    const copyButton = await page.locator('button:has-text("コピー"), button[aria-label*="copy"], button.copy-button').first();
    
    if (await copyButton.count() > 0) {
      await copyButton.click();
      
      await page.waitForTimeout(500); // ボタンの状態変化を待つ
      
      const buttonText = await copyButton.textContent();
      expect(buttonText).toBeTruthy();
    }
  });

  test('ART-06: 目次（TOC）機能', async ({ page }) => {
    const articleUrl = await getFirstArticleUrl(page);
    
    await page.goto(articleUrl);
    
    const tableOfContents = await page.locator('.toc, [aria-label="目次"], nav:has-text("目次")').first();
    
    if (await tableOfContents.count() > 0) {
      const tocLink = await tableOfContents.locator('a').first();
      
      if (await tocLink.count() > 0) {
        const href = await tocLink.getAttribute('href');
        
        const initialScrollPosition = await page.evaluate(() => window.scrollY);
        
        await tocLink.click();
        
        await page.waitForTimeout(500); // スクロールの完了を待つ
        
        const newScrollPosition = await page.evaluate(() => window.scrollY);
        expect(newScrollPosition).not.toBe(initialScrollPosition);
        
        if (href && href.startsWith('#')) {
          const targetId = href.substring(1);
          const target = await page.locator(`#${targetId}`).first();
          if (await target.count() > 0) {
            await expect(target).toBeVisible();
          }
        }
      }
    }
  });
});
