import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from 'next-intl/server';

import ArticleList from "@/components/ArticleList";
import Skelton from "@/components/ArticleList/skelton";
import SideNav from "@/components/SideNav";
import { generateQuery, buildPageUrl, buildLanguageAlternates } from "@/lib";
import BlogTypeTabs from "@/components/UiParts/BlogTypeTabs";
import { getBlogList } from "@/lib/content";
import type { BlogListQuery, ContentLocale } from "@/types/content";
import { PER_PAGE } from "@/static/blogs";
import { locales } from '@/i18n/config';

// NOTE: next-intlのリクエストスコープlocale解決により[locale]配下はデフォルトで
// 動的レンダリングになるため、記事詳細ページと同様にforce-staticを明示する(Issue #225)。
// revalidate=1時間はpopulate-cache失敗時のISR自己修復用(/blogs側のNOTE参照)
export const revalidate = 3600;
export const dynamic = 'force-static';

export async function generateStaticParams() {
  const params = [];

  for (const locale of locales) {
    // 各ロケールごとにデータを取得
    const data = getBlogList(locale as ContentLocale, { limit: 1 });
    const totalPages = Math.ceil(data.totalCount / PER_PAGE);
    
    // ページ2以降のパラメータを生成（ページ1は/[locale]/blogsにある）
    for (let i = 2; i <= totalPages; i++) {
      params.push({
        locale,
        page: String(i)
      });
    }
  }
  
  return params;
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string; page: string }> }
): Promise<Metadata> {
  // Next.js 16では、paramsを非同期で取得する必要がある
  const { locale, page } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });

  const pageUrl = buildPageUrl(locale, "blogs", "page", page);
  const title = `${t('recentPosts')} - ${t('page')} ${page}`;

  return {
    title,
    description: title,
    robots: "noindex",
    alternates: {
      canonical: pageUrl,
      languages: buildLanguageAlternates("blogs", "page", page)
    },
    openGraph: { url: pageUrl, title, description: title, siteName: "Ryota-Blog", type: "website" }
  };
}

const Page = async ({ params }: { params: Promise<{ locale: string; page: string }> }) => {
  // Next.js 16では、paramsを非同期で取得する必要がある
  const { locale, page } = await params;
  const pageNum = parseInt(page);

  // ページ番号の検証
  if (isNaN(pageNum) || pageNum < 2) {
    notFound();
  }

  // ページが存在するかチェック
  const data = getBlogList(locale as ContentLocale, { limit: 1 });
  const totalPages = Math.ceil(data.totalCount / PER_PAGE);

  if (pageNum > totalPages) {
    notFound();
  }

  const blogType = "blogs";
  const query: BlogListQuery = generateQuery({
    page,
    category: "",
    keyword: ""
  });

  return (
    <>
      <div className="w-full lg:w-[calc(100%_-_300px)] flex flex-col justify-between px-2 md:px-0">
        <div className="flex flex-col flex-grow gap-4">
          <div className="flex gap-4 flex-col lg:flex-row">
            <div className="flex justify-center items-center p-3 bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-600">
              <Suspense fallback={<div>Loading...</div>}>
                <BlogTypeTabs blogType={blogType} />
              </Suspense>
            </div>
          </div>
          <Suspense fallback={<Skelton />}>
            <ArticleList query={query} blogType={blogType} page={page} basePath={`/${locale}/blogs`} locale={locale} />
          </Suspense>
        </div>
      </div>
      <SideNav locale={locale} />
    </>
  );
};

export default Page;