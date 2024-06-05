import { MetadataRoute } from "next";

import { baseURL } from "@/config";
import { getAllBlogList, getAllCategoryList } from "@/lib/microcms";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const allCategories = await getAllCategoryList({ fields: "name" })

  const categoryPaths = allCategories.map((category) => {
    return {
      url: `${baseURL}/blogs?category=${category.name}`,
      lastModified: new Date()
    }
  })


  const blogList = (await getAllBlogList({ fields: "id,updatedAt,publishedAt,noIndex" })).filter((content) => !content.noIndex)

  const dynamicPaths = blogList.map((content) => {
    return {
      url: `${baseURL}/blogs/${content.id}`,
      lastModified: content.publishedAt || content.updatedAt
    }
  })

  return [...staticPaths, ...categoryPaths, ...dynamicPaths]
}