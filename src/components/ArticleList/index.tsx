import ArticleCard from "@/components/ArticleList/ArticleCard";
import NoContents from "@/components/UiParts/NoContentsPage";
import { getBlogList } from "@/lib/microcms";
import { PER_PAGE } from "@/static/blogs";
import type { MicroCMSQueries } from "microcms-js-sdk";

type ArticleListProps = {
  query: MicroCMSQueries
}

const ArticleList = async ({ query }: ArticleListProps) => {
  const data = await getBlogList({ ...query, orders: "-publishedAt" }, { cache: "no-store" });
  const contentCount = data.contents.length;

  const emptyRow = contentCount > PER_PAGE || contentCount % PER_PAGE === 0 ? 0 : 1;

  return (
    data.totalCount !== 0
      ?
      <ul className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {data.contents.map((item) => (
          <li key={item.id}>
            <ArticleCard data={item} />
          </li>
        ))}
        {emptyRow === 1 && <li className="hidden lg:block lg:h-[250px]" />}
      </ul>
      :
      <NoContents />
  )
}
export default ArticleList;