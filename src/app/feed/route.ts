import { Feed } from "feed";
import { baseURL } from "@/config";
import { getAllBlogList } from "@/lib/microcms";
import { AUTHOR_NAME, SITE_DESCRIPTION, SITE_TITLE } from "@/static/blogs";

// export const revalidate = 60 * 60 * 24
export const revalidate = 86400;

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

  const blogList = await getAllBlogList({
    fields: "id,title,description,publishedAt,updatedAt,thumbnail",
    orders: "-updatedAt",
  });
  for (const blog of blogList) {
    feed.addItem({
      id: blog.id,
      title: blog.title,
      link: `${baseURL}/blogs/${blog.id}`,
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
