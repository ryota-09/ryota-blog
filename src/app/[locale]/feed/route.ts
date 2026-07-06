import { Feed } from "feed";
import { baseURL } from "@/config";
import { getAllBlogListByLocale } from "@/lib/content";
import { resolveCategoryOrDefault } from "@/static/categories";
import { AUTHOR_NAME, AUTHOR_NAME_EN, SITE_DESCRIPTION, SITE_DESCRIPTION_EN, SITE_TITLE } from "@/static/blogs";
import { getTranslations } from 'next-intl/server';
import type { ContentLocale } from "@/types/content";

// export const revalidate = 60 * 60 * 24
export const revalidate = 86400;

// Next.js 16では、Route Handlerのparamsは非同期になった
type RouteContext = {
  params: Promise<{
    locale: string;
  }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  // Next.js 16では、paramsを非同期で取得する必要がある
  const { locale } = await params;
  const buildDate = new Date();
  
  // 翻訳を取得
  const t = await getTranslations({ locale, namespace: 'metadata' });
  
  // ロケールに応じた作者名とサイト情報を取得
  const authorName = locale === 'en' ? AUTHOR_NAME_EN : AUTHOR_NAME;
  const siteTitle = t('siteTitle');
  const siteDescription = t('siteDescription');
  
  const author = {
    name: authorName,
    link: baseURL,
  };

  const feed = new Feed({
    id: baseURL,
    title: siteTitle,
    description: siteDescription,
    link: baseURL,
    language: locale,
    image: `${baseURL}/author.png`,
    copyright: `&copy; ${new Date().getFullYear()} ${authorName}`,
    updated: buildDate,
    feedLinks: {
      rss: `${baseURL}/${locale}/feed`,
    },
    author: author,
  });

  // NOTE: content.tsのgetAllBlogListByLocaleはpublishedAt降順固定のため、
  //       現行実装(orders: "-updatedAt")と同じ並び順にするためここでupdatedAt降順に並べ替える
  const blogList = [...getAllBlogListByLocale(locale as ContentLocale)].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
  for (const blog of blogList) {
    const categoryId = resolveCategoryOrDefault(blog.categories[0]).slug;
    feed.addItem({
      id: blog.slug,
      title: blog.title,
      link: `${baseURL}/${locale}/blogs/${categoryId}/${blog.slug}`,
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