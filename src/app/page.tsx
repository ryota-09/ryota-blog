import ArticleCard from "@/components/ArticleCard";
import { getArticleList } from "@/lib/microcms";

const data = [
  {
    id: "1",
    title: "タイのひとり旅所感",
    description: "タイ！初めての海外ひとり旅！非常に良い経験でした！感じたことをつらつら書いています。基本的には素晴らしいとはありません",
    updatedAt: "2021-10-10",
    thumbnail: "/test.webp",
  },
  {
    id: "2",
    title: "title2title2title2title2title2title2title2title2title2title2title2title2title2title2",
    description: "description2",
    updatedAt: "2021-10-10",
    thumbnail: "/test.webp",
  },
  {
    id: "3",
    title: "タイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトルタイトル",
    description: "description3",
    updatedAt: "2021-10-10",
    thumbnail: "/test.webp",
  },
]

const Page = async () => {
  // const data = await getArticleList();
  return (
    <div className="w-[calc(100%_-_300px)]">
      <ul className="grid grid-cols-2 gap-4">
        {data.map((item) => (
          <li key={item.id}>
            <ArticleCard data={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Page;