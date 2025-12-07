import { Suspense } from "react";
import type { MicroCMSQueries } from "microcms-js-sdk";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from 'next-intl/server';

import ArticleList from "@/components/ArticleList";
import Skelton from "@/components/ArticleList/skelton";
import SearchStateCard from "@/components/SearchStateCard";
import SideNav from "@/components/SideNav";
import { generateQuery } from "@/lib";
import { getBlogListByLocale } from "@/lib/microcms";
import { PER_PAGE, CATEGORY_MAPED_NAME, CATEGORY_MAPED_ID } from "@/static/blogs";
import BlogTypeTabs from "@/components/UiParts/BlogTypeTabs";
import { locales } from '@/i18n/config';

export async function generateStaticParams() {
  const categories = Object.entries(CATEGORY_MAPED_ID);
  const staticParams = [];
  
  for (const locale of locales) {
    for (const [categoryName, categoryId] of categories) {
      try {
        const query: MicroCMSQueries = {
          limit: 1,
          filters: `category[contains]${categoryId}`
        };
        
        const data = await getBlogListByLocale(locale, query);
        const totalPages = Math.ceil(data.totalCount / PER_PAGE);
        
        // ページ2以降のパラメータを生成（ページ1は /blogs/[category] にある）
        for (let i = 2; i <= totalPages; i++) {
          staticParams.push({
            locale,
            category: categoryId,
            page: String(i)
          });
        }
      } catch (error) {
        console.warn(`カテゴリの静的パラメータ生成に失敗しました: ${categoryName}`, error);
      }
    }
  }
  
  return staticParams;
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string, category: string, page: string }> }
): Promise<Metadata> {
  // Next.js 16では、paramsを非同期で取得する必要がある
  const { locale, category, page } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const tCategories = await getTranslations({ locale, namespace: 'categories' });
  const categoryName = CATEGORY_MAPED_NAME[category];
  
  if (!categoryName) {
    notFound();
  }
  
  // カテゴリ名を翻訳
  let translatedCategoryName;
  try {
    // TypeScriptエラーを回避するために型アサーション
    translatedCategoryName = (tCategories as any)(category);
  } catch {
    // 翻訳が見つからない場合は元の値を使用
    translatedCategoryName = categoryName;
  }

  return {
    title: `${translatedCategoryName} - ${t('page')} ${page}`,
    description: `${translatedCategoryName} - ${t('page')} ${page}`,
    robots: "noindex",
    alternates: {
      canonical: `/${locale}/blogs/${category}/page/${page}`,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc,
          `/${loc}/blogs/${category}/page/${page}`
        ])
      )
    }
  };
}

type PageProps = {
  params: Promise<{
    locale: string;
    category: string;
    page: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  // Next.js 16では、paramsを非同期で取得する必要がある
  const { locale, category, page } = await params;
  const categoryName = CATEGORY_MAPED_NAME[category];
  const pageNum = parseInt(page);

  if (!categoryName) {
    notFound();
  }

  // ページ番号のバリデーション
  if (isNaN(pageNum) || pageNum < 2) {
    notFound();
  }

  // このカテゴリでページが存在するかチェック
  const checkQuery: MicroCMSQueries = {
    limit: 1,
    filters: `category[contains]${category}`
  };
  const data = await getBlogListByLocale(locale, checkQuery);
  const totalPages = Math.ceil(data.totalCount / PER_PAGE);

  if (pageNum > totalPages) {
    notFound();
  }

  const blogType = "blogs";
  const query: MicroCMSQueries = generateQuery({
    page,
    category,
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
            <SearchStateCard category={categoryName} keyword={""} />
          </div>
          <Suspense fallback={<Skelton />}>
            <ArticleList
              query={query}
              blogType={blogType}
              page={page}
              basePath={`/${locale}/blogs/${category}`}
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