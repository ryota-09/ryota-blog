import type { Metadata } from "next";
import { Kosugi_Maru } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/static/blogs";
import { baseURL } from "@/config";

const KosugiMaru = Kosugi_Maru({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: `%s | ${SITE_TITLE}`,
    default: "Home",
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(baseURL)
};

export default function BlogListLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${KosugiMaru.className} bg-[#eee] flex flex-col min-h-screen`}>
        {children}
        {/* NOTE: 埋め込みiframeのため */}
        <Script src="//cdn.iframe.ly/embed.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
