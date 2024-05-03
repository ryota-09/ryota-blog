import ArticleBody from "@/components/ArticleBody";
import { getBlogById } from "@/lib/microcms";

type PageProps = {
  params: {
    blogId: string;
  }
}

const Page = async ({ params }: PageProps) => {
  const data = await getBlogById(params.blogId);
  return (
    <>
      <div className="max-w-[1028px] mx-auto bg-white border-2 px-4 py-2">
        <ArticleBody data={data} />
      </div>
    </>
  );
}
export default Page;