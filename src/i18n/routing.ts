import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // サポートする全ロケール
  locales: ['ja', 'en'],

  // どのロケールにもマッチしない場合に使う既定値
  defaultLocale: 'ja',

  // next-intlのmiddlewareが全レスポンスに付けるHTTP `Link` ヘッダー(hreflang)を無効にする。
  // 既定のLinkヘッダーは x-default にロケールなしURL(/blogs/... → 301で/ja/へ転送)を入れるため、
  // Googlebotがhreflang経由でリダイレクトURLを取りに行き、記事クロールの約3分の1を浪費していた
  // (2026-11 Cloudflareログ実測)。hreflangはページのmetadata(alternates.languages)で
  // ja/en/x-default(=200を返すデフォルトロケールのURL)を出力しているので、HTML側だけで足りる
  alternateLinks: false
});

// ルーティング設定上のロケール型
export type RoutingLocale = (typeof routing.locales)[number];

// 動的なstringをRoutingLocaleに絞る型ガード。
// readonlyタプル型のincludesにstringを渡すためのasはここに1箇所だけ集約する
export function isRoutingLocale(value: string | null | undefined): value is RoutingLocale {
  return value != null && routing.locales.includes(value as RoutingLocale);
}

// 後方互換のためのre-export
export const { locales, defaultLocale } = routing;
