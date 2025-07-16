import "../styles/globals.css";
import type { Metadata } from "next";
import { Kosugi_Maru } from "next/font/google"
import { ViewTransitions } from 'next-view-transitions'
import NextTopLoader from "nextjs-toploader";
import { routing } from '@/i18n/routing'

import ClientLayout from "@/components/ClientLayout";
import PreloadResources from "@/components/Head/PreloadResources";

const KosugiMaru = Kosugi_Maru({ weight: "400", subsets: ["latin"], display: "swap" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  other: {
    "view-transition": "same-origin",
    "google-site-verification": "l7_0SUkxGZZ2XbjQm0_RBuxUONxVunXg2ThGwWjwhD4",
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 本番環境では静的レンダリングを維持するため、headers()を使わない
  let locale: string = routing.defaultLocale;
  
  // 開発環境でのみ動的なlocale取得を行う
  if (process.env.NODE_ENV === 'development') {
    const { headers } = await import('next/headers');
    const headersList = headers();
    locale = headersList.get('x-next-intl-locale') || routing.defaultLocale;
  }

  return (
    <ViewTransitions>
      <html lang={locale}>
        <PreloadResources />
        <ClientLayout>
          <body className={`${KosugiMaru.className} bg-[#eee] dark:bg-[#333] flex flex-col min-h-screen`}>
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