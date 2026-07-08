import "../styles/globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { ViewTransitions } from 'next-view-transitions'
import NextTopLoader from "nextjs-toploader";
import { routing } from '@/i18n/routing'

import ClientLayout from "@/components/ClientLayout";
import PreloadResources from "@/components/Head/PreloadResources";

// Kosugi Maruの@font-face定義CSS。next/font/googleはTurbopackで約33KB(圧縮後)の
// render-blocking CSSチャンクを生成し、Slow 4G実測でFCP/LCPを約2.4秒遅らせていたため、
// script挿入の非render-blockingスタイルシートに移行した(フォント本体はGoogle CDNの
// バージョン固定URL・font-display:swap。フォールバックは従来と同じsize-adjust値でCLSパリティ維持)
const FONT_CSS_PATH = "/fonts/kosugi-maru-v17.css";

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
        {/* フォントCSSのfetchを早期に開始する(preload自体はrender-blockingにならない) */}
        <link rel="preload" href={FONT_CSS_PATH} as="style" />
        {/* script挿入のスタイルシートは仕様上render-blockingにならない。さらに適用をloadイベント後まで
            遅らせることで、フォントwoff2(VeryHigh優先度・計約350KB)がLCP画像と帯域競合するのを防ぐ。
            CSS本体は上のpreloadで先読み済みのため、load直後に即座にスワップが始まる(font-display:swap) */}
        <Script
          id="load-font-css"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){function f(){var l=document.createElement('link');l.rel='stylesheet';l.href='${FONT_CSS_PATH}';document.head.appendChild(l)}document.readyState==='complete'?f():window.addEventListener('load',f)})()`,
          }}
        />
        <PreloadResources />
        <ClientLayout>
          {/* NOTE: overflow-x-hiddenはセーフティネット。記事内の長いコードブロック等が
              flexコンテナ配下のブロック要素のshrink-to-fit計算に幅を伝播させ、
              ごく一部のページでページ全体に不要な横スクロールが生じることがある
              (#242パリティ検証で発見、根本のCSS計算までは追い切れなかったため表示側で吸収する)。
              意図的に横スクロールさせている要素は現状ないため、サイト全体への影響はない。 */}
          <body className="bg-[#eee] dark:bg-[#333] flex flex-col min-h-screen overflow-x-hidden">
            {/* JS無効環境向け: script挿入が動かない場合のフォントCSSフォールバック */}
            <noscript>
              {/* eslint-disable-next-line @next/next/no-css-tags */}
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