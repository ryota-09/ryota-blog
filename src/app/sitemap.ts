import { MetadataRoute } from "next";

import { baseURL } from "@/config";
import { getAllBlogList, getAllCategoryList } from "@/lib/microcms";
import { getPrimaryCategoryId } from "@/lib";
import { CATEGORY_MAPED_ID } from "@/static/blogs";

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

  const categoryPaths = Object.values(CATEGORY_MAPED_ID).map((categoryId) => {
    return {
      url: `${baseURL}/blogs/${categoryId}`,
      lastModified: new Date()
    }
  })


  const blogList = (await getAllBlogList({ fields: "id,updatedAt,publishedAt,noIndex,category" })).filter((content) => !content.noIndex)

  const dynamicPaths = blogList.map((content) => {
    const categoryId = getPrimaryCategoryId(content);
    return {
      url: `${baseURL}/blogs/${categoryId}/${content.id}`,
      lastModified: content.publishedAt || content.updatedAt
    }
  })

  return [...staticPaths, ...categoryPaths, ...dynamicPaths]
}