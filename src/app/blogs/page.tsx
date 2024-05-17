
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import SearchStateCard from "@/components/SearchStateCard";
import SideNav from "@/components/SideNav";
import { generateQuery } from "@/lib";
import { getBlogList } from "@/lib/microcms";
import { CATEGORY_QUERY, KEYWORD_QUERY, PAGE_QUERY, PER_PAGE } from "@/static/blogs";
import { MappedKeyLiteralType } from "@/types/microcms";
import { MicroCMSQueries } from "microcms-js-sdk";

const Page = async ({ searchParams }: { searchParams: { [PAGE_QUERY]: string, [CATEGORY_QUERY]: MappedKeyLiteralType, [KEYWORD_QUERY]: string } }) => {
  const category = searchParams[CATEGORY_QUERY];
  const keyword = searchParams[KEYWORD_QUERY];


  const query: MicroCMSQueries = generateQuery(searchParams);

  const data = await getBlogList(query);

  return (
    <>
      <div className="w-full md:w-[calc(100%_-_300px)] flex flex-col justify-between">
        <div className="flex flex-col gap-4">
          {(category || keyword) && (
            <SearchStateCard category={category} keyword={keyword} />
          )}
          <ul className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {data.contents.map((item) => (
              <li key={item.id}>
                <ArticleCard data={item} />
              </li>
            ))}
          </ul>
        </div>
        <nav className="flex md:flex-none justify-center mt-8">
          <Pagination totalPages={Math.floor(data.totalCount / PER_PAGE) + 1} currentPage={searchParams[PAGE_QUERY] ? +searchParams[PAGE_QUERY] : 1} />
        </nav>
      </div>
      <SideNav />
    </>
  );
}
export default Page;