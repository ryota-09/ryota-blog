import { Suspense } from "react";
import type { MicroCMSQueries } from "microcms-js-sdk";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ArticleList from "@/components/ArticleList";
import Skelton from "@/components/ArticleList/skelton";
import SearchStateCard from "@/components/SearchStateCard";
import SideNav from "@/components/SideNav";
import { generateQuery } from "@/lib";
import { getBlogList } from "@/lib/microcms";
import { PER_PAGE, CATEGORY_MAPED_NAME, CATEGORY_MAPED_ID } from "@/static/blogs";
import BlogTypeTabs from "@/components/UiParts/BlogTypeTabs";
import type { BlogTypeKeyLIteralType } from "@/types";

export async function generateStaticParams() {
  const categories = Object.entries(CATEGORY_MAPED_ID);
  const staticParams = [];
  
  for (const [categoryName, categoryId] of categories) {
    try {
      const query: MicroCMSQueries = {
        limit: 1,
        filters: `category[contains]${categoryName}`
      };
      
      const data = await getBlogList(query);
      const totalPages = Math.ceil(data.totalCount / PER_PAGE);
      
      // ページ2以降のパラメータを生成（ページ1は /blogs/[category] にある）
      for (let i = 2; i <= totalPages; i++) {
        staticParams.push({
          category: categoryId,
          page: String(i)
        });
      }
    } catch (error) {
      console.warn(`カテゴリの静的パラメータ生成に失敗しました: ${categoryName}`, error);
    }
  }
  
  return staticParams;
}

export async function generateMetadata(
  { params }: { params: { category: string, page: string } }
): Promise<Metadata> {
  const categoryName = CATEGORY_MAPED_NAME[params.category];
  const page = params.page;
  
  if (!categoryName) {
    notFound();
  }

  return {
    title: `${categoryName}の記事一覧。${page}ページ目。`,
    description: `${categoryName}に関する技術記事の一覧の${page}ページ目です。`,
    robots: "noindex",
    alternates: {
      canonical: `/blogs/${params.category}/page/${page}`
    }
  };
}

type PageProps = {
  params: {
    category: string;
    page: string;
  };
};

const Page = async ({ params }: PageProps) => {
  const categoryName = CATEGORY_MAPED_NAME[params.category];
  const pageNum = parseInt(params.page);
  
  if (!categoryName) {
    notFound();
  }
  
  // ページ番号のバリデーション
  if (isNaN(pageNum) || pageNum < 2) {
    notFound();
  }
  
  // このカテゴリでページが存在するかチェック
  const checkQuery: MicroCMSQueries = {
    limit: 1,
    filters: `category[contains]${categoryName}`
  };
  const data = await getBlogList(checkQuery);
  const totalPages = Math.ceil(data.totalCount / PER_PAGE);
  
  if (pageNum > totalPages) {
    notFound();
  }

  const blogType = "blogs";
  const query: MicroCMSQueries = generateQuery({ 
    page: params.page,
    category: categoryName,
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
            <SearchStateCard category={categoryName} keyword={""} />
          </div>
          <Suspense fallback={<Skelton />}>
            <ArticleList 
              query={query} 
              blogType={blogType} 
              page={params.page} 
              basePath={`/blogs/${params.category}`}
            />
          </Suspense>
        </div>
      </div>
      <SideNav />
    </>
  );
};

export default Page;