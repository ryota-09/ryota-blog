import type { BreadcrumbList, BlogPosting, WithContext, WebSite } from "schema-dts"
import type { BlogPost } from "@/types/content"
import { SITE_TITLE } from "@/static/blogs"
import { findCategoryBySlug } from "@/static/categories"
import { buildPageUrl } from "@/lib"
import { getPrimaryCategoryIdFromBlogPost } from "@/lib/content"
import { getLocalizedCategoryName } from "@/lib/i18n-utils"
import { baseURL } from "@/config"


type JsonLDProps = {
  data: BlogPost
  locale: string
}

const JsonLD = ({ data, locale }: JsonLDProps) => {
  const categoryId = getPrimaryCategoryIdFromBlogPost(data);
  const categoryEntry = findCategoryBySlug(categoryId);
  const categoryName = categoryEntry ? getLocalizedCategoryName(categoryEntry, locale) : categoryId;
  // 構造化データのURLは実ルーティング（/[locale]/blogs/...）に合わせて locale 込みで構築する
  const articleUrl = buildPageUrl(locale, "blogs", categoryId, data.slug);
  const authorUrl = buildPageUrl(locale, "about");

  const breadcrumbJsonLD: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: buildPageUrl(locale, "blogs")
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName,
        item: buildPageUrl(locale, "blogs", categoryId)
      },
      {
        "@type": "ListItem",
        position: 3,
        name: data.title,
        item: articleUrl
      }
    ]
  }

  const blogPostingJsonLD: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl
    },
    headline: data.title,
    datePublished: data.publishedAt || data.updatedAt,
    dateModified: data.updatedAt,
    keywords: [
      ...data.categories.map((slug) => {
        const entry = findCategoryBySlug(slug);
        return entry ? getLocalizedCategoryName(entry, locale) : slug;
      }),
      data.title,
    ].join(","),
    description: data.description,
    // thumbnail.srcはVeliteが生成する `/static/...` のサイト内相対パスのため、絶対URL化して埋め込む
    image: data.thumbnail ? `${baseURL}${data.thumbnail.src}` : undefined,
    author: {
      "@type": "Person",
      name: "Ryota",
      jobTitle: "Software Engineer",
      url: authorUrl
    },
  }

  const siteNameJsonLD: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_TITLE,
    url: buildPageUrl(locale),
    publisher: {
      "@type": "Person",
      name: "Ryota",
      jobTitle: "Software Engineer",
      url: authorUrl
    },
  }

  // NOTE: クローラーが確実に読めるよう初期HTMLに直接埋め込む（next/scriptのafterInteractiveだとJS実行後注入になる）
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify([blogPostingJsonLD, { ...breadcrumbJsonLD }, siteNameJsonLD]) }}
    />
  )
}
export default JsonLD
