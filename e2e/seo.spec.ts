import { test, expect } from '@playwright/test';

// NOTE: 記事一覧(ArticleList)の記事カードは<article>タグではなく
// data-testid="pw-article-card-N"付きの<li>でマークアップされている(実装: src/components/ArticleList/index.tsx)。
// 記事詳細ページ本体は<article>タグを使うため、一覧からリンクを取得する箇所のみdata-testidベースにしている。
test.describe('SEO（検索エンジン最適化）のテスト', () => {
  test('SEO-01: robots.txtの検証', async ({ page }) => {
    // NOTE: page.goto+page.content()だとブラウザのプレーンテキストビューアのDOMを検証してしまうため、
    // request APIで生のレスポンスボディを取得する
    const response = await page.request.get('/robots.txt');
    expect(response.status()).toBe(200);

    const robotsContent = await response.text();
    // Next.jsのMetadataRoute.Robotsは "User-Agent"(大文字A)で出力するため大文字小文字を無視して照合する
    expect(robotsContent).toMatch(/user-agent/i);

    expect(robotsContent).toMatch(/Sitemap:\s*https?:\/\//i);
  });

  test('SEO-02: XMLサイトマップの検証', async ({ page }) => {
    // NOTE: XMLをpage.gotoで開くとChromeのXMLビューアのDOM(タグがエスケープされたHTML)になるため、
    // request APIで生のXMLを取得して検証する
    const response = await page.request.get('/sitemap.xml');
    expect(response.status()).toBe(200);

    const content = await response.text();

    expect(content).toContain('<?xml');
    expect(content).toContain('<urlset');

    expect(content).toContain('<url>');
    expect(content).toContain('<loc>');

    expect(content).toMatch(/<lastmod>.*<\/lastmod>/);
  });

  test('SEO-03: canonicalタグの検証', async ({ page }) => {
    await page.goto('/blogs');
    const articleLink = await page.locator('[data-testid^="pw-article-card-"] a[href*="/blogs/"]').first();
    const href = await articleLink.getAttribute('href');
    if (href) {
      await page.goto(href);
      
      const canonical = await page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveCount(1);

      // NOTE: canonicalのオリジンはNEXT_PUBLIC_BASE_URL(ローカル未設定時はlocalhost:3006フォールバック)
      // 由来のため、e2eサーバー(3001)のオリジンとは一致しない。パス部分の一致のみ検証する。
      const canonicalHref = await canonical.getAttribute('href');
      expect(canonicalHref).toBeTruthy();
      expect(new URL(canonicalHref!).pathname).toBe(new URL(page.url()).pathname);
    }
  });

  test('SEO-04: meta robotsタグの検証', async ({ page }) => {
    await page.goto('/blogs');
    const articleLink = await page.locator('[data-testid^="pw-article-card-"] a[href*="/blogs/"]').first();
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

    // NOTE: head内のmetaタグは常に不可視のためtoBeVisible()では検証できない。存在数で検証する。
    const noindexMeta = await page.locator('meta[name="robots"][content*="noindex"]');
    if (await noindexMeta.count() > 0) {
      await expect(noindexMeta).toHaveCount(1);
    }
  });

  test('SEO-05: 構造化データの検証', async ({ page }) => {
    await page.goto('/blogs');
    const articleLink = await page.locator('[data-testid^="pw-article-card-"] a[href*="/blogs/"]').first();
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
    // NOTE: gotoする前のpage.url()は"about:blank"のため、まずトップページへ遷移してからoriginを取得する
    await page.goto('/');
    const baseUrl = new URL(page.url()).origin;

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
    const articleLink = await page.locator('[data-testid^="pw-article-card-"] a[href*="/blogs/"]').first();
    const href = await articleLink.getAttribute('href');
    if (href) {
      await page.goto(href);
      
      // NOTE: head内のmetaタグは常に不可視のためtoBeVisible()では検証できない。content属性で検証する。
      const ogTitle = await page.locator('meta[property="og:title"]');
      const ogDescription = await page.locator('meta[property="og:description"]');
      const ogImage = await page.locator('meta[property="og:image"]');

      if (await ogTitle.count() > 0) {
        const titleContent = await ogTitle.getAttribute('content');
        expect(titleContent).toBeTruthy();
      }

      if (await ogDescription.count() > 0) {
        const descContent = await ogDescription.getAttribute('content');
        expect(descContent).toBeTruthy();
      }

      if (await ogImage.count() > 0) {
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
    const articleLink = await page.locator('[data-testid^="pw-article-card-"] a[href*="/blogs/"]').first();
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
    const articleLink = await page.locator('[data-testid^="pw-article-card-"] a[href*="/blogs/"]').first();
    const href = await articleLink.getAttribute('href');
    if (href) {
      await page.goto(href);

      // NOTE: ヘッダーのサイトタイトル(BlogTitle)もh1のためページ全体では2つになる。
      // 記事コンテンツの見出し構造の検証としてはmain内のh1が1つであることを確認する。
      const h1Tags = await page.locator('main h1');
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
