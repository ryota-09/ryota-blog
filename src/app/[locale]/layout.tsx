import type { Metadata } from "next";
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import { baseURL, gaId, gtmId } from "@/config";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params: { locale } }: LocaleLayoutProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' });
  
  return {
    title: {
      template: `%s | ${t('siteTitle')}`,
      default: "Home",
    },
    description: t('siteDescription'),
    metadataBase: new URL(baseURL),
  };
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: LocaleLayoutProps) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
      <GoogleTagManager gtmId={gtmId} />
      <GoogleAnalytics gaId={gaId} />
    </NextIntlClientProvider>
  );
}