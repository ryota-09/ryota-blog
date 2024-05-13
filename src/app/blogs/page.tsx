
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import SideNav from "@/components/SideNav";
import { getBlogList } from "@/lib/microcms";

const Page = async () => {
  const data = await getBlogList();
  return (
    <>
      <div className="w-[calc(100%_-_300px)]">
        <ul className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {data.contents.map((item) => (
            <li key={item.id}>
              <ArticleCard data={item} />
            </li>
          ))}
          {Array.from({ length: 30 }).map((_, index) => (
            <li key={index}>
              <ArticleCard data={{
                id: "",
                title: "記事タイトル",
                description: "記事の説明が入ります。記事の説明が入ります。記事の説明が入ります。",
                thumbnail: {
                  url: "/images/no-image.png"
                }
              }} />
            </li>
          ))}
        </ul>
        <nav>
          <Pagination totalPages={5} currentPage={1} perPage={6} />
        </nav>
      </div>
      <SideNav />
    </>
  );
}
export default Page;