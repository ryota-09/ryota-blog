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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // locale は [locale] セグメントから自動的に渡される
  return (
    <ViewTransitions>
      <html suppressHydrationWarning className="overflow-x-hidden">
        <PreloadResources />
        <ClientLayout>
          {/* NOTE: overflow-x-hiddenはセーフティネット。記事内の長いコードブロック等が
              flexコンテナ配下のブロック要素のshrink-to-fit計算に幅を伝播させ、
              ごく一部のページでページ全体に不要な横スクロールが生じることがある
              (#242パリティ検証で発見、根本のCSS計算までは追い切れなかったため表示側で吸収する)。
              意図的に横スクロールさせている要素は現状ないため、サイト全体への影響はない。 */}
          <body className={`${KosugiMaru.className} bg-[#eee] dark:bg-[#333] flex flex-col min-h-screen overflow-x-hidden`}>
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