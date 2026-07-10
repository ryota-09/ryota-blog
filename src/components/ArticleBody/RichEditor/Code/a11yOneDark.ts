import type { CSSProperties } from 'react';
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark';

// oneDarkのうちWCAG AA(4.5:1)を満たさないトークン色だけを、コードブロック背景
// (#282a2e / oneDark既定の#282c34)に対してAAを満たす近似色に差し替えたテーマ。
// - comment/prolog/cdata の hsl(220,10%,40%)(#5c6370) は約2.3:1 → #9da5b4(約5.8:1)
// - tag/property/deleted等 の hsl(355,65%,65%)(#e06c75) は約4.4:1 → #e57f88(約5.3:1)
// 上記2色以外のトークン色はすべて4.5:1以上を満たすことを確認済み。
const LOW_CONTRAST_OVERRIDES: Record<string, string> = {
  'hsl(220, 10%, 40%)': '#9da5b4',
  'hsl(355, 65%, 65%)': '#e57f88',
};

const a11yOneDark: { [key: string]: CSSProperties } = Object.fromEntries(
  Object.entries(oneDark).map(([selector, style]) => {
    const color = (style as CSSProperties).color;
    const override = color ? LOW_CONTRAST_OVERRIDES[color] : undefined;
    return override ? [selector, { ...style, color: override }] : [selector, style];
  }),
);

export default a11yOneDark;
