import ArticleCard from "@/components/ArticleList/ArticleCard";
import NoContents from "@/components/UiParts/NoContentsPage";
import { getBlogList } from "@/lib/microcms";
import type { MicroCMSQueries } from "microcms-js-sdk";

type ArticleListProps = {
  query: MicroCMSQueries
}

const ArticleList = async ({ query }: ArticleListProps) => {
  const data = await getBlogList(query);

  return (
    data.totalCount !== 0
      ?
      <ul className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {data.contents.map((item) => (
          <li key={item.id}>
            <ArticleCard data={item} />
          </li>
        ))}
      </ul>
      :
      <NoContents />
  )
}
export default ArticleList;