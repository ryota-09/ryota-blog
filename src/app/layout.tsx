import "../styles/globals.css";
import type { Metadata } from "next";
import { Kosugi_Maru } from "next/font/google"
import { ViewTransitions } from 'next-view-transitions'
import NextTopLoader from "nextjs-toploader";

import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/static/blogs";
import { baseURL, gaId, gtmId } from "@/config";
import ClientLayout from "@/components/ClientLayout";
import PreloadResources from "@/components/Head/PreloadResources";


const KosugiMaru = Kosugi_Maru({ weight: "400", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    template: `%s | ${SITE_TITLE}`,
    default: "Home",
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(baseURL),
  // NOTE: トランジッションAPIの設定
  other: {
    "view-transition": "same-origin",
  }
};

export default function BlogListLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="ja">
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
        <GoogleTagManager gtmId={gtmId} />
        <GoogleAnalytics gaId={gaId} />
      </html>
    </ViewTransitions>
  );
}
