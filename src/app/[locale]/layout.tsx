import type { Metadata } from "next";
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Script from 'next/script';

import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import { baseURL, gaId, gtmId } from "@/config";

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
        <GoogleTagManager gtmId={gtmId} />
        <GoogleAnalytics gaId={gaId} />
      </NextIntlClientProvider>
    </>
  );
}
