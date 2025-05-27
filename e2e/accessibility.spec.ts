import { test, expect } from '@playwright/test';

test.describe('アクセシビリティのテスト', () => {
  test('A11Y-01: キーボード操作', async ({ page }) => {
    await page.goto('/');
    
    const focusableElements = await page.locator('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const count = await focusableElements.count();
    
    expect(count).toBeGreaterThan(0);
    
    await page.keyboard.press('Tab');
    
    const focusedElement = await page.evaluate(() => {
      const activeElement = document.activeElement;
      if (!activeElement) return null;
      
      const styles = window.getComputedStyle(activeElement);
      return {
        outlineWidth: styles.outlineWidth,
        outlineStyle: styles.outlineStyle,
        outlineColor: styles.outlineColor,
        boxShadow: styles.boxShadow
      };
    });
    
    if (focusedElement) {
      const hasOutline = focusedElement.outlineWidth !== '0px' && focusedElement.outlineStyle !== 'none';
      const hasBoxShadow = focusedElement.boxShadow !== 'none';
      
      expect(hasOutline || hasBoxShadow).toBeTruthy();
    }
    
    let foundNavLink = false;
    for (let i = 0; i < Math.min(count, 10); i++) {
      const activeElementHref = await page.evaluate(() => {
        return document.activeElement?.getAttribute('href');
      });
      
      if (activeElementHref) {
        foundNavLink = true;
        break;
      }
      
      await page.keyboard.press('Tab');
    }
    
    expect(foundNavLink).toBeTruthy();
    
    const initialUrl = page.url();
    await page.keyboard.press('Enter');
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).not.toBe(initialUrl);
  });

  test('A11Y-02: 色のコントラスト比', async ({ page }) => {
    await page.goto('/');
    
    const textElements = await page.locator('h1, h2, h3, p, a, button, label');
    
    const count = await textElements.count();
    expect(count).toBeGreaterThan(0);
    
    const firstElement = textElements.first();
    
    const contrastInfo = await page.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      
      const styles = window.getComputedStyle(element);
      const textColor = styles.color;
      const bgColor = styles.backgroundColor;
      
      const parseColor = (color) => {
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
        if (!match) return null;
        return {
          r: parseInt(match[1], 10),
          g: parseInt(match[2], 10),
          b: parseInt(match[3], 10)
        };
      };
      
      const textRGB = parseColor(textColor);
      const bgRGB = parseColor(bgColor);
      
      if (!textRGB || !bgRGB) return { textColor, bgColor, contrastRatio: 'unknown' };
      
      const luminance = (rgb) => {
        return 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
      };
      
      const textLuminance = luminance(textRGB);
      const bgLuminance = luminance(bgRGB);
      
      const lighter = Math.max(textLuminance, bgLuminance);
      const darker = Math.min(textLuminance, bgLuminance);
      const contrastRatio = (lighter + 0.05) / (darker + 0.05);
      
      return {
        textColor,
        bgColor,
        contrastRatio
      };
    }, await firstElement.evaluate(el => {
      const getSelector = (element) => {
        if (element.id) return `#${element.id}`;
        if (element.className) {
          const classes = Array.from(element.classList).join('.');
          return classes ? `.${classes}` : element.tagName.toLowerCase();
        }
        return element.tagName.toLowerCase();
      };
      return getSelector(el);
    }));
    
    if (contrastInfo && typeof contrastInfo.contrastRatio === 'number') {
      expect(contrastInfo.contrastRatio).toBeGreaterThanOrEqual(3);
    }
  });
});
