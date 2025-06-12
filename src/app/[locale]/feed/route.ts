import { Feed } from "feed";
import { baseURL } from "@/config";
import { getAllBlogList } from "@/lib/microcms";
import { AUTHOR_NAME, SITE_DESCRIPTION, SITE_TITLE } from "@/static/blogs";
import { getPrimaryCategoryId } from "@/lib";

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
  const author = {
    name: AUTHOR_NAME,
    link: baseURL,
  };

  const feed = new Feed({
    id: baseURL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    link: baseURL,
    language: locale,
    image: `${baseURL}/author.png`,
    copyright: `&copy; ${new Date().getFullYear()} ${AUTHOR_NAME}`,
    updated: buildDate,
    feedLinks: {
      rss: `${baseURL}/${locale}/feed`,
    },
    author: author,
  });

  const blogList = await getAllBlogList({
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