import { Suspense } from "react";
import type { MicroCMSQueries } from "microcms-js-sdk";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ArticleList from "@/components/ArticleList";
import Skelton from "@/components/ArticleList/skelton";
import SideNav from "@/components/SideNav";
import { generateQuery } from "@/lib";
import BlogTypeTabs from "@/components/UiParts/BlogTypeTabs";
import { getBlogList } from "@/lib/microcms";
import { PER_PAGE } from "@/static/blogs";

export async function generateStaticParams() {
  const data = await getBlogList({ limit: 1 });
  const totalPages = Math.ceil(data.totalCount / PER_PAGE);
  
  // Generate params for pages 2 onwards (page 1 is at /blogs)
  return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) => ({
    page: String(i + 2)
  }));
}

export function generateMetadata(
  { params }: { params: { page: string } }
): Metadata {
  const page = params.page;
  
  return {
    title: `記事一覧のページ。${page}ページ目。`,
    description: `記事一覧の${page}ページ目です。`,
    robots: "noindex",
    alternates: {
      canonical: `/blogs/page/${page}`
    }
  };
}

const Page = async ({ params }: { params: { page: string } }) => {
  const pageNum = parseInt(params.page);
  
  // Validate page number
  if (isNaN(pageNum) || pageNum < 2) {
    notFound();
  }
  
  // Check if page exists
  const data = await getBlogList({ limit: 1 });
  const totalPages = Math.ceil(data.totalCount / PER_PAGE);
  
  if (pageNum > totalPages) {
    notFound();
  }

  const blogType = "blogs";
  const query: MicroCMSQueries = generateQuery({ 
    page: params.page,
    category: "",
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
          </div>
          <Suspense fallback={<Skelton />}>
            <ArticleList query={query} blogType={blogType} page={params.page} basePath="/blogs" />
          </Suspense>
        </div>
      </div>
      <SideNav />
    </>
  );
};

export default Page;