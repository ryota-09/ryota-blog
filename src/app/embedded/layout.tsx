import { Kosugi_Maru } from "next/font/google";

const KosugiMaru = Kosugi_Maru({ weight: "400", subsets: ["latin"], display: "swap" });

export default function BlogListLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${KosugiMaru.className} m-0`} style={{ backgroundColor: "white" }}>
        {children}
      </body>
    </html>
  );
}
