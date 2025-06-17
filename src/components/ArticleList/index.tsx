import dynamic from "next/dynamic";
import { Suspense } from "react";

import ArticleCard from "@/components/ArticleList/ArticleCard";
import { getBlogListByLocale } from "@/lib/microcms";
import { PER_PAGE } from "@/static/blogs";
import type { BlogTypeKeyLIteralType } from "@/types";
import type { MicroCMSQueries } from "microcms-js-sdk";
import NoContents from "@/components/UiParts/NoContentsPage";
import { BlogsContentType } from "@/types/microcms";

const Pagination = dynamic(() => import("@/components/Pagination"));

type ArticleListProps = {
  query: MicroCMSQueries;
  blogType: BlogTypeKeyLIteralType;
  page: string;
  basePath?: string;
  locale: string;
};

const ArticleList = async ({
  query,
  blogType,
  page,
  basePath,
  locale,
}: ArticleListProps) => {
  const data = await getBlogListByLocale(
    locale,
    { ...query, orders: "-publishedAt" },
    { next: { revalidate: 86400 } },
  );
  const contentCount = data.contents.length;
  const emptyItem = PER_PAGE - contentCount;
  return (
    <div className="flex h-full animate-fadeIn flex-col justify-between opacity-50">
      {data.totalCount !== 0 ? (
        <ul className="flex-imtem grid grid-cols-1 gap-4 xl:grid-cols-2">
          {data.contents.map((item: BlogsContentType, index: number) => (
            <li key={item.id} data-testid={`pw-article-card-${index}`}>
              <ArticleCard data={item} index={index} />
            </li>
          ))}
          {Array.from({ length: emptyItem }).map((_, index) => (
            <li key={index} className="hidden md:block md:h-[290px]" />
          ))}
        </ul>
      ) : (
        <NoContents />
      )}
      {blogType === "blogs" && contentCount >= 1 && (
        <nav
          className="mt-4 flex justify-center md:flex-none"
          role="navigation"
        >
          <Suspense fallback={<div className="h-8" />}>
            <Pagination
              currentPage={+page}
              totalCount={data.totalCount}
              basePath={basePath}
            />
          </Suspense>
        </nav>
      )}
    </div>
  );
};
export default ArticleList;
