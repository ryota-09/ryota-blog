import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import ArticleList from "@/components/ArticleList";
import Skelton from "@/components/ArticleList/skelton";
import SideNav from "@/components/SideNav";
import { generateQuery, buildPageUrl, buildLanguageAlternates } from "@/lib";
import type { BlogListQuery } from "@/types/content";
import BlogTypeTabs from "@/components/UiParts/BlogTypeTabs";

// NOTE: searchParamsを読むと全リクエストが動的レンダリングになり静的生成が無効化される
// (no-store配信でbfcacheも不可)ため、このページではsearchParamsを一切参照しない。
// 検索(?keyword=)・カテゴリ絞り込みは /blogs/search に分離した(Issue #225)。
// また、next-intlのリクエストスコープlocale解決により[locale]配下はデフォルトで
// 動的レンダリングになるため、記事詳細ページと同様にforce-staticを明示する。
// 記事はビルド時に確定する(Velite)ため、再検証はデプロイ時の再ビルドに任せる
export const revalidate = false;
export const dynamic = 'force-static';

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // Next.js 16では、paramsを非同期で取得する必要がある
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "metadata" });

  // canonical / og:url は素の /blogs に正規化して集約する
  const blogsUrl = buildPageUrl(locale, "blogs");
  const blogsLanguages = buildLanguageAlternates("blogs");
  const description = tMeta("siteDescription");

  return {
    title: "HOME",
    description,
    alternates: { canonical: blogsUrl, languages: blogsLanguages },
    openGraph: { url: blogsUrl, title: "HOME", description, siteName: "Ryota-Blog", type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

const Page = async ({ params }: PageProps) => {
  // Next.js 16では、paramsを非同期で取得する必要がある
  const { locale } = await params;

  const query: BlogListQuery = generateQuery({
    page: "",
    category: "",
    keyword: "",
  });

  return (
    <>
      <div className="flex w-full flex-col justify-between px-2 md:px-0 lg:w-[calc(100%_-_300px)]">
        <div className="flex flex-grow flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex items-center justify-center border-2 border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-black">
              <BlogTypeTabs blogType="blogs" />
            </div>
          </div>
          <Suspense fallback={<Skelton />}>
            <ArticleList
              query={query}
              blogType="blogs"
              page="1"
              basePath={`/${locale}/blogs`}
              locale={locale}
            />
          </Suspense>
        </div>
      </div>
      <SideNav locale={locale} />
    </>
  );
};
export default Page;
