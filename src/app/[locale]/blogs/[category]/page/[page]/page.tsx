import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from 'next-intl/server';

import ArticleList from "@/components/ArticleList";
import Skelton from "@/components/ArticleList/skelton";
import SearchStateCard from "@/components/SearchStateCard";
import SideNav from "@/components/SideNav";
import { generateQuery, buildPageUrl, buildLanguageAlternates } from "@/lib";
import { getLocalizedCategoryName } from "@/lib/i18n-utils";
import { getBlogList } from "@/lib/content";
import type { BlogListQuery, ContentLocale } from "@/types/content";
import { PER_PAGE } from "@/static/blogs";
import { CATEGORIES, findCategoryBySlug } from "@/static/categories";
import BlogTypeTabs from "@/components/UiParts/BlogTypeTabs";
import { locales } from '@/i18n/config';

// NOTE: next-intlのリクエストスコープlocale解決により[locale]配下はデフォルトで
// 動的レンダリングになるため、記事詳細ページと同様にforce-staticを明示する(Issue #225)。
// revalidate=1時間はpopulate-cache失敗時のISR自己修復用(/blogs側のNOTE参照)
export const revalidate = 3600;
export const dynamic = 'force-static';

export async function generateStaticParams() {
  // ロケール×カテゴリの組み合わせごとに件数を集計する
  const combinations = locales.flatMap((locale) => CATEGORIES.map((category) => ({ locale, category })));

  const totalPagesByCombination = combinations.map(({ locale, category }) => {
    const data = getBlogList(locale as ContentLocale, { limit: 1, category: category.id });
    return { locale, category, totalPages: Math.ceil(data.totalCount / PER_PAGE) };
  });

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

  // このカテゴリでページが存在するかチェック（フィルタは必ずcontent idを使う）
  const data = getBlogList(locale as ContentLocale, { limit: 1, category: categoryEntry.id });
  const totalPages = Math.ceil(data.totalCount / PER_PAGE);

  if (pageNum > totalPages) {
    notFound();
  }

  const blogType = "blogs";
  const query: BlogListQuery = generateQuery({
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