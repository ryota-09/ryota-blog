import { test, expect } from '@playwright/test';

test.describe('アクセシビリティのテスト', () => {
  test('A11Y-01: キーボード操作', async ({ page, browserName }) => {
    // NOTE: WebKit(Safari準拠)は既定でTabキーによるリンクへのフォーカス移動を行わず、
    // 最初のTabでラッパー要素にフォーカスが当たるためテストの前提が成立しない(全ブラウザ共通の
    // 既知挙動差で、コード側の問題ではない)。フォーカスリング自体はglobals.cssの:focus-visibleで
    // 全ブラウザに明示付与済み。chromium/firefoxで検証を継続する
    test.skip(browserName === 'webkit', 'WebKitはTabでリンクにフォーカスを移さない(Safari準拠の既定挙動)');
    // NOTE: トップページ('/')は/{locale}/blogsにリダイレクトされる仕様(src/app/[locale]/page.tsx)。
    // ヘッダーロゴのリンク先も/{locale}/blogsのため、'/'から始めるとTab+Enterで遷移してもURLが
    // 変化せず検証にならない。確実にURLが変わる/aboutを起点にする。
    await page.goto('/about');

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

    // NOTE: 旧実装は要素自身のbackgroundColorだけを見ていたため、背景未指定(透明)の要素では
    // rgba(0,0,0,0)が黒として解釈され、黒文字とのコントラスト比が1になる誤検出があった。
    // 祖先を遡って実効背景色を解決するように修正した。
    const contrastInfo = await firstElement.evaluate((element) => {
      const parseColor = (color: string) => {
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (!match) return null;
        return {
          r: parseInt(match[1], 10),
          g: parseInt(match[2], 10),
          b: parseInt(match[3], 10),
          a: match[4] === undefined ? 1 : parseFloat(match[4]),
        };
      };

      // 透明でない背景色が見つかるまで祖先を遡る(見つからなければ白背景とみなす)
      const resolveEffectiveBackground = (el: Element | null) => {
        let current: Element | null = el;
        while (current) {
          const bg = parseColor(window.getComputedStyle(current).backgroundColor);
          if (bg && bg.a > 0) return bg;
          current = current.parentElement;
        }
        return { r: 255, g: 255, b: 255, a: 1 };
      };

      const textRGB = parseColor(window.getComputedStyle(element).color);
      const bgRGB = resolveEffectiveBackground(element);

      if (!textRGB) return null;

      const luminance = (rgb: { r: number; g: number; b: number }) => {
        return 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
      };

      const textLuminance = luminance(textRGB);
      const bgLuminance = luminance(bgRGB);

      const lighter = Math.max(textLuminance, bgLuminance);
      const darker = Math.min(textLuminance, bgLuminance);
      const contrastRatio = (lighter + 0.05) / (darker + 0.05);

      return { contrastRatio };
    });

    if (contrastInfo && typeof contrastInfo.contrastRatio === 'number') {
      expect(contrastInfo.contrastRatio).toBeGreaterThanOrEqual(3);
    }
  });
});
