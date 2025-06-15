import { Suspense } from "react";
import type { MicroCMSQueries } from "microcms-js-sdk";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from 'next-intl/server';

import ArticleList from "@/components/ArticleList";
import Skelton from "@/components/ArticleList/skelton";
import SideNav from "@/components/SideNav";
import { generateQuery } from "@/lib";
import BlogTypeTabs from "@/components/UiParts/BlogTypeTabs";
import { getBlogListByLocale } from "@/lib/microcms";
import { PER_PAGE } from "@/static/blogs";
import { locales } from '@/i18n/config';

export async function generateStaticParams() {
  const params = [];
  
  for (const locale of locales) {
    // 各ロケールごとにデータを取得
    const data = await getBlogListByLocale(locale, { limit: 1 });
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
  { params }: { params: { locale: string; page: string } }
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'blog' });
  const page = params.page;
  
  return {
    title: `${t('recentPosts')} - ${t('page')} ${page}`,
    description: `${t('recentPosts')} - ${t('page')} ${page}`,
    robots: "noindex",
    alternates: {
      canonical: `/${params.locale}/blogs/page/${page}`,
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          `/${locale}/blogs/page/${page}`
        ])
      )
    }
  };
}

const Page = async ({ params }: { params: { locale: string; page: string } }) => {
  const pageNum = parseInt(params.page);
  
  // ページ番号の検証
  if (isNaN(pageNum) || pageNum < 2) {
    notFound();
  }
  
  // ページが存在するかチェック
  const data = await getBlogListByLocale(params.locale, { limit: 1 });
  const totalPages = Math.ceil(data.totalCount / PER_PAGE);
  
  if (pageNum > totalPages) {
    notFound();
  }

  const blogType = "blogs";
  const query: MicroCMSQueries = generateQuery({ 
    page: params.page,
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
            <ArticleList query={query} blogType={blogType} page={params.page} basePath={`/${params.locale}/blogs`} locale={params.locale} />
          </Suspense>
        </div>
      </div>
      <SideNav locale={params.locale} />
    </>
  );
};

export default Page;