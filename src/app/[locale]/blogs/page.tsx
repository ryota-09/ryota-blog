import { Suspense } from "react";
import type { MicroCMSQueries } from "microcms-js-sdk";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getTranslations } from 'next-intl/server';

import ArticleList from "@/components/ArticleList";
import Skelton from "@/components/ArticleList/skelton";
import SearchStateCard from "@/components/SearchStateCard";
import SideNav from "@/components/SideNav";
import { generateQuery } from "@/lib";
import { BLOG_TYPE_QUERY, CATEGORY_QUERY, KEYWORD_QUERY, PAGE_QUERY } from "@/static/blogs";
import BlogTypeTabs from "@/components/UiParts/BlogTypeTabs";
import type { MappedKeyLiteralType } from "@/types/microcms";
import type { BlogTypeKeyLIteralType } from "@/types";

const ZennArticleList = dynamic(() => import("@/components/ZennArticleList"));

interface PageProps {
  params: {
    locale: string;
  };
  searchParams: { 
    [BLOG_TYPE_QUERY]: BlogTypeKeyLIteralType; 
    [PAGE_QUERY]: string; 
    [CATEGORY_QUERY]: MappedKeyLiteralType; 
    [KEYWORD_QUERY]: string;
  };
}

export async function generateMetadata(
  { params: { locale }, searchParams }: PageProps,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'blog' });
  const blogType = searchParams.blogType || "blogs";
  const page = searchParams.page || null;
  const category = searchParams.category || null
  const keyword = searchParams.keyword || null

  // NOTE: ?blogType=zenn にアクセスした場合  
  if (blogType === "zenn") {
    return {
      title: t('zennArticles'),
      description: t('zennArticles')
    }
  }
  // NOTE: /blogs にアクセスした場合
  if (blogType === "blogs" && !category && !keyword) {
    return {
      title: page ? `${t('recentPosts')} - ${t('page')} ${page}` : "HOME",
      robots: page ? "noindex" : "index"
    }
  }

  let title = page ? ` - ${t('page')} ${page}` : ""
  let description = ""
  // NOTE: ?category=hoge&keyword=fuga にアクセスした場合
  if (category && keyword) {
    title = `${category} & ${keyword}` + title
    description = `${category} & ${keyword}`
  }
  // NOTE: ?category=hoge にアクセスした場合
  if (keyword && !category) {
    title = `${keyword}` + title
    description = `${keyword}`
  }
  // NOTE: ?keyword=fuga にアクセスした場合
  if (category && !keyword) {
    title = `${category}` + title
    description = `${category}`
  }

  return {
    title: title,
    description: description,
    robots: page ? "noindex" : "index"
  }
}

const Page = ({ params: { locale }, searchParams }: PageProps) => {
  const category = searchParams[CATEGORY_QUERY];
  const keyword = searchParams[KEYWORD_QUERY];
  const blogType = searchParams[BLOG_TYPE_QUERY] || "blogs";
  const page = searchParams[PAGE_QUERY] || "1";

  const query: MicroCMSQueries = generateQuery(searchParams);

  return (
    <>
      <div className="w-full lg:w-[calc(100%_-_300px)] flex flex-col justify-between px-2 md:px-0">
        <div className="flex flex-col flex-grow gap-4">
          <div className="flex gap-4 flex-col lg:flex-row">
            <div className="flex justify-center items-center p-3 bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-600">
              <BlogTypeTabs blogType={blogType} />
            </div>
            {(category || keyword) && (
              <SearchStateCard category={category} keyword={keyword} />
            )}
          </div>
          {blogType === "zenn"
            ?
            <ZennArticleList />
            :
            <Suspense fallback={<Skelton />}>
              <ArticleList query={query} blogType={blogType} page={page} />
            </Suspense>
          }
        </div>
      </div>
      <SideNav />
    </>
  );
}
export default Page;