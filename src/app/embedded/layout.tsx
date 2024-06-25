import { Metadata } from "next";
import localFont from "next/font/local";

const KosugiMaru = localFont({
  src: "../../../public/KosugiMaru-Regular.ttf",
  preload: true,
  display: "swap",
})

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
