import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/static/blogs";
import { baseURL } from "@/config";
import { GlobalStateProvider } from "@/providers";

export const metadata: Metadata = {
  title: {
    template: `%s | ${SITE_TITLE}`,
    default: "Home",
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(baseURL)
};

interface BlogLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default function BlogListLayout({
  children,
  params: { locale }
}: BlogLayoutProps) {
  return (
    <GlobalStateProvider>
      <Header locale={locale} />
      <main className="bg-[#eee] dark:bg-[#333] flex-grow flex flex-col md:flex-row container mx-auto gap-4 my-4">
        {children}
      </main>
      <Footer locale={locale} />
    </GlobalStateProvider>
  );
}