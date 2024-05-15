import ArticleBody from "@/components/ArticleBody";
import { baseURL } from "@/config";
import { getBlogById, getBlogList } from "@/lib/microcms";
import { Metadata } from "next";

export async function generateStaticParams() {
  const blogList = await getBlogList({ fields: "id" });
  return blogList.contents.map((content) => ({
    blogId: content.id
  }))
}

export async function generateMetadata(
  { params }: { params: { blogId: string } },
): Promise<Metadata> {
  const blogId = params.blogId
  const data = await getBlogById(blogId, { fields: "title,description,noIndex" })

  return {
    title: data.title,
    description: data.description,
    robots: data.noIndex ? "noindex" : null,
    metadataBase: new URL(baseURL),
    openGraph: {
      type: "article",
      images: [{ url: `/blogs/${blogId}/opengraph-image.png` }],
      title: data.title,
      description: data.description
    }
  }
}

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