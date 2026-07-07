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
import type { BlogListQuery } from "@/types/content";
import { CATEGORY_QUERY } from "@/static/blogs";
import { CATEGORIES, findCategoryBySlug } from "@/static/categories";
import BlogTypeTabs from "@/components/UiParts/BlogTypeTabs";
import { locales } from '@/i18n/config';

// NOTE: searchParamsを読むと全リクエストが動的レンダリングになり静的生成が無効化される
// (no-store配信でbfcacheも不可)ため、このページではsearchParamsを一切参照しない。
// カテゴリ内検索(?keyword=)は /blogs/search?category= に分離した(Issue #225)。
// next-intlのリクエストスコープlocale解決により[locale]配下はデフォルトで
// 動的レンダリングになるため、記事詳細ページと同様にforce-staticを明示する
export const revalidate = false;
export const dynamic = 'force-static';

export async function generateStaticParams() {
  const params = [];
  for (const locale of locales) {
    for (const category of CATEGORIES) {
      params.push({
        locale,
        category: category.slug
      });
    }
  }
  return params;
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string; category: string }> }
): Promise<Metadata> {
  // Next.js 16では、paramsを非同期で取得する必要がある
  const { locale, category } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const categoryEntry = findCategoryBySlug(category);

  if (!categoryEntry) {
    notFound();
  }

  const translatedCategoryName = getLocalizedCategoryName(categoryEntry, locale);

  // canonical / og:url は素のカテゴリURLに正規化して集約する
  const categoryUrl = buildPageUrl(locale, "blogs", category);
  const categoryLanguages = buildLanguageAlternates("blogs", category);

  return {
    title: translatedCategoryName,
    description: translatedCategoryName,
    alternates: { canonical: categoryUrl, languages: categoryLanguages },
    openGraph: { url: categoryUrl, title: translatedCategoryName, description: translatedCategoryName, siteName: "Ryota-Blog", type: "website" },
    twitter: { card: "summary_large_image" },
  }
}

type PageProps = {
  params: Promise<{
    locale: string;
    category: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  // Next.js 16では、paramsを非同期で取得する必要がある
  const { locale, category } = await params;
  const categoryEntry = findCategoryBySlug(category);

  if (!categoryEntry) {
    notFound();
  }

  const query: BlogListQuery = generateQuery({
    page: "",
    [CATEGORY_QUERY]: categoryEntry.id,
    keyword: ""
  });

  return (
    <>
      <div className="w-full lg:w-[calc(100%_-_300px)] flex flex-col justify-between px-2 md:px-0">
        <div className="flex flex-col flex-grow gap-4">
          <div className="flex gap-4 flex-col lg:flex-row">
            <div className="flex justify-center items-center p-3 bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-600">
              <BlogTypeTabs blogType="blogs" />
            </div>
            <SearchStateCard category={getLocalizedCategoryName(categoryEntry, locale)} />
          </div>
          <Suspense fallback={<Skelton />}>
            <ArticleList query={query} blogType="blogs" page="1" basePath={`/${locale}/blogs/${category}`} locale={locale} />
          </Suspense>
        </div>
      </div>
      <SideNav locale={locale} />
    </>
  );
};

export default Page;
