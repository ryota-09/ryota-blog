import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import ArticleList from "@/components/ArticleList";
import Skelton from "@/components/ArticleList/skelton";
import SearchStateCard from "@/components/SearchStateCard";
import SideNav from "@/components/SideNav";
import { generateQuery, buildPageUrl, buildLanguageAlternates } from "@/lib";
import { getLocalizedCategoryName } from "@/lib/i18n-utils";
import type { BlogListQuery } from "@/types/content";
import {
  CATEGORY_QUERY,
  KEYWORD_QUERY,
  PAGE_QUERY,
} from "@/static/blogs";
import { resolveCategoryEntry } from "@/static/categories";
import BlogTypeTabs from "@/components/UiParts/BlogTypeTabs";

// 検索結果ページ: searchParams(keyword/category/page)を読む唯一の一覧系ルート。
// 一覧(/blogs)・カテゴリ(/blogs/[category])を静的(ISR)に保つため、
// 動的レンダリングが必要な検索処理をこのルートに隔離している(Issue #225)。
export const dynamic = "force-dynamic";

type SearchPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    [PAGE_QUERY]: string;
    [CATEGORY_QUERY]: string;
    [KEYWORD_QUERY]: string;
  }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations({ locale, namespace: "blog" });
  const page = resolvedSearchParams[PAGE_QUERY] || null;
  const category = resolvedSearchParams[CATEGORY_QUERY] || null;
  const keyword = resolvedSearchParams[KEYWORD_QUERY] || null;

  // canonical / og:url は検索クエリを含めず素の /blogs に正規化して集約する
  const blogsUrl = buildPageUrl(locale, "blogs");
  const blogsLanguages = buildLanguageAlternates("blogs");

  // カテゴリ名を翻訳（id・スラッグ・表示名(ja/en)のいずれで渡されても解決する）
  let translatedCategory = category;
  if (category) {
    const categoryEntry = resolveCategoryEntry(category);
    translatedCategory = categoryEntry
      ? getLocalizedCategoryName(categoryEntry, locale)
      : category;
  }

  const pageSuffix = page ? ` - ${t("page")} ${page}` : "";
  let title = "";
  if (category && keyword) {
    title = `${translatedCategory} & ${keyword}`;
  } else if (keyword) {
    title = `${keyword}`;
  } else if (category) {
    title = `${translatedCategory}`;
  }
  const description = title;
  title += pageSuffix;

  return {
    title,
    description,
    // 検索結果はインデックスさせない（重複コンテンツ防止）
    robots: "noindex",
    alternates: { canonical: blogsUrl, languages: blogsLanguages },
    openGraph: { url: blogsUrl, title, description, siteName: "Ryota-Blog", type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

const Page = async ({ params, searchParams }: SearchPageProps) => {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams[CATEGORY_QUERY];
  const keyword = resolvedSearchParams[KEYWORD_QUERY];
  const page = resolvedSearchParams[PAGE_QUERY] || "1";

  const query: BlogListQuery = generateQuery(resolvedSearchParams);
  const categoryEntry = category ? resolveCategoryEntry(category) : undefined;
  const categoryLabel = categoryEntry
    ? getLocalizedCategoryName(categoryEntry, locale)
    : category;

  return (
    <>
      <div className="flex w-full flex-col justify-between px-2 md:px-0 lg:w-[calc(100%_-_300px)]">
        <div className="flex flex-grow flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex items-center justify-center border-2 border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-black">
              <BlogTypeTabs blogType="blogs" />
            </div>
            {(category || keyword) && (
              <SearchStateCard category={categoryLabel} keyword={keyword} />
            )}
          </div>
          <Suspense fallback={<Skelton />}>
            <ArticleList
              query={query}
              blogType="blogs"
              page={page}
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
