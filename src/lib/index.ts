import type { MicroCMSQueries } from "microcms-js-sdk";

import type { BreadcrumbItemType, TOCAssetsType } from "@/types";
import { CATEGORY_MAPED_ID, CATEGORY_QUERY, KEYWORD_QUERY, PAGE_QUERY, PER_PAGE, CATEGORY_MAPED_NAME } from "@/static/blogs";
import type { MappedKeyLiteralType, BlogsContentType } from "@/types/microcms";

export const generateTOCAssets = (html: string) => {
  // 正規表現を使用して<h2>または<h3>タグのidとテキストを抽出
  const regex = /<(h2|h3) id="([^"]*)">(.*?)<\/\1>/g;

  const results: TOCAssetsType[] = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    const tag = match[1];
    const id = match[2];
    const text = match[3];

    if (tag === "h2") {
      results.push({
        id: id,
        text: text,
        subList: []
      });
    } else if (tag === "h3" && results.length > 0) {
      results[results.length - 1].subList.push({
        id: id,
        text: text
      });
    }
  }

  return results;
}

export const generateQuery = (searchParams: { [PAGE_QUERY]: string, [CATEGORY_QUERY]: MappedKeyLiteralType | string, [KEYWORD_QUERY]: string }) => {
  let filters = "";
  const query: MicroCMSQueries = { limit: PER_PAGE, offset: 0 }

  if (searchParams[PAGE_QUERY]) {
    query.offset = (parseInt(searchParams[PAGE_QUERY]) - 1) * PER_PAGE;
  }

  // filters
  if (searchParams[CATEGORY_QUERY]) {
    const categoryValue = searchParams[CATEGORY_QUERY];
    // If categoryValue is already a category name, use it directly
    // If it's a category ID, convert it to name using CATEGORY_MAPED_NAME
    const categoryId = typeof categoryValue === 'string' && CATEGORY_MAPED_ID[categoryValue as keyof typeof CATEGORY_MAPED_ID] 
      ? CATEGORY_MAPED_ID[categoryValue as keyof typeof CATEGORY_MAPED_ID]
      : categoryValue;
    filters += `${CATEGORY_QUERY}[contains]${categoryId}`;
  }

  if (searchParams[KEYWORD_QUERY]) {
    query.q = searchParams[KEYWORD_QUERY];
  }

  return { ...query, filters };
}

export const getPrimaryCategoryId = (blog: Pick<BlogsContentType, "category">): string => {
  if (blog.category.length === 0) return "programming";
  const categoryName = blog.category[0].name as keyof typeof CATEGORY_MAPED_ID;
  return CATEGORY_MAPED_ID[categoryName] || "programming";
}

export const generateBreadcrumbAssets = (blog: BlogsContentType, locale?: string): BreadcrumbItemType[] => {
  const categoryId = getPrimaryCategoryId(blog);
  const categoryName = CATEGORY_MAPED_NAME[categoryId];
  const localePrefix = locale ? `/${locale}` : '';
  
  const results = [
    {
      label: "Home",
      href: `${localePrefix}/blogs`
    },
    {
      label: categoryName,
      href: `${localePrefix}/blogs/${categoryId}`
    }
  ];

  results.push({
    label: blog.title,
    href: `${localePrefix}/blogs/${categoryId}/${blog.id}`
  });

  return results;
}
export const escapeHtml = (text: string | null) => {

  if (!text) return "";

  return text.replace(/[&<>"']/g, (match) => {
    switch (match) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#039;";
      default: return "";
    }
  });
}

export const pickHostname = (url: string) => {
  const _url = new URL(url);
  return _url.hostname;
}