import type { Metadata } from "next";
import { Kosugi_Maru } from "next/font/google";
import { ViewTransitions } from 'next-view-transitions'
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/static/blogs";
import { baseURL, gaId, gtmId } from "@/config";

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
        <body className={`${KosugiMaru.className} bg-[#eee] dark:bg-[#333] flex flex-col min-h-screen`}>
          {children}
        </body>
        <GoogleTagManager gtmId={gtmId} />
        <GoogleAnalytics gaId={gaId} />
      </html>
    </ViewTransitions>
  );
}
