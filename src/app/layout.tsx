import type { Metadata } from "next";
import { Kosugi_Maru } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/static/blogs";

const KosugiMaru = Kosugi_Maru({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: `%s | ${SITE_TITLE}`,
    default: "Home",
  },
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${KosugiMaru.className} bg-[#eee] flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow flex container mx-auto gap-4 my-4">
          {children}
        </main>
        <Footer />
        {/* NOTE: 埋め込みiframeのため */}
        <Script src="//cdn.iframe.ly/embed.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
