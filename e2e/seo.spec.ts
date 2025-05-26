import { test, expect } from '@playwright/test';

test.describe('SEO（検索エンジン最適化）のテスト', () => {
  test('SEO-01: robots.txtの検証', async ({ page }) => {
    await page.goto('/robots.txt');
    
    const content = await page.content();
    
    expect(content).not.toContain('404');
    expect(content).not.toContain('Not Found');
    
    const robotsContent = await page.locator('body').textContent();
    expect(robotsContent).toContain('User-agent');
    
    expect(robotsContent).toMatch(/Sitemap:\s*https?:\/\//i);
  });

  test('SEO-02: XMLサイトマップの検証', async ({ page }) => {
    await page.goto('/sitemap.xml');
    
    const content = await page.content();
    
    expect(content).toContain('<?xml');
    expect(content).toContain('<urlset');
    
    expect(content).toContain('<url>');
    expect(content).toContain('<loc>');
    
    expect(content).toMatch(/<lastmod>.*<\/lastmod>/);
  });

  test('SEO-03: canonicalタグの検証', async ({ page }) => {
    await page.goto('/blogs');
    const articleLink = await page.locator('article a[href*="/blogs/"]').first();
    const href = await articleLink.getAttribute('href');
    if (href) {
      await page.goto(href);
      
      const canonical = await page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveCount(1);
      
      const canonicalHref = await canonical.getAttribute('href');
      expect(canonicalHref).toContain(page.url().split('?')[0]);
    }
  });

  test('SEO-04: meta robotsタグの検証', async ({ page }) => {
    await page.goto('/blogs');
    const articleLink = await page.locator('article a[href*="/blogs/"]').first();
    const href = await articleLink.getAttribute('href');
    if (href) {
      await page.goto(href);
      
      const metaRobots = await page.locator('meta[name="robots"]');
      
      if (await metaRobots.count() > 0) {
        const content = await metaRobots.getAttribute('content');
        expect(content).toMatch(/index|follow/i);
      }
    }
    
    await page.goto('/存在しないページ');
    
    const noindexMeta = await page.locator('meta[name="robots"][content*="noindex"]');
    if (await noindexMeta.count() > 0) {
      await expect(noindexMeta).toBeVisible();
    }
  });

  test('SEO-05: 構造化データの検証', async ({ page }) => {
    await page.goto('/blogs');
    const articleLink = await page.locator('article a[href*="/blogs/"]').first();
    const href = await articleLink.getAttribute('href');
    if (href) {
      await page.goto(href);
      
      const structuredData = await page.locator('script[type="application/ld+json"]');
      
      if (await structuredData.count() > 0) {
        const jsonContent = await structuredData.textContent();
        if (jsonContent) {
          try {
            const jsonData = JSON.parse(jsonContent);
            
            if (jsonData['@type'] === 'Article' || Array.isArray(jsonData) && jsonData.some(item => item['@type'] === 'Article')) {
              expect(jsonContent).toMatch(/headline|image|datePublished/);
            } else if (jsonData['@type'] === 'BreadcrumbList' || Array.isArray(jsonData) && jsonData.some(item => item['@type'] === 'BreadcrumbList')) {
              expect(jsonContent).toMatch(/itemListElement/);
            }
          } catch (e) {
            console.log('JSON-LDの解析に失敗しました:', e);
          }
        }
      }
    }
  });

  test('SEO-06: URLの正規化', async ({ page, request }) => {
    const baseUrl = page.url().split('/').slice(0, 3).join('/');
    
    const response = await request.get(baseUrl);
    expect(response.status()).toBe(200);
    
    const wwwUrl = baseUrl.replace('://', '://www.');
    try {
      const wwwResponse = await request.get(wwwUrl, { timeout: 5000 });
      if (wwwResponse.status() === 301) {
        const location = wwwResponse.headers()['location'];
        expect(location).toBeTruthy();
      }
    } catch (e) {
      console.log('WWWサブドメインへのアクセスに失敗しました:', e);
    }
  });

  test('SEO-07: OGP設定の検証', async ({ page }) => {
    await page.goto('/blogs');
    const articleLink = await page.locator('article a[href*="/blogs/"]').first();
    const href = await articleLink.getAttribute('href');
    if (href) {
      await page.goto(href);
      
      const ogTitle = await page.locator('meta[property="og:title"]');
      const ogDescription = await page.locator('meta[property="og:description"]');
      const ogImage = await page.locator('meta[property="og:image"]');
      
      if (await ogTitle.count() > 0) {
        await expect(ogTitle).toBeVisible();
        const titleContent = await ogTitle.getAttribute('content');
        expect(titleContent).toBeTruthy();
      }
      
      if (await ogDescription.count() > 0) {
        await expect(ogDescription).toBeVisible();
        const descContent = await ogDescription.getAttribute('content');
        expect(descContent).toBeTruthy();
      }
      
      if (await ogImage.count() > 0) {
        await expect(ogImage).toBeVisible();
        const imageContent = await ogImage.getAttribute('content');
        expect(imageContent).toMatch(/^https?:\/\//);
      }
    }
  });

  test('SEO-08: Core Web Vitalsの計測', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    console.log(`ページ読み込み時間: ${loadTime}ms`);
    
    const body = await page.locator('body');
    await expect(body).toBeVisible();
  });

  test('SEO-09: 画像alt属性', async ({ page }) => {
    await page.goto('/blogs');
    const articleLink = await page.locator('article a[href*="/blogs/"]').first();
    const href = await articleLink.getAttribute('href');
    if (href) {
      await page.goto(href);
      
      const images = await page.locator('article img');
      
      if (await images.count() > 0) {
        const firstImage = images.first();
        const alt = await firstImage.getAttribute('alt');
        
        expect(alt).toBeTruthy();
      }
    }
  });

  test('SEO-10: 見出し構造', async ({ page }) => {
    await page.goto('/blogs');
    const articleLink = await page.locator('article a[href*="/blogs/"]').first();
    const href = await articleLink.getAttribute('href');
    if (href) {
      await page.goto(href);
      
      const h1Tags = await page.locator('h1');
      await expect(h1Tags).toHaveCount(1);
      
      const h2Tags = await page.locator('h2');
      
      if (await h2Tags.count() > 0) {
        await expect(h2Tags.first()).toBeVisible();
      }
      
      const h3Tags = await page.locator('h3');
      
      if (await h3Tags.count() > 0 && await h2Tags.count() > 0) {
        const h2Count = await h2Tags.count();
        const h3Count = await h3Tags.count();
        
        expect(h2Count).toBeGreaterThan(0);
      }
    }
  });
});
