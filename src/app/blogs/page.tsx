
import { Suspense } from "react";
import type { MicroCMSQueries } from "microcms-js-sdk";
import type { Metadata } from "next";

import ArticleList from "@/components/ArticleList";
import Skelton from "@/components/ArticleList/skelton";
import Pagination from "@/components/Pagination";
import SearchStateCard from "@/components/SearchStateCard";
import SideNav from "@/components/SideNav";
import { generateQuery } from "@/lib";
import { BLOG_TYPE_QUERY, CATEGORY_QUERY, KEYWORD_QUERY, PAGE_QUERY } from "@/static/blogs";
import { MappedKeyLiteralType } from "@/types/microcms";
import BlogTypeTabs from "@/components/UiParts/BlogTypeTabs";
import { BlogTypeKeyLIteralType } from "@/types";
import ZennArticleList from "@/components/ZennArticleList";

export function generateMetadata(
  { searchParams }: { searchParams: { [BLOG_TYPE_QUERY]: BlogTypeKeyLIteralType, [PAGE_QUERY]: string, [CATEGORY_QUERY]: MappedKeyLiteralType, [KEYWORD_QUERY]: string } },
): Metadata {
  const blogType = searchParams.blogType || "blogs";
  const page = searchParams.page || null;
  const category = searchParams.category || null
  const keyword = searchParams.keyword || null

  // NOTE: ?blogType=zenn にアクセスした場合  
  if (blogType === "zenn") {
    return {
      title: "Zennの記事一覧",
      description: "これまでZennで書いてきた記事の一覧です。"
    }
  }
  // NOTE: /blogs にアクセスした場合
  if (blogType === "blogs" && !category && !keyword) {
    return {
      title: page ? `記事一覧のページ。${page}ページ目。` : "HOME",
      robots: page ? "noindex" : "index"
    }
  }

  let title = `に関する検索結果のページ${page ? `。${page}ページ目。` : ""}`
  let description = "に関する検索結果のページです。"
  // NOTE: ?category=hoge&keyword=fuga にアクセスした場合
  if (category && keyword) {
    title = `${category}と${keyword}` + title
    description = `${category}と${keyword}` + description
  }
  // NOTE: ?category=hoge にアクセスした場合
  if (keyword && !category) {
    title = `${keyword}` + title
    description = `${keyword}` + description
  }
  // NOTE: ?keyword=fuga にアクセスした場合
  if (category && !keyword) {
    title = `${category}` + title
    description = `${category}` + description
  }
  console.log(page)
  return {
    title: title,
    description: description,
    robots: page ? "noindex" : "index"
  }
}

const Page = ({ searchParams }: { searchParams: { [BLOG_TYPE_QUERY]: BlogTypeKeyLIteralType, [PAGE_QUERY]: string, [CATEGORY_QUERY]: MappedKeyLiteralType, [KEYWORD_QUERY]: string } }) => {
  const category = searchParams[CATEGORY_QUERY];
  const keyword = searchParams[KEYWORD_QUERY];
  const blogType = searchParams[BLOG_TYPE_QUERY] || "blogs";
  const page = searchParams[PAGE_QUERY] || "1";

  const query: MicroCMSQueries = generateQuery(searchParams);

  return (
    <>
      <div className="w-full md:w-[calc(100%_-_300px)] flex flex-col justify-between px-2 md:px-0">
        <div className="flex flex-col gap-4">
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
              <ArticleList query={query} />
            </Suspense>
          }
        </div>
        {blogType === "blogs" && (
          <Suspense fallback={<div className="h-16" />}>
            <nav className="flex md:flex-none justify-center  mt-4">
              <Pagination query={query} currentPage={+page} />
            </nav>
          </Suspense>
        )}
      </div>
      <SideNav />
    </>
  );
}
export default Page;