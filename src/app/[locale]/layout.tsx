import "../../styles/globals.css";
import type { Metadata } from "next";
import { notFound } from 'next/navigation';
import Script from "next/script";
import { ViewTransitions } from 'next-view-transitions'
import NextTopLoader from "nextjs-toploader";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { isRoutingLocale, routing } from '@/i18n/routing'

import { baseURL, gtmId } from "@/config";
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

// Next.js 16では、Layout/Pageコンポーネントのparamsは非同期になった
type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

// App Routerで<html>を描画できるのはroot layoutのみ、かつroot layoutは[locale]セグメントの
// paramsを直接受け取れないため、このlayout自体をroot layout化して<html lang={locale}>を
// SSR出力する(Issue #293)。src/app/にはlayout.tsxを置かない。ロケールに依存しない
// not-found.tsx/error.tsx/route.tsは自前で<html>/<body>を持つ独立ファイルとして
// src/app/直下に残す(このlayoutがnotFound()やthrowした場合、このlayoutより上には
// 別のlayoutが存在しないため、この階層はそれらを一切ラップできない)
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  // Next.js 16では、paramsを非同期で取得する必要がある
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: {
      template: `%s | ${t('siteTitle')}`,
      default: "Home",
    },
    description: t('siteDescription'),
    metadataBase: new URL(baseURL),
    // og:url はページ固有のため各ページの generateMetadata で設定する。
    // ここでは openGraph を定義しないページ向けのデフォルト値（site名・タイトル等）のみ保持する
    openGraph: {
      title: t('siteTitle'),
      description: t('siteDescription'),
      siteName: 'Ryota-Blog',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image'
    },
    other: {
      "view-transition": "same-origin",
      "google-site-verification": "l7_0SUkxGZZ2XbjQm0_RBuxUONxVunXg2ThGwWjwhD4",
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  // Next.js 16では、paramsを非同期で取得する必要がある
  const { locale } = await params;
  if (!isRoutingLocale(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <ViewTransitions>
      <html lang={locale} suppressHydrationWarning className="overflow-x-hidden">
        <ClientLayout>
          {/* NOTE: 以下のlink/Script/noscriptは<html>直下ではなく<body>内に置くこと。
              <html>直下はHTMLとして無効で、SSR出力はNextが自動補正する一方、
              クライアントのJSXツリーと不一致になりハイドレーションエラーの原因になる
              (エラー時はReactが<html>を再描画しlang属性が消えるA11yリグレッションも既知)。
              preloadリンクはReact 19のリソースホイスティングで自動的に<head>へ移動される */}
          <body className="bg-[#eee] dark:bg-[#333] flex flex-col min-h-screen overflow-x-hidden">
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
            <NextIntlClientProvider messages={messages}>
              {children}
              {/* GA4(gtag.js)はGTMコンテナ内のGA4設定タグ経由でのみ計測する（二重ロード防止: Issue #222）。
                  @next/third-partiesのGoogleTagManagerはafterInteractive固定でgtm.js(127KB)+gtag.js(161KB)が
                  Slow 4G帯域でrender-blocking CSSやLCP画像と競合するため、公式スニペット(init+inject一体)を
                  lazyOnload(loadイベント後)で読み込む。トレードオフ: load前に離脱したPVは計測されない */}
              {gtmId && (
                <Script
                  id="gtm-lazy"
                  strategy="lazyOnload"
                  dangerouslySetInnerHTML={{
                    __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
                  }}
                />
              )}
            </NextIntlClientProvider>
          </body>
        </ClientLayout>
      </html>
    </ViewTransitions>
  );
}
