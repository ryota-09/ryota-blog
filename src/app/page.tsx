import { getArticleList } from "@/lib/microcms";

const Page = async () => {
  const data = await getArticleList();
  console.log(data);
  return (
    <div className="w-[calc(100%_-_300px)] bg-red-300"></div>
  );
}
export default Page;