import { MetadataRoute } from "next";

import { baseURL } from "@/config";
import { getAllBlogListByLocale, getBlogList } from "@/lib/content";
import { resolveCategoryOrDefault } from "@/static/categories";
import { PER_PAGE } from "@/static/blogs";
import { CATEGORIES } from "@/static/categories";
import { SUPPORTED_LOCALES } from "@/types/locale";
import type { ContentLocale } from "@/types/content";

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
    // NOTE: ロケールごとにファイルベースの記事一覧を取得する（ja/enで記事のプライマリカテゴリが
    //       異なるケースが存在するため、ロケール非依存の使い回しはせずロケールごとに正しく計算する）
    let dynamicPaths: Array<{ url: string; lastModified: Date | string }> = [];
    try {
      dynamicPaths = SUPPORTED_LOCALES.flatMap((locale) => {
        const blogList = getAllBlogListByLocale(locale as ContentLocale).filter(
          (content) => !content.noIndex,
        );
        return blogList.map((content) => {
          const categoryId = resolveCategoryOrDefault(content.categories[0]).slug;
          return {
            url: `${baseURL}/${locale}/blogs/${categoryId}/${content.slug}`,
            // NOTE: 最終更新日は updatedAt を優先する（無ければ publishedAt）
            lastModified: content.updatedAt || content.publishedAt || new Date()
          }
        });
      })
    } catch (error) {
      console.warn('ブログ記事のサイトマップ生成に失敗しました:', error);
    }

    // 全体のページネーションパスの多言語対応（/[locale]/blogs/page/2, /[locale]/blogs/page/3, ...）
    // NOTE: 総件数はロケールごとに正しく計算する（ja/enで記事数が異なる可能性があるため）
    let paginationPaths: Array<{ url: string; lastModified: Date }> = [];
    try {
      paginationPaths = SUPPORTED_LOCALES.flatMap((locale) => {
        const totalBlogData = getBlogList(locale as ContentLocale, { limit: 1 });
        const totalPages = Math.ceil(totalBlogData.totalCount / PER_PAGE);

        return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) => ({
          url: `${baseURL}/${locale}/blogs/page/${i + 2}`,
          lastModified: new Date()
        }));
      });
    } catch (error) {
      console.warn('ページネーションのサイトマップ生成に失敗しました:', error);
    }

    // カテゴリ別ページネーションパスの多言語対応（/[locale]/blogs/next_js/page/2, ...）
    // NOTE: カテゴリごとの件数もロケールごとに正しく計算する
    const categoryPaginationPaths = SUPPORTED_LOCALES.flatMap((locale) =>
      CATEGORIES.flatMap((category) => {
        try {
          const categoryData = getBlogList(locale as ContentLocale, { category: category.id, limit: PER_PAGE });
          const totalPages = Math.ceil(categoryData.totalCount / PER_PAGE);
          // ページ2以降を生成（ページ1は /[locale]/blogs/[category] にある）
          return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) => ({
            url: `${baseURL}/${locale}/blogs/${category.slug}/page/${i + 2}`,
            lastModified: new Date()
          }));
        } catch (error) {
          console.warn(`カテゴリのサイトマップ生成に失敗しました: ${category.name}`, error);
          return [];
        }
      })
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
