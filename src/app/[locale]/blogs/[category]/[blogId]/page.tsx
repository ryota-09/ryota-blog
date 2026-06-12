import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ArticleBody from "@/components/ArticleBody";
import BreadcrumbList from "@/components/BreadcrumbList";
import { generateBreadcrumbAssets, getPrimaryCategoryId, buildPageUrl, buildLanguageAlternates } from "@/lib";
import { getBlogByIdByLocale, getBlogByIdByLocaleCached, getAllBlogListByLocale } from "@/lib/microcms";
import type { BlogsContentType } from "@/types/microcms";
import JsonLD from "@/components/Head/JsonLD";
import RelatedContentList from "@/components/RelatedContentList";
import { locales } from '@/i18n/config';

// キャッシュ設定: 24時間のISR（Incremental Static Regeneration）
export const revalidate = 86400; // 24時間

// Next.js 16では静的な値のみ許可されるため、force-staticに統一
// 開発環境でもISRで動作する
export const dynamic = 'force-static';

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
  { params }: { params: Promise<{ locale: string; category: string; blogId: string }> },
): Promise<Metadata> {
  // Next.js 16では、paramsを非同期で取得する必要がある
  const { blogId, locale, category } = await params;
  // NOTE: ページ本体と同じ cached フェッチを使い、同一リクエスト内の二重フェッチを避ける
  const data = await getBlogByIdByLocaleCached(locale, blogId);

  // 記事自身の絶対URL（og:url / canonical に使用）
  const blogUrl = buildPageUrl(locale, "blogs", category, blogId);

  return {
    title: data.title,
    description: data.description,
    robots: data.noIndex ? "noindex" : null,
    alternates: {
      canonical: blogUrl,
      languages: buildLanguageAlternates("blogs", category, blogId)
    },
    // openGraph は子で定義すると親（ルートレイアウト）の値が置換されるため siteName/type も明示する。
    // 画像は同セグメントの opengraph-image.tsx / twitter-image.tsx が自動付与するため images は指定しない
    openGraph: {
      url: blogUrl,
      title: data.title,
      description: data.description,
      siteName: "Ryota-Blog",
      type: "article"
    },
    twitter: {
      card: "summary_large_image"
    }
  };
}

type PageProps = {
  params: Promise<{
    locale: string;
    category: string;
    blogId: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  // Next.js 16では、paramsを非同期で取得する必要がある
  const { blogId, category: categoryParam, locale } = await params;
  
  let data: BlogsContentType;
  let isEnabled = false;
  let draftKey: string | undefined;

  // 開発環境でのみドラフトモードを有効化
  if (process.env.NODE_ENV === 'development') {
    const { draftMode, cookies } = await import('next/headers');
    // Next.js 16では、draftMode()とcookies()も非同期になった
    const draftModeResult = await draftMode();
    isEnabled = draftModeResult.isEnabled;

    if (isEnabled) {
      const currentCookies = await cookies();
      draftKey = currentCookies.get('draftKey')?.value;
    }
  }

  try {
    if (isEnabled && draftKey) {
      data = await getBlogByIdByLocale(locale, blogId, { draftKey: draftKey });
    } else {
      // generateMetadata と同じ cached フェッチで重複排除する
      data = await getBlogByIdByLocaleCached(locale, blogId);
    }
  } catch (error) {
    notFound();
  }

  // URLのカテゴリパラメータが実際のブログのプライマリカテゴリと一致するかチェック
  const actualCategoryId = getPrimaryCategoryId(data);
  if (actualCategoryId !== categoryParam) {
    notFound();
  }

  const breadcrumbAssets = await generateBreadcrumbAssets(data, locale);
  return (
    <div className="max-w-[1028px] mx-auto px-2 md:px-0">
      <BreadcrumbList items={breadcrumbAssets} />
      <article className=" bg-white dark:bg-black border-2 dark:border-gray-600 px-4">
        <ArticleBody data={data} locale={locale} />
      </article>
      {data.relatedContent.length >= 1 && (
        <aside className="my-8">
          <RelatedContentList data={data.relatedContent} />
        </aside>
      )}
      <JsonLD data={data} locale={locale} />
    </div>
  );
};

export default Page;