import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { baseURL } from "@/config";

interface AboutLayoutProps {
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
    openGraph: {
      url: `${baseURL}/${locale}/about`,
      title: t('pageTitle'),
      description: t('pageDescription'),
      images: [{ url: `${baseURL}/og-image.png`, width: 1200, height: 630 }],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      images: [`${baseURL}/og-image.png`],
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