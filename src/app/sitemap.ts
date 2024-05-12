import { MetadataRoute } from "next";

import { baseURL } from "@/config";
import { getBlogList } from "@/lib/microcms";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = {
    url: baseURL,
    lastModified: new Date()
  }

  const data = await getBlogList({ fields: "id,updatedAt" });

  const dynamicPaths = data.contents.map((content) => ({
    url: `${baseURL}/blogs/${content.id}`,
    lastModified: content.updatedAt
  }))

  return [staticPaths, ...dynamicPaths]
}