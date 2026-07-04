import { MetadataRoute } from "next";

import { baseURL } from "@/config";
import { getAllBlogList, getBlogList } from "@/lib/microcms";
import { getPrimaryCategoryId, generateQuery } from "@/lib";
import { PER_PAGE } from "@/static/blogs";
import { CATEGORIES } from "@/static/categories";
import { SUPPORTED_LOCALES } from "@/types/locale";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // 静的パス（ホーム、アバウトページ）の多言語対応
    const staticPaths = SUPPORTED_LOCALES.flatMap(locale => [
      {
        url: `${baseURL}/${locale}/blogs`,
        lastModified: new Date()
      },
      {
        url: `${baseURL}/${locale}/about`,
        lastModified: new Date()
      }
    ])

    // カテゴリページのパスの多言語対応
    const categoryPaths = SUPPORTED_LOCALES.flatMap(locale =>
      CATEGORIES.map((category) => {
        return {
          url: `${baseURL}/${locale}/blogs/${category.slug}`,
          lastModified: new Date()
        }
      })
    )

    // ブログ記事の動的パスの多言語対応
    let dynamicPaths: Array<{ url: string; lastModified: Date | string }> = [];
    try {
      const blogList = (await getAllBlogList({ fields: "id,updatedAt,publishedAt,noIndex,category" })).filter((content) => !content.noIndex)

      dynamicPaths = SUPPORTED_LOCALES.flatMap(locale => 
        blogList.map((content) => {
          const categoryId = getPrimaryCategoryId(content);
          return {
            url: `${baseURL}/${locale}/blogs/${categoryId}/${content.id}`,
            // NOTE: 最終更新日は updatedAt を優先する（無ければ publishedAt）
            lastModified: content.updatedAt || content.publishedAt || new Date()
          }
        })
      )
    } catch (error) {
      console.warn('ブログ記事のサイトマップ生成に失敗しました:', error);
    }

    // 全体のページネーションパスの多言語対応（/[locale]/blogs/page/2, /[locale]/blogs/page/3, ...）
    let paginationPaths: Array<{ url: string; lastModified: Date }> = [];
    try {
      const totalBlogData = await getBlogList({ limit: 1 });
      const totalPages = Math.ceil(totalBlogData.totalCount / PER_PAGE);
      
      paginationPaths = SUPPORTED_LOCALES.flatMap(locale => 
        Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) => ({
          url: `${baseURL}/${locale}/blogs/page/${i + 2}`,
          lastModified: new Date()
        }))
      );
    } catch (error) {
      console.warn('ページネーションのサイトマップ生成に失敗しました:', error);
    }

    // カテゴリ別ページネーションパスの多言語対応（/[locale]/blogs/next_js/page/2, ...）
    // NOTE: カテゴリごとの件数取得はロケール非依存（blogsエンドポイント）なので、
    //       カテゴリ単位で1回だけ並列フェッチし、両ロケールのURL生成に使い回す
    const categoryTotals = await Promise.all(
      CATEGORIES.map(async (category) => {
        try {
          const query = generateQuery({ page: "1", category: category.id, keyword: "" });
          const categoryData = await getBlogList({ ...query, fields: "id" });
          return { categorySlug: category.slug, totalPages: Math.ceil(categoryData.totalCount / PER_PAGE) };
        } catch (error) {
          console.warn(`カテゴリのサイトマップ生成に失敗しました: ${category.name}`, error);
          return { categorySlug: category.slug, totalPages: 0 };
        }
      })
    );

    const categoryPaginationPaths = SUPPORTED_LOCALES.flatMap((locale) =>
      categoryTotals.flatMap(({ categorySlug, totalPages }) =>
        // ページ2以降を生成（ページ1は /[locale]/blogs/[category] にある）
        Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) => ({
          url: `${baseURL}/${locale}/blogs/${categorySlug}/page/${i + 2}`,
          lastModified: new Date()
        }))
      )
    );

    return [...staticPaths, ...categoryPaths, ...dynamicPaths, ...paginationPaths, ...categoryPaginationPaths]
  } catch (error) {
    console.error('サイトマップ生成中にエラーが発生しました:', error);
    // 最低限の静的パスのみ返す
    return SUPPORTED_LOCALES.flatMap(locale => [
      {
        url: `${baseURL}/${locale}/blogs`,
        lastModified: new Date()
      },
      {
        url: `${baseURL}/${locale}/about`,
        lastModified: new Date()
      }
    ])
  }
}