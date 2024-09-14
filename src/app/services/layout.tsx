import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/static/blogs";
import { baseURL } from "@/config";

export const metadata: Metadata = {
  title: {
    template: `%s | ${SITE_TITLE}`,
    default: "Services",
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(baseURL)
};

export default function ServiceListLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className=" bg-white dark:bg-black border-2 dark:border-gray-600 flex-grow flex flex-col md:flex-row container mx-auto gap-4 my-4">
        {children}
      </main>
      <Footer />
    </>
  );
}