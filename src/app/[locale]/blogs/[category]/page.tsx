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
import { generateQuery } from "@/lib";
import { BLOG_TYPE_QUERY, CATEGORY_QUERY, KEYWORD_QUERY, PAGE_QUERY, CATEGORY_MAPED_NAME, CATEGORY_MAPED_ID } from "@/static/blogs";
import BlogTypeTabs from "@/components/UiParts/BlogTypeTabs";
import type { MappedKeyLiteralType } from "@/types/microcms";
import type { BlogTypeKeyLIteralType } from "@/types";
import { locales } from '@/i18n/config';

export async function generateStaticParams() {
  const params = [];
  for (const locale of locales) {
    for (const categoryId of Object.values(CATEGORY_MAPED_ID)) {
      params.push({
        locale,
        category: categoryId
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

  const blogType = resolvedSearchParams.blogType || "blogs";
  const page = resolvedSearchParams.page || null;
  const keyword = resolvedSearchParams.keyword || null;

  if (blogType === "zenn") {
    return {
      title: t('zennArticles'),
      description: t('zennArticles')
    }
  }

  if (blogType === "blogs" && !keyword) {
    const title = page ? `${translatedCategoryName} - ${t('page')} ${page}` : translatedCategoryName;
    return {
      title,
      description: translatedCategoryName,
      robots: page ? "noindex" : "index"
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
    robots: page ? "noindex" : "index"
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
  const categoryName = CATEGORY_MAPED_NAME[category];

  if (!categoryName) {
    notFound();
  }

  const keyword = resolvedSearchParams[KEYWORD_QUERY];
  const blogType = resolvedSearchParams[BLOG_TYPE_QUERY] || "blogs";
  const page = resolvedSearchParams[PAGE_QUERY] || "1";

  const modifiedSearchParams = {
    ...resolvedSearchParams,
    [CATEGORY_QUERY]: categoryName
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
            <SearchStateCard category={categoryName} keyword={keyword} />
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