import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/static/blogs";
import { baseURL } from "@/config";

export const metadata: Metadata = {
  title: `About | ${SITE_TITLE}`,
  description: SITE_DESCRIPTION,
  metadataBase: new URL(baseURL)
};

export default function BlogListLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="bg-[#eee] container mx-auto gap-4 my-8 px-2 flex flex-col flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}