import type { BlogPost, BlogPostSummary } from "@/types/content";
import { resolveCategoryOrDefault } from "@/static/categories";

// クライアントコンポーネントからも安全にimportできる、記事データの純粋ヘルパー。
// NOTE: src/lib/content.ts は `#content/index`(Velite生成の全記事JSON・生2.4MB)を
// モジュールトップでimportしているため、クライアントコンポーネントから
// content.ts をimportすると全記事データがクライアントバンドルに混入する
// (実測で転送366KB/ページのチャンクが生成されていた)。
// クライアントから必要になるヘルパーは必ずこのファイルに置くこと。

/**
 * BlogPostのプライマリカテゴリ(先頭カテゴリ)のslugを返す。
 * BlogPost.categoriesは文字列配列(slug)なので、先頭要素をそのまま
 * resolveCategoryOrDefaultに渡すだけでよい。
 */
export const getPrimaryCategoryIdFromBlogPost = (blog: Pick<BlogPost, "categories">): string => {
  return resolveCategoryOrDefault(blog.categories[0]).slug;
};

/**
 * クライアントコンポーネントへ渡す前にBlogPostを軽量サマリに絞る。
 * 型がPickでも実体がフルオブジェクトのままだとRSCペイロードに
 * body/raw等の全文がシリアライズされるため、実体レベルで絞ることが重要
 * (一覧ページのHTMLが生349KB→大幅削減された実測あり)。
 */
export const toBlogPostSummary = (blog: BlogPost): BlogPostSummary => ({
  slug: blog.slug,
  title: blog.title,
  description: blog.description,
  thumbnail: blog.thumbnail,
  categories: blog.categories,
  publishedAt: blog.publishedAt,
  updatedAt: blog.updatedAt,
});
