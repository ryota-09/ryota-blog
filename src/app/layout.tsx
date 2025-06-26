import "../styles/globals.css";
import type { Metadata } from "next";
import { Kosugi_Maru } from "next/font/google"
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
    "google-site-verification": "l7_0SUkxGZZ2XbjQm0_RBuxUONxVunXg2ThGwWjwhD4",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
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
  );
}