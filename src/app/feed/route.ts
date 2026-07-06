import { Feed } from "feed";
import { baseURL } from "@/config";
import { getAllBlogListByLocale } from "@/lib/content";
import { resolveCategoryOrDefault } from "@/static/categories";
import { AUTHOR_NAME, SITE_DESCRIPTION, SITE_TITLE } from "@/static/blogs";

// export const revalidate = 60 * 60 * 24
export const revalidate = 86400;

// NOTE: このルート（ロケールなし固定URL）は既存購読者との互換性を優先し、
//       [locale]/feed への統合リダイレクトはあえて行わない。
//       データソースのみ content.ts (ファイルベース) に差し替える。
export async function GET() {
  const buildDate = new Date();
  const author = {
    name: AUTHOR_NAME,
    link: baseURL,
  };

  const feed = new Feed({
    id: baseURL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    link: baseURL,
    language: "ja",
    image: `${baseURL}/author.png`,
    copyright: `&copy; ${new Date().getFullYear()} ${AUTHOR_NAME}`,
    updated: buildDate,
    feedLinks: {
      rss: `${baseURL}/feed`,
    },
    author: author,
  });

  // NOTE: 現行実装(orders: "-updatedAt")と同じ並び順にするためupdatedAt降順に並べ替える
  //       (content.tsのgetAllBlogListByLocaleはpublishedAt降順固定のため)
  const blogList = [...getAllBlogListByLocale("ja")].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
  for (const blog of blogList) {
    const categoryId = resolveCategoryOrDefault(blog.categories[0]).slug;
    feed.addItem({
      id: blog.slug,
      title: blog.title,
      // 実ルーティング（/[locale]/blogs/...）に合わせ、既定ロケール ja 込みのURLにする
      link: `${baseURL}/ja/blogs/${categoryId}/${blog.slug}`,
      description: blog.description,
      date: new Date(blog.publishedAt || blog.updatedAt),
    });
  }
  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
