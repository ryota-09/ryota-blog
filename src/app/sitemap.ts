import { MetadataRoute } from "next";

import { baseURL } from "@/config";
import { getAllBlogList, getBlogList } from "@/lib/microcms";
import { getPrimaryCategoryId, generateQuery } from "@/lib";
import { CATEGORY_MAPED_ID, PER_PAGE } from "@/static/blogs";
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
      Object.values(CATEGORY_MAPED_ID).map((categoryId) => {
        return {
          url: `${baseURL}/${locale}/blogs/${categoryId}`,
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
            lastModified: content.publishedAt || content.updatedAt
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
    const categoryPaginationPaths = [];
    for (const locale of SUPPORTED_LOCALES) {
      for (const [categoryName, categoryId] of Object.entries(CATEGORY_MAPED_ID)) {
        try {
          // generateQuery関数と同じアプローチを使用
          const query = generateQuery({ 
            page: "1",
            category: categoryName,
            keyword: ""
          });
          
          const categoryData = await getBlogList(query);
          const categoryTotalPages = Math.ceil(categoryData.totalCount / PER_PAGE);
          
          // ページ2以降を生成（ページ1は /[locale]/blogs/[category] にある）
          for (let i = 2; i <= categoryTotalPages; i++) {
            categoryPaginationPaths.push({
              url: `${baseURL}/${locale}/blogs/${categoryId}/page/${i}`,
              lastModified: new Date()
            });
          }
        } catch (error) {
          console.warn(`カテゴリのサイトマップ生成に失敗しました: ${locale}/${categoryName}`, error);
        }
      }
    }

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