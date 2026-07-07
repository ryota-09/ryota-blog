import dynamic from "next/dynamic";
import { Suspense } from "react";

import ArticleCard from "@/components/ArticleList/ArticleCard";
import { getBlogList } from "@/lib/content";
import { PER_PAGE } from "@/static/blogs";
import type { BlogTypeKeyLIteralType } from "@/types";
import type { BlogListQuery, BlogPost, ContentLocale } from "@/types/content";
import NoContents from "@/components/UiParts/NoContentsPage";

const Pagination = dynamic(() => import("@/components/Pagination"));

type ArticleListProps = {
  query: BlogListQuery
  blogType: BlogTypeKeyLIteralType
  page: string
  basePath?: string
  locale: string
}

const ArticleList = async ({ query, blogType, page, basePath, locale }: ArticleListProps) => {
  // NOTE: content.tsのgetBlogListは常にpublishedAt降順で返すため、
  // microCMS時代のorders/fields指定(取得フィールド絞り込み)は不要になった
  const data = getBlogList(locale as ContentLocale, query);
  const contentCount = data.contents.length
  const emptyItem = PER_PAGE - contentCount
  return (
    <div className="flex flex-col justify-between h-full">
      {data.totalCount !== 0
        ?
        <ul className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* NOTE: フェードイン演出(animate-fadeIn)はView Transitionのスナップショットが
              opacity:0のコンテンツで撮られ、遷移のたびに画面がちらつく原因になるため付けない */}
          {data.contents.map((item: BlogPost, index: number) => (
            <li
              key={item.slug}
              data-testid={`pw-article-card-${index}`}
            >
              <ArticleCard data={item} index={index} />
            </li>
          ))}
          {Array.from({ length: emptyItem }).map((_, index) => (
            <li key={index} className="hidden md:block md:h-[290px]" />
          ))}
        </ul>
        :
        <NoContents />
      }
      {(blogType === "blogs" && contentCount >= 1) && (
        <nav className="flex md:flex-none justify-center mt-4">
          <Suspense fallback={<div className="h-8" />}>
            <Pagination currentPage={+page} totalCount={data.totalCount} basePath={basePath} />
          </Suspense>
        </nav>
      )}
    </div>
  )
}
export default ArticleList;