import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { baseURL } from "@/config";

type AboutLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: AboutLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
    metadataBase: new URL(baseURL),
    alternates: {
      canonical: `${baseURL}/${locale}/about`,
      languages: {
        ja: `${baseURL}/ja/about`,
        en: `${baseURL}/en/about`,
      },
    },
    // og:image は同セグメントの opengraph-image.tsx が自動生成・付与するため images は指定しない
    openGraph: {
      url: `${baseURL}/${locale}/about`,
      title: t('pageTitle'),
      description: t('pageDescription'),
      siteName: 'Ryota-Blog',
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="bg-[#eee] dark:bg-[#333] container mx-auto gap-4 my-8 px-2 flex flex-col flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}