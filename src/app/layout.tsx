import "../styles/globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { ViewTransitions } from 'next-view-transitions'
import NextTopLoader from "nextjs-toploader";
import { routing } from '@/i18n/routing'

import ClientLayout from "@/components/ClientLayout";
import PreloadResources from "@/components/Head/PreloadResources";
import fontManifest from "@/generated/font-manifest.json";

// Kosugi Maruの@font-face定義CSS。next/font/googleはTurbopackで約33KB(圧縮後)の
// render-blocking CSSチャンクを生成し、Slow 4G実測でFCP/LCPを約2.4秒遅らせていたため、
// script挿入の非render-blockingスタイルシートに移行した(font-display:swap。
// フォールバックは従来と同じsize-adjust値でCLSパリティ維持)。
// フォント本体はGoogle CDNのunicode-range 121分割(記事ページで34〜49スライス・280〜631KB)から、
// サイト実使用文字のみの自己ホストサブセット1ファイル(約283KB・全ページ共通・immutable)に移行済み。
// CSSパスはビルド時にscripts/generate-font-subset.mjsが生成するマニフェスト経由で解決する
// (内容由来ハッシュ入りファイル名のため。文字セットが変わるとファイル名も変わる)
const FONT_CSS_PATH = fontManifest.fontCssPath;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  other: {
    "view-transition": "same-origin",
    "google-site-verification": "l7_0SUkxGZZ2XbjQm0_RBuxUONxVunXg2ThGwWjwhD4",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // locale は [locale] セグメントから自動的に渡される
  return (
    <ViewTransitions>
      <html suppressHydrationWarning className="overflow-x-hidden">
        <ClientLayout>
          {/* NOTE: overflow-x-hiddenはセーフティネット。記事内の長いコードブロック等が
              flexコンテナ配下のブロック要素のshrink-to-fit計算に幅を伝播させ、
              ごく一部のページでページ全体に不要な横スクロールが生じることがある
              (#242パリティ検証で発見、根本のCSS計算までは追い切れなかったため表示側で吸収する)。
              意図的に横スクロールさせている要素は現状ないため、サイト全体への影響はない。 */}
          <body className="bg-[#eee] dark:bg-[#333] flex flex-col min-h-screen overflow-x-hidden">
            {/* NOTE: 以下のlink/Script/noscriptは<html>直下ではなく<body>内に置くこと。
                <html>直下はHTMLとして無効で、SSR出力はNextが自動補正する一方、
                クライアントのJSXツリーと不一致になりハイドレーションエラーの原因になる
                (エラー時はReactが<html>を再描画しlang属性が消えるA11yリグレッションも既知)。
                preloadリンクはReact 19のリソースホイスティングで自動的に<head>へ移動される */}
            {/* フォントCSSのfetchを早期に開始する(preload自体はrender-blockingにならない)。
                as=styleのpreloadは既定でVeryHigh優先度になり、Slow 4GでLCP画像(High)と
                帯域競合していたため(実測30KB)、fetchPriority=lowで降格する。
                このCSSはloadイベント後にしか適用されないので、それまでに取得できていれば足りる */}
            <link rel="preload" href={FONT_CSS_PATH} as="style" fetchPriority="low" />
            {/* script挿入のスタイルシートは仕様上render-blockingにならない。さらに適用をloadイベント後まで
                遅らせることで、フォントwoff2(VeryHigh優先度・約283KB)がLCP画像と帯域競合するのを防ぐ。
                CSS本体は上のpreloadで先読み済みのため、load直後に即座にスワップが始まる(font-display:swap) */}
            <Script
              id="load-font-css"
              strategy="beforeInteractive"
              dangerouslySetInnerHTML={{
                __html: `(function(){function f(){var l=document.createElement('link');l.rel='stylesheet';l.href='${FONT_CSS_PATH}';document.head.appendChild(l)}document.readyState==='complete'?f():window.addEventListener('load',f)})()`,
              }}
            />
            <PreloadResources />
            {/* JS無効環境向け: script挿入が動かない場合のフォントCSSフォールバック */}
            <noscript>
              <link rel="stylesheet" href={FONT_CSS_PATH} />
            </noscript>
            <NextTopLoader
              color="#3BACB6"
              initialPosition={0.1}
              crawl
            />
            {children}
          </body>
        </ClientLayout>
      </html>
    </ViewTransitions>
  );
}