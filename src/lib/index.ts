import type { MicroCMSQueries } from "microcms-js-sdk";
import type { ImageLoader } from "next/image";

import type { BreadcrumbItemType, TOCAssetsType } from "@/types";
import { CATEGORY_MAPED_ID, CATEGORY_QUERY, KEYWORD_QUERY, PAGE_QUERY, PER_PAGE } from "@/static/blogs";
import type { MappedKeyLiteralType } from "@/types/microcms";

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

export const generateQuery = (searchParams: { [PAGE_QUERY]: string, [CATEGORY_QUERY]: MappedKeyLiteralType, [KEYWORD_QUERY]: string }) => {
  let filters = "";
  const query: MicroCMSQueries = { limit: PER_PAGE, offset: 0 }

  if (searchParams[PAGE_QUERY]) {
    query.offset = (parseInt(searchParams[PAGE_QUERY]) - 1) * PER_PAGE;
  }

  // filters
  if (searchParams[CATEGORY_QUERY]) {
    filters += `${CATEGORY_QUERY}[contains]${CATEGORY_MAPED_ID[searchParams[CATEGORY_QUERY]]}`;
  }

  if (searchParams[KEYWORD_QUERY]) {
    query.q = searchParams[KEYWORD_QUERY];
  }

  return { ...query, filters };
}

// NOTE: エッジ経由だと画像が表示されないため、画像のURLを変換する
export const microCMSLoader: ImageLoader = ({ src, width }) => {
  return `${src}?auto=format&fit=max&w=${width}`
}

export const generateBreadcrumbAssets = (blogId: string, title: string): BreadcrumbItemType[] => {
  const homePath = "/blogs"
  const results = [
    {
      label: "Home",
      href: homePath
    }
  ];

  results.push({
    label: title,
    href: `${homePath}/${blogId}`
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