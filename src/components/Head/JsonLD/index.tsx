import type { BreadcrumbList, BlogPosting, WithContext, WebSite } from "schema-dts"
import type { BlogsContentType } from "@/types/microcms"
import { baseURL } from "@/config"
import { SITE_TITLE } from "@/static/blogs"
import Script from "next/script"


type JsonLDProps = {
  data: BlogsContentType
}

const JsonLD = ({ data }: JsonLDProps) => {
  const breadcrumbJsonLD: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${baseURL}/blogs`
      },
      {
        "@type": "ListItem",
        position: 2,
        name: data.title,
        item: `${baseURL}/blogs/${data.id}`
      }
    ]
  }

  const blogPostingJsonLD: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseURL}/blogs/${data.id}`
    },
    headline: data.title,
    datePublished: data.publishedAt || data.updatedAt,
    dateModified: data.updatedAt,
    keywords: [...data.category.map(({ name }) => name), data.title].join(","),
    description: data.description,
    image: data.thumbnail?.url,
    author: {
      "@type": "Person",
      name: "Ryota",
      jobTitle: "Software Engineer",
      url: `${baseURL}/about`
    },
  }

  const siteNameJsonLD: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_TITLE,
    url: baseURL,
    publisher: {
      "@type": "Person",
      name: "Ryota",
      jobTitle: "Software Engineer",
      url: `${baseURL}/about`
    },
  }

  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify([blogPostingJsonLD, { ...breadcrumbJsonLD }, siteNameJsonLD]) }}
    />
  )
}
export default JsonLD