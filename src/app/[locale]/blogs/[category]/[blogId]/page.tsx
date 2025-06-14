import type { Metadata } from "next";
import { cookies, draftMode } from "next/headers";
import { notFound } from "next/navigation";

import ArticleBody from "@/components/ArticleBody";
import BreadcrumbList from "@/components/BreadcrumbList";
import { generateBreadcrumbAssets, getPrimaryCategoryId } from "@/lib";
import { getBlogById, getAllBlogList } from "@/lib/microcms";
import type { BlogsContentType } from "@/types/microcms";
import JsonLD from "@/components/Head/JsonLD";
import RelatedContentList from "@/components/RelatedContentList";
import { locales } from '@/i18n/config';

export async function generateStaticParams() {
  const blogList = await getAllBlogList({ fields: "id,category" });
  
  const params = [];
  for (const locale of locales) {
    for (const blog of blogList) {
      const categoryId = getPrimaryCategoryId(blog);
      params.push({
        locale,
        category: categoryId,
        blogId: blog.id
      });
    }
  }
  
  return params;
}

export async function generateMetadata(
  { params }: { params: { locale: string; category: string; blogId: string } },
): Promise<Metadata> {
  const blogId = params.blogId;
  const data = await getBlogById(blogId, { fields: "title,description,noIndex" });

  return {
    title: data.title,
    description: data.description,
    robots: data.noIndex ? "noindex" : null,
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          `/${locale}/blogs/${params.category}/${params.blogId}`
        ])
      )
    }
  };
}

type PageProps = {
  params: {
    locale: string;
    category: string;
    blogId: string;
  };
};

const Page = async ({ params }: PageProps) => {
  const blogId = params.blogId;
  const categoryParam = params.category;
  const { isEnabled } = draftMode();
  const currentCookies = cookies();
  const draftKey = currentCookies.get('draftKey')?.value;

  let data: BlogsContentType;
  try {
    if (isEnabled && draftKey) {
      data = await getBlogById(blogId, { draftKey: draftKey });
    } else {
      data = await getBlogById(blogId);
    }
  } catch (error) {
    notFound();
  }

  // URLのカテゴリパラメータが実際のブログのプライマリカテゴリと一致するかチェック
  const actualCategoryId = getPrimaryCategoryId(data);
  if (actualCategoryId !== categoryParam) {
    notFound();
  }

  const breadcrumbAssets = generateBreadcrumbAssets(data, params.locale);
  return (
    <div className="max-w-[1028px] mx-auto px-2 md:px-0">
      <BreadcrumbList items={breadcrumbAssets} />
      <article className=" bg-white dark:bg-black border-2 dark:border-gray-600 px-4">
        <ArticleBody data={data} />
      </article>
      {data.relatedContent.length >= 1 && (
        <aside className="my-8">
          <RelatedContentList data={data.relatedContent} />
        </aside>
      )}
      <JsonLD data={data} />
    </div>
  );
};

export default Page;