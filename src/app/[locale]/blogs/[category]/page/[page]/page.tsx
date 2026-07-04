import { Suspense } from "react";
import type { MicroCMSQueries } from "microcms-js-sdk";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from 'next-intl/server';

import ArticleList from "@/components/ArticleList";
import Skelton from "@/components/ArticleList/skelton";
import SearchStateCard from "@/components/SearchStateCard";
import SideNav from "@/components/SideNav";
import { generateQuery, buildPageUrl, buildLanguageAlternates } from "@/lib";
import { getLocalizedCategoryName } from "@/lib/i18n-utils";
import { getBlogListByLocale } from "@/lib/microcms";
import { PER_PAGE } from "@/static/blogs";
import { CATEGORIES, findCategoryBySlug } from "@/static/categories";
import BlogTypeTabs from "@/components/UiParts/BlogTypeTabs";
import { locales } from '@/i18n/config';

export async function generateStaticParams() {
  // ロケール×カテゴリの組み合わせを並列フェッチする（sitemap.tsのcategoryTotalsと同じ方針。
  // 直列await(for-of内)だとカテゴリ数×ロケール数分のリクエストがビルド時間に積み上がるため）
  const combinations = locales.flatMap((locale) => CATEGORIES.map((category) => ({ locale, category })));

  const totalPagesByCombination = await Promise.all(
    combinations.map(async ({ locale, category }) => {
      try {
        const query: MicroCMSQueries = {
          limit: 1,
          filters: `category[contains]${category.id}`
        };

        const data = await getBlogListByLocale(locale, query);
        return { locale, category, totalPages: Math.ceil(data.totalCount / PER_PAGE) };
      } catch (error) {
        console.warn(`カテゴリの静的パラメータ生成に失敗しました: ${category.name}`, error);
        return { locale, category, totalPages: 0 };
      }
    })
  );

  return totalPagesByCombination.flatMap(({ locale, category, totalPages }) =>
    // ページ2以降のパラメータを生成（ページ1は /blogs/[category] にある）
    Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) => ({
      locale,
      category: category.slug,
      page: String(i + 2)
    }))
  );
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string, category: string, page: string }> }
): Promise<Metadata> {
  // Next.js 16では、paramsを非同期で取得する必要がある
  const { locale, category, page } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const categoryEntry = findCategoryBySlug(category);

  if (!categoryEntry) {
    notFound();
  }

  const translatedCategoryName = getLocalizedCategoryName(categoryEntry, locale);

  const pageUrl = buildPageUrl(locale, "blogs", category, "page", page);
  const title = `${translatedCategoryName} - ${t('page')} ${page}`;

  return {
    title,
    description: title,
    robots: "noindex",
    alternates: {
      canonical: pageUrl,
      languages: buildLanguageAlternates("blogs", category, "page", page)
    },
    openGraph: { url: pageUrl, title, description: title, siteName: "Ryota-Blog", type: "website" }
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
  const categoryEntry = findCategoryBySlug(category);
  const pageNum = parseInt(page);

  if (!categoryEntry) {
    notFound();
  }

  // ページ番号のバリデーション
  if (isNaN(pageNum) || pageNum < 2) {
    notFound();
  }

  // このカテゴリでページが存在するかチェック（microCMSへのフィルタは必ずcontent idを使う）
  const checkQuery: MicroCMSQueries = {
    limit: 1,
    filters: `category[contains]${categoryEntry.id}`
  };
  const data = await getBlogListByLocale(locale, checkQuery);
  const totalPages = Math.ceil(data.totalCount / PER_PAGE);

  if (pageNum > totalPages) {
    notFound();
  }

  const blogType = "blogs";
  const query: MicroCMSQueries = generateQuery({
    page,
    category: categoryEntry.id,
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
            <SearchStateCard category={getLocalizedCategoryName(categoryEntry, locale)} keyword={""} />
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