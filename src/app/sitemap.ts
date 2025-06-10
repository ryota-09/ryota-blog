import { MetadataRoute } from "next";

import { baseURL } from "@/config";
import { getAllBlogList, getBlogList } from "@/lib/microcms";
import { getPrimaryCategoryId, generateQuery } from "@/lib";
import { CATEGORY_MAPED_ID, PER_PAGE } from "@/static/blogs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 静的パス（ホーム、アバウトページ）
  const staticPaths = [
    {
      url: `${baseURL}/blogs`,
      lastModified: new Date()
    },
    {
      url: `${baseURL}/about`,
      lastModified: new Date()
    }
  ]

  // カテゴリページのパス
  const categoryPaths = Object.values(CATEGORY_MAPED_ID).map((categoryId) => {
    return {
      url: `${baseURL}/blogs/${categoryId}`,
      lastModified: new Date()
    }
  })

  // ブログ記事の動的パス
  const blogList = (await getAllBlogList({ fields: "id,updatedAt,publishedAt,noIndex,category" })).filter((content) => !content.noIndex)

  const dynamicPaths = blogList.map((content) => {
    const categoryId = getPrimaryCategoryId(content);
    return {
      url: `${baseURL}/blogs/${categoryId}/${content.id}`,
      lastModified: content.publishedAt || content.updatedAt
    }
  })

  // 全体のページネーションパス（/blogs/page/2, /blogs/page/3, ...）
  const totalBlogData = await getBlogList({ limit: 1 });
  const totalPages = Math.ceil(totalBlogData.totalCount / PER_PAGE);
  
  const paginationPaths = Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) => ({
    url: `${baseURL}/blogs/page/${i + 2}`,
    lastModified: new Date()
  }));

  // カテゴリ別ページネーションパス（/blogs/next_js/page/2, ...）
  const categoryPaginationPaths = [];
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
      
      // ページ2以降を生成（ページ1は /blogs/[category] にある）
      for (let i = 2; i <= categoryTotalPages; i++) {
        categoryPaginationPaths.push({
          url: `${baseURL}/blogs/${categoryId}/page/${i}`,
          lastModified: new Date()
        });
      }
    } catch (error) {
      console.warn(`カテゴリのサイトマップ生成に失敗しました: ${categoryName}`, error);
    }
  }

  return [...staticPaths, ...categoryPaths, ...dynamicPaths, ...paginationPaths, ...categoryPaginationPaths]
}