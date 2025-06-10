import { Suspense } from "react";
import type { MicroCMSQueries } from "microcms-js-sdk";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";

import ArticleList from "@/components/ArticleList";
import Skelton from "@/components/ArticleList/skelton";
import SearchStateCard from "@/components/SearchStateCard";
import SideNav from "@/components/SideNav";
import { generateQuery } from "@/lib";
import { BLOG_TYPE_QUERY, CATEGORY_QUERY, KEYWORD_QUERY, PAGE_QUERY, CATEGORY_MAPED_NAME, CATEGORY_MAPED_ID } from "@/static/blogs";
import BlogTypeTabs from "@/components/UiParts/BlogTypeTabs";
import type { MappedKeyLiteralType } from "@/types/microcms";
import type { BlogTypeKeyLIteralType } from "@/types";

const ZennArticleList = dynamic(() => import("@/components/ZennArticleList"));

export async function generateStaticParams() {
  return Object.values(CATEGORY_MAPED_ID).map((categoryId) => ({
    category: categoryId
  }));
}

export async function generateMetadata(
  { params, searchParams }: { params: { category: string }, searchParams: { [BLOG_TYPE_QUERY]: BlogTypeKeyLIteralType, [PAGE_QUERY]: string, [KEYWORD_QUERY]: string } }
): Promise<Metadata> {
  const categoryName = CATEGORY_MAPED_NAME[params.category];
  
  if (!categoryName) {
    notFound();
  }

  const blogType = searchParams.blogType || "blogs";
  const page = searchParams.page || null;
  const keyword = searchParams.keyword || null;

  if (blogType === "zenn") {
    return {
      title: "Zennの記事一覧",
      description: "これまでZennで書いてきた記事の一覧です。"
    }
  }

  if (blogType === "blogs" && !keyword) {
    return {
      title: page ? `${categoryName}の記事一覧。${page}ページ目。` : `${categoryName}の記事一覧`,
      description: `${categoryName}に関する技術記事の一覧です。`,
      robots: page ? "noindex" : "index"
    }
  }

  let title = `に関する検索結果のページ${page ? `。${page}ページ目。` : ""}`
  let description = "に関する検索結果のページです。"
  
  if (keyword) {
    title = `${categoryName}と${keyword}` + title
    description = `${categoryName}と${keyword}` + description
  }

  return {
    title: title,
    description: description,
    robots: page ? "noindex" : "index"
  }
}

type PageProps = {
  params: {
    category: string;
  };
  searchParams: { 
    [BLOG_TYPE_QUERY]: BlogTypeKeyLIteralType, 
    [PAGE_QUERY]: string, 
    [KEYWORD_QUERY]: string 
  };
};

const Page = ({ params, searchParams }: PageProps) => {
  const categoryName = CATEGORY_MAPED_NAME[params.category];
  
  if (!categoryName) {
    notFound();
  }

  const keyword = searchParams[KEYWORD_QUERY];
  const blogType = searchParams[BLOG_TYPE_QUERY] || "blogs";
  const page = searchParams[PAGE_QUERY] || "1";

  const modifiedSearchParams = {
    ...searchParams,
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
};

export default Page;