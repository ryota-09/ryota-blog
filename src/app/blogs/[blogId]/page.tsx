import ArticleBody from "@/components/ArticleBody";
import BreadcrumbList from "@/components/BreadcrumbList";
import { generateBreadcrumbAssets } from "@/lib";
import { getBlogById, getBlogList } from "@/lib/microcms";
import { Metadata } from "next";
import { cookies, draftMode } from "next/headers";

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
    robots: data.noIndex ? "noindex" : null
  }
}

type PageProps = {
  params: {
    blogId: string;
  }
}

const Page = async ({ params }: PageProps) => {
  const blogId = params.blogId
  const { isEnabled } = draftMode()
  const currentCookies = cookies()
  const draftKey = currentCookies.get('draftKey')?.value

  let data;
  if (isEnabled && draftKey) {
    data = await getBlogById(blogId, { draftKey: draftKey });
  } else {
    data = await getBlogById(blogId);
  }

  const breadcrumbAssets = generateBreadcrumbAssets(blogId, data.title)
  return (
    <div className="max-w-[1028px] mx-auto px-2 md:px-0">
      <BreadcrumbList items={breadcrumbAssets} />
      <article className=" bg-white border-2 px-4">
        <ArticleBody data={data} />
      </article>
    </div>
  );
}
export default Page;