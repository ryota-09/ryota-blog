import { Suspense } from "react";
import type { MicroCMSQueries } from "microcms-js-sdk";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from 'next-intl/server';

import ArticleList from "@/components/ArticleList";
import Skelton from "@/components/ArticleList/skelton";
import SearchStateCard from "@/components/SearchStateCard";
import SideNav from "@/components/SideNav";
import ZennArticleList from "@/components/ZennArticleList";
import { generateQuery, buildPageUrl, buildLanguageAlternates } from "@/lib";
import { getLocalizedCategoryName } from "@/lib/i18n-utils";
import { BLOG_TYPE_QUERY, CATEGORY_QUERY, KEYWORD_QUERY, PAGE_QUERY } from "@/static/blogs";
import { CATEGORIES, findCategoryBySlug } from "@/static/categories";
import BlogTypeTabs from "@/components/UiParts/BlogTypeTabs";
import type { BlogTypeKeyLIteralType } from "@/types";
import { locales } from '@/i18n/config';

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
  { params, searchParams }: { params: Promise<{ locale: string; category: string }>, searchParams: Promise<{ [BLOG_TYPE_QUERY]: BlogTypeKeyLIteralType, [PAGE_QUERY]: string, [KEYWORD_QUERY]: string }> }
): Promise<Metadata> {
  // Next.js 16では、paramsとsearchParamsを非同期で取得する必要がある
  const { locale, category } = await params;
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const categoryEntry = findCategoryBySlug(category);

  if (!categoryEntry) {
    notFound();
  }

  const translatedCategoryName = getLocalizedCategoryName(categoryEntry, locale);

  const blogType = resolvedSearchParams.blogType || "blogs";
  const page = resolvedSearchParams.page || null;
  const keyword = resolvedSearchParams.keyword || null;

  // canonical / og:url は検索・ページのクエリを含めず素のカテゴリURLに正規化して集約する
  const categoryUrl = buildPageUrl(locale, "blogs", category);
  const categoryLanguages = buildLanguageAlternates("blogs", category);

  if (blogType === "zenn") {
    return {
      title: t('zennArticles'),
      description: t('zennArticles'),
      alternates: { canonical: categoryUrl, languages: categoryLanguages },
      openGraph: { url: categoryUrl, title: t('zennArticles'), description: t('zennArticles'), siteName: "Ryota-Blog", type: "website" },
      twitter: { card: "summary_large_image" },
    }
  }

  if (blogType === "blogs" && !keyword) {
    const title = page ? `${translatedCategoryName} - ${t('page')} ${page}` : translatedCategoryName;
    return {
      title,
      description: translatedCategoryName,
      robots: page ? "noindex" : "index",
      alternates: { canonical: categoryUrl, languages: categoryLanguages },
      openGraph: { url: categoryUrl, title, description: translatedCategoryName, siteName: "Ryota-Blog", type: "website" },
      twitter: { card: "summary_large_image" },
    }
  }

  let title = page ? ` - ${t('page')} ${page}` : ""
  let description = ""

  if (keyword) {
    title = `${translatedCategoryName} & ${keyword}` + title
    description = `${translatedCategoryName} & ${keyword}`
  }

  return {
    title: title,
    description: description,
    robots: page ? "noindex" : "index",
    alternates: { canonical: categoryUrl, languages: categoryLanguages },
    openGraph: { url: categoryUrl, title, description, siteName: "Ryota-Blog", type: "website" },
    twitter: { card: "summary_large_image" },
  }
}

type PageProps = {
  params: Promise<{
    locale: string;
    category: string;
  }>;
  searchParams: Promise<{
    [BLOG_TYPE_QUERY]: BlogTypeKeyLIteralType,
    [PAGE_QUERY]: string,
    [KEYWORD_QUERY]: string
  }>;
};

const Page = async ({ params, searchParams }: PageProps) => {
  // Next.js 16では、paramsとsearchParamsを非同期で取得する必要がある
  const { locale, category } = await params;
  const resolvedSearchParams = await searchParams;
  const categoryEntry = findCategoryBySlug(category);

  if (!categoryEntry) {
    notFound();
  }

  const keyword = resolvedSearchParams[KEYWORD_QUERY];
  const blogType = resolvedSearchParams[BLOG_TYPE_QUERY] || "blogs";
  const page = resolvedSearchParams[PAGE_QUERY] || "1";

  const modifiedSearchParams = {
    ...resolvedSearchParams,
    [CATEGORY_QUERY]: categoryEntry.id
  };

  const query: MicroCMSQueries = generateQuery(modifiedSearchParams);

  return (
    <>
      <div className="w-full lg:w-[calc(100%_-_300px)] flex flex-col justify-between px-2 md:px-0">
        <div className="flex flex-col flex-grow gap-4">
          <div className="flex gap-4 flex-col lg:flex-row">
            <div className="flex justify-center items-center p-3 bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-600">
              <BlogTypeTabs blogType={blogType} />
            </div>
            <SearchStateCard category={getLocalizedCategoryName(categoryEntry, locale)} keyword={keyword} />
          </div>
          {blogType === "zenn"
            ?
            <ZennArticleList locale={locale} />
            :
            <Suspense fallback={<Skelton />}>
              <ArticleList query={query} blogType={blogType} page={page} basePath={`/${locale}/blogs/${category}`} locale={locale} />
            </Suspense>
          }
        </div>
      </div>
      <SideNav locale={locale} />
    </>
  );
};

export default Page;