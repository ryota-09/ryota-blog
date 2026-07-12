import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // サポートする全ロケール
  locales: ['ja', 'en'],

  // どのロケールにもマッチしない場合に使う既定値
  defaultLocale: 'ja'
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
