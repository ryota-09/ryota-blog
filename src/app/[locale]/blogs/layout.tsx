import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import AdBanner from "@/components/AdBanner";
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

// Next.js 16では、Layout/Pageコンポーネントのparamsは非同期になった
type BlogLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function BlogListLayout({
  children,
  params
}: BlogLayoutProps) {
  // Next.js 16では、paramsを非同期で取得する必要がある
  const { locale } = await params;
  // 静的生成(SSG)ではmiddlewareが動かず、next-intlがリクエストのロケールを知る手段がない。
  // 呼ばないと en ページでもサーバー側の翻訳・リンクが既定の ja で描画される(2026-11 発見)
  setRequestLocale(locale);
  return (
    <GlobalStateProvider>
      <Header locale={locale} />
      {/* Mobile版: ヘッダー下に広告募集バナーを配置 */}
      <div className="block md:hidden">
        <AdBanner variant="banner" />
      </div>
      <main className="bg-[#eee] dark:bg-[#333] flex-grow flex flex-col md:flex-row container mx-auto gap-4 my-4">
        {children}
      </main>
      <Footer locale={locale} />
    </GlobalStateProvider>
  );
}