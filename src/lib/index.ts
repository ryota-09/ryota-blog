import { getTranslations } from 'next-intl/server';

import type { BreadcrumbItemType, TOCAssetsType } from "@/types";
import { CATEGORY_QUERY, KEYWORD_QUERY, PAGE_QUERY, PER_PAGE } from "@/static/blogs";
import { resolveCategoryEntry, resolveCategoryOrDefault } from "@/static/categories";
import { getLocalizedCategoryName } from "@/lib/i18n-utils";
import type { BlogsContentType } from "@/types/microcms";
import type { BlogListQuery } from "@/types/content";
import { baseURL } from "@/config";
import { locales } from "@/i18n/config";

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

// searchParams(?page=&category=&keyword=)を lib/content.ts の getBlogList が受け取る
// BlogListQuery({offset,limit,category,keyword})に変換する。
// 旧実装はmicroCMSのクエリ文字列(filters/q)を組み立てていたが、#238でデータ層をVeliteベースの
// lib/content.tsに切り替えたことに伴い、クエリ文字列ではなく構造化引数を返す形に書き換えた。
// 呼び出し側(page → generateQuery → ArticleList)の3段構成・関数名は維持している。
export const generateQuery = (searchParams: { [PAGE_QUERY]: string, [CATEGORY_QUERY]: string, [KEYWORD_QUERY]: string }): BlogListQuery => {
  const query: BlogListQuery = { limit: PER_PAGE, offset: 0 };

  if (searchParams[PAGE_QUERY]) {
    // NOTE: 不正な page 値（非数値・負値）で offset が NaN / 負値になるのを防ぐ
    const pageNum = parseInt(searchParams[PAGE_QUERY]);
    query.offset = Number.isNaN(pageNum) || pageNum < 1 ? 0 : (pageNum - 1) * PER_PAGE;
  }

  if (searchParams[CATEGORY_QUERY]) {
    const categoryValue = searchParams[CATEGORY_QUERY];
    // カテゴリの表示名(ja/en)・URLスラッグ・content idのいずれで渡されてもcontent.ts側のカテゴリslugに解決する
    const categoryEntry = resolveCategoryEntry(categoryValue);
    query.category = categoryEntry?.id ?? categoryValue;
  }

  if (searchParams[KEYWORD_QUERY]) {
    query.keyword = searchParams[KEYWORD_QUERY];
  }

  return query;
}

// 記事のプライマリカテゴリのURLスラッグを返す。該当カテゴリがCATEGORIES(src/static/categories.ts)に
// 見つからない場合（CMS側での削除等）は必ずDEFAULT_CATEGORY_IDにフォールバックする
// （CategoryTag/RelatedContentItemと同じresolveCategoryOrDefaultを使うことで挙動を統一する）。
export const getPrimaryCategoryId = (blog: Pick<BlogsContentType, "category">): string => {
  return resolveCategoryOrDefault(blog.category[0]?.id).slug;
}

export const generateBreadcrumbAssets = async (blog: BlogsContentType, locale: string = 'ja'): Promise<BreadcrumbItemType[]> => {
  const categoryEntry = resolveCategoryOrDefault(blog.category[0]?.id);
  const categoryId = categoryEntry.slug;
  const t = await getTranslations({ locale, namespace: 'navigation' });

  const categoryName = getLocalizedCategoryName(categoryEntry, locale);
  const localePrefix = `/${locale}`;
  
  const results = [
    {
      label: t('home'),
      href: localePrefix
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

// ロケールとパスセグメントから絶対URLを構築する
// 例: buildPageUrl('ja', 'blogs', 'programming', 'abc') => https://ryotablog.jp/ja/blogs/programming/abc
export const buildPageUrl = (locale: string, ...segments: string[]): string => {
  const path = segments.filter(Boolean).join("/");
  return `${baseURL}/${locale}${path ? `/${path}` : ""}`;
}

// 全ロケール分の hreflang(languages) マップを生成する
export const buildLanguageAlternates = (...segments: string[]): Record<string, string> =>
  Object.fromEntries(locales.map((loc) => [loc, buildPageUrl(loc, ...segments)]));