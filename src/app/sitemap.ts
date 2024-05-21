import { MetadataRoute } from "next";

import { baseURL } from "@/config";
import { getAllBlogList } from "@/lib/microcms";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = {
    url: `${baseURL}/blogs`,
    lastModified: new Date()
  }

  const blogList = await getAllBlogList({ fields: "id,updatedAt" });

  const dynamicPaths = blogList.map((content) => ({
    url: `${baseURL}/blogs/${content.id}`,
    lastModified: content.updatedAt
  }))

  return [staticPaths, ...dynamicPaths]
}