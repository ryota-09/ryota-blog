import { Metadata } from "next";
import { Kosugi_Maru } from "next/font/google";

const KosugiMaru = Kosugi_Maru({ weight: "400", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  robots: "noindex"
}

export default function BlogListLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${KosugiMaru.className} m-0 bg-white dark:bg-black`}>
        {children}
      </body>
    </html>
  );
}
