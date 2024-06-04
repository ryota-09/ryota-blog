import RelatedContentItem from "@/components/RelatedContentList/RelatedContentItem";
import { BlogsContentType } from "@/types/microcms";

type RelatedContentProps = {
  data: BlogsContentType[]
}

const RelatedContentList = ({ data }: RelatedContentProps) => {

  return (
    <>
      <div className="text-2xl dark:text-gray-300 font-bold mb-4">関連記事</div>
      <ul className="divide-y">
        {data.map(({ id, publishedAt, updatedAt, title, category }) => (
          <RelatedContentItem key={id} id={id} publishedAt={publishedAt} updatedAt={updatedAt} title={title} category={category} />
        ))}
      </ul>
    </>
  );
}
export default RelatedContentList;