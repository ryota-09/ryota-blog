import { Feed } from "feed";
import { baseURL } from "@/config";
import { getAllBlogListByLocale } from "@/lib/microcms";
import { AUTHOR_NAME, AUTHOR_NAME_EN, SITE_DESCRIPTION, SITE_DESCRIPTION_EN, SITE_TITLE } from "@/static/blogs";
import { getPrimaryCategoryId } from "@/lib";
import { getTranslations } from 'next-intl/server';

// export const revalidate = 60 * 60 * 24
export const revalidate = 86400;

interface RouteContext {
  params: {
    locale: string;
  };
}

export async function GET(request: Request, { params }: RouteContext) {
  const { locale } = params;
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

  const blogList = await getAllBlogListByLocale(locale, {
    fields: "id,title,description,publishedAt,updatedAt,thumbnail,category",
    orders: "-updatedAt",
  });
  for (const blog of blogList) {
    const categoryId = getPrimaryCategoryId(blog);
    feed.addItem({
      id: blog.id,
      title: blog.title,
      link: `${baseURL}/${locale}/blogs/${categoryId}/${blog.id}`,
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