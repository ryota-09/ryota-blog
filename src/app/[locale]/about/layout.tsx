import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { baseURL } from "@/config";

interface AboutLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params: { locale } }: AboutLayoutProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const tNav = await getTranslations({ locale, namespace: 'navigation' });
  
  return {
    title: tNav('about'),
    description: t('siteDescription'),
    metadataBase: new URL(baseURL)
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