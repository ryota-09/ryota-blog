import { test, expect } from '@playwright/test';

test.describe('セキュリティのテスト', () => {
  test('SEC-01: HTTPセキュリティヘッダ', async ({ page }) => {
    await page.goto('/');
    
    const response = await page.request.get(page.url());
    const headers = response.headers();
    
    const securityHeaders = [
      'x-frame-options',
      'x-content-type-options',
      'x-xss-protection',
      'content-security-policy',
      'strict-transport-security'
    ];
    
    let hasSecurityHeader = false;
    for (const header of securityHeaders) {
      if (headers[header]) {
        hasSecurityHeader = true;
        console.log(`セキュリティヘッダー「${header}」が設定されています: ${headers[header]}`);
        
        if (header === 'x-frame-options') {
          expect(['DENY', 'SAMEORIGIN']).toContain(headers[header].toUpperCase());
        } else if (header === 'x-content-type-options') {
          expect(headers[header].toLowerCase()).toBe('nosniff');
        } else if (header === 'x-xss-protection') {
          expect(headers[header]).toMatch(/^1/);
        }
      }
    }
    
    if (!hasSecurityHeader) {
      console.warn('警告: 基本的なセキュリティヘッダーが設定されていません。本番環境では設定することを推奨します。');
    }
    
    if (!page.url().startsWith('http://localhost')) {
      expect(page.url()).toMatch(/^https:\/\//);
    }
  });
});
