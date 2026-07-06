import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ArticleBody from "@/components/ArticleBody";
import BreadcrumbList from "@/components/BreadcrumbList";
import { buildPageUrl, buildLanguageAlternates } from "@/lib";
import {
  getBlogBySlugByLocaleCached,
  getAllBlogListByLocale,
  getPrimaryCategoryIdFromBlogPost,
  resolveRelatedBlogs,
  generateBreadcrumbAssetsFromBlogPost,
} from "@/lib/content";
import type { ContentLocale } from "@/types/content";
import JsonLD from "@/components/Head/JsonLD";
import RelatedContentList from "@/components/RelatedContentList";
import { locales } from '@/i18n/config';

// コンテンツはリポジトリ内(content/)で管理されビルド時に確定するため、ISRは不要(更新=再デプロイ)。
// また、MDX本文のレンダリング(MdxContent)は new Function 評価を伴い、Cloudflare Workersランタイムでは
// 動的コード生成が禁止されているため、再検証時のWorker内レンダリングを発生させないよう完全静的にする。
export const revalidate = false;

// Next.js 16では静的な値のみ許可されるため、force-staticに統一
export const dynamic = 'force-static';

export async function generateStaticParams() {
  const params = [];

  for (const locale of locales) {
    const blogList = getAllBlogListByLocale(locale);
    for (const blog of blogList) {
      const categoryId = getPrimaryCategoryIdFromBlogPost(blog);
      params.push({
        locale,
        category: categoryId,
        blogId: blog.slug
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
  // NOTE: ページ本体と同じ cached フェッチを使い、同一リクエスト内の二重フェッチを避ける。
  // 存在しないslugでは例外が投げられるが、generateMetadataはページ本体より先に評価されるため、
  // ここで捕捉してnotFound()しないと404ではなく500になってしまう(本番検証で発見)
  let data;
  try {
    data = getBlogBySlugByLocaleCached(locale as ContentLocale, blogId);
  } catch {
    notFound();
  }

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
  const contentLocale = locale as ContentLocale;

  let data;
  try {
    // generateMetadata と同じ cached フェッチで重複排除する
    data = getBlogBySlugByLocaleCached(contentLocale, blogId);
  } catch {
    notFound();
  }

  // URLのカテゴリパラメータが実際のブログのプライマリカテゴリと一致するかチェック
  const actualCategoryId = getPrimaryCategoryIdFromBlogPost(data);
  if (actualCategoryId !== categoryParam) {
    notFound();
  }

  const breadcrumbAssets = await generateBreadcrumbAssetsFromBlogPost(data, contentLocale);
  const relatedBlogs = resolveRelatedBlogs(contentLocale, data.related);

  return (
    // NOTE: 祖先の<main>がflexコンテナのため、min-w-0を明示しないとこのdivがflexアイテムの
    // デフォルト(min-width:auto)により内部コンテンツ(長いコードブロック等)の幅に押し広げられ、
    // ページ全体に横スクロールが生じることがある(#242パリティ検証で発見)。
    <div className="max-w-[1028px] mx-auto px-2 md:px-0 min-w-0">
      <BreadcrumbList items={breadcrumbAssets} />
      <article className="w-full min-w-0 bg-white dark:bg-black border-2 dark:border-gray-600 px-4">
        <ArticleBody data={data} locale={contentLocale} />
      </article>
      {relatedBlogs.length >= 1 && (
        <aside className="my-8">
          <RelatedContentList data={relatedBlogs} />
        </aside>
      )}
      <JsonLD data={data} locale={locale} />
    </div>
  );
};

export default Page;
