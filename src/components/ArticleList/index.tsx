import ArticleCard from "@/components/ArticleList/ArticleCard";
import NoContents from "@/components/UiParts/NoContentsPage";
import { getBlogList } from "@/lib/microcms";
import type { MicroCMSQueries } from "microcms-js-sdk";

type ArticleListProps = {
  query: MicroCMSQueries
}

const ArticleList = async ({ query }: ArticleListProps) => {
  const data = await getBlogList(query);
  const contentCount = data.contents.length;

  const emptyRow = contentCount > 4 || contentCount % 4 === 0 ? 0 : 1;

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