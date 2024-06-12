import ArticleCard from "@/components/ArticleList/ArticleCard";
import Pagination from "@/components/Pagination";
import NoContents from "@/components/UiParts/NoContentsPage";
import { getBlogList } from "@/lib/microcms";
import { PER_PAGE } from "@/static/blogs";
import { BlogTypeKeyLIteralType } from "@/types";
import type { MicroCMSQueries } from "microcms-js-sdk";

type ArticleListProps = {
  query: MicroCMSQueries
  blogType: BlogTypeKeyLIteralType
  page: string
}

const ArticleList = async ({ query, blogType, page }: ArticleListProps) => {
  const data = await getBlogList({ ...query, orders: "-publishedAt" }, { cache: "no-store" });
  const contentCount = data.contents.length
  const emptyItem = PER_PAGE - contentCount
  return (
    <div className="flex flex-col justify-between h-full">
      {data.totalCount !== 0
        ?
        <ul className="flex-imtem grid grid-cols-1 xl:grid-cols-2 gap-4">
          {data.contents.map((item) => (
            <li key={item.id}>
              <ArticleCard data={item} />
            </li>
          ))}
          {Array.from({ length: emptyItem }).map((_, index) => (
            <li key={index} className="hidden md:block md:min-h-[240px]" />
          ))}
        </ul>
        :
        <NoContents />
      }
      {(blogType === "blogs" && contentCount >= 1) && (
        <nav className="flex md:flex-none justify-center mt-4">
          <Pagination currentPage={+page} totalCount={10} />
        </nav>
      )}
    </div>
  )
}
export default ArticleList;