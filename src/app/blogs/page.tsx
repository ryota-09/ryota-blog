
import { MicroCMSQueries } from "microcms-js-sdk";
import { Suspense } from "react";

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

const Page = ({ searchParams }: { searchParams: { [BLOG_TYPE_QUERY]: BlogTypeKeyLIteralType, [PAGE_QUERY]: string, [CATEGORY_QUERY]: MappedKeyLiteralType, [KEYWORD_QUERY]: string } }) => {
  const category = searchParams[CATEGORY_QUERY];
  const keyword = searchParams[KEYWORD_QUERY];
  const blogType = searchParams[BLOG_TYPE_QUERY] || "blogs";

  const query: MicroCMSQueries = generateQuery(searchParams);
  
  return (
    <>
      <div className="w-full md:w-[calc(100%_-_300px)] flex flex-col justify-between px-2 md:px-0">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 flex-col lg:flex-row">
            <div className="flex justify-center items-center p-3 bg-white border-2 border-gray-200">
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
              <Pagination query={query} currentPage={searchParams[PAGE_QUERY] ? +searchParams[PAGE_QUERY] : 1} />
            </nav>
          </Suspense>
        )}
      </div>
      <SideNav />
    </>
  );
}
export default Page;