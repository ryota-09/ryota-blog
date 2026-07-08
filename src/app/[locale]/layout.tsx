import type { Metadata } from "next";
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Script from 'next/script';

import { baseURL, gtmId } from "@/config";

// Next.js 16では、Layout/Pageコンポーネントのparamsは非同期になった
type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

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
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  // Next.js 16では、paramsを非同期で取得する必要がある
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  
  const messages = await getMessages();

  return (
    <>
      <Script
        id="set-lang"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang = '${locale}'`
        }}
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
    </>
  );
}
