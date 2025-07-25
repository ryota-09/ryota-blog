import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ArticleBody from "@/components/ArticleBody";
import BreadcrumbList from "@/components/BreadcrumbList";
import { generateBreadcrumbAssets, getPrimaryCategoryId } from "@/lib";
import { getBlogByIdByLocale, getAllBlogListByLocale } from "@/lib/microcms";
import type { BlogsContentType } from "@/types/microcms";
import JsonLD from "@/components/Head/JsonLD";
import RelatedContentList from "@/components/RelatedContentList";
import { locales } from '@/i18n/config';

// キャッシュ設定: 24時間のISR（Incremental Static Regeneration）
export const revalidate = 86400; // 24時間

// 本番環境では静的生成を強制
export const dynamic = process.env.NODE_ENV === 'production' ? 'force-static' : 'auto';

export async function generateStaticParams() {
  const params = [];
  
  for (const locale of locales) {
    const blogList = await getAllBlogListByLocale(locale, { fields: "id,category" });
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
  const data = await getBlogByIdByLocale(params.locale, blogId, { fields: "title,description,noIndex" });

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
  
  let data: BlogsContentType;
  let isEnabled = false;
  let draftKey: string | undefined;

  // 開発環境でのみドラフトモードを有効化
  if (process.env.NODE_ENV === 'development') {
    const { draftMode, cookies } = await import('next/headers');
    const draftModeResult = draftMode();
    isEnabled = draftModeResult.isEnabled;
    
    if (isEnabled) {
      const currentCookies = cookies();
      draftKey = currentCookies.get('draftKey')?.value;
    }
  }

  try {
    if (isEnabled && draftKey) {
      data = await getBlogByIdByLocale(params.locale, blogId, { draftKey: draftKey });
    } else {
      data = await getBlogByIdByLocale(params.locale, blogId);
    }
  } catch (error) {
    notFound();
  }

  // URLのカテゴリパラメータが実際のブログのプライマリカテゴリと一致するかチェック
  const actualCategoryId = getPrimaryCategoryId(data);
  if (actualCategoryId !== categoryParam) {
    notFound();
  }

  const breadcrumbAssets = await generateBreadcrumbAssets(data, params.locale);
  return (
    <div className="max-w-[1028px] mx-auto px-2 md:px-0">
      <BreadcrumbList items={breadcrumbAssets} />
      <article className=" bg-white dark:bg-black border-2 dark:border-gray-600 px-4">
        <ArticleBody data={data} locale={params.locale} />
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