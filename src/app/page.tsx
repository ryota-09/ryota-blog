import ArticleCard from "@/components/ArticleCard";
import SideNav from "@/components/SideNav";
import { getBlogList } from "@/lib/microcms";

const Page = async () => {
  const data = await getBlogList();
  return (
    <>
      <div className="w-[calc(100%_-_300px)]">
        <ul className="grid grid-cols-2 gap-4">
          {data.contents.map((item) => (
            <li key={item.id}>
              <ArticleCard data={item} />
            </li>
          ))}
        </ul>
      </div>
      <SideNav />
    </>
  );
}
export default Page;