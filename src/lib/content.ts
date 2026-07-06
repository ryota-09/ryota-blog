// Velite(content/配下のMDX/JSON)を情報源とするコンテンツ取得層。
// 既存の src/lib/microcms.ts と同等のセマンティクスを持つ関数群を提供する。
// #235時点では新設のみ行い、既存ページ・コンポーネントの置き換えは行わない(#236/#238/#239で対応)。
import { cache } from "react";

import { blogs as ALL_BLOGS } from "#content/index";
import type {
  BlogListQuery,
  BlogListResult,
  BlogPost,
  ContentLocale,
} from "@/types/content";

// publishedAt降順(新しい順)に並べた記事一覧。ロケール別に事前ソートしてキャッシュする。
// (microCMSの `orders: "-publishedAt"` と同じ並び順。ArticleList等の現行呼び出しはこの順序を前提にしている)
const sortByPublishedAtDesc = (a: BlogPost, b: BlogPost): number =>
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();

const blogsByLocale = (locale: ContentLocale): BlogPost[] =>
  ALL_BLOGS.filter((blog) => blog.locale === locale);

// NOTE: 現状frontmatterにdraftフィールドは存在しないため下書き除外は行わない。
// 将来draftフィールドを追加する場合は、ここ(かつ ALL_BLOGS を参照する全関数の起点)で
// `.filter((blog) => !blog.draft)` を挟むと一箇所の変更で全関数に反映できる。
const getPublishedBlogsByLocale = (locale: ContentLocale): BlogPost[] =>
  blogsByLocale(locale);

// キーワードがtitle/description/plainTextのいずれかに大文字小文字無視で部分一致するか判定する
// (microCMSの `q` パラメータ相当。microCMSの`q`は全文検索だが、本データ層ではこの3フィールドに限定する)
const matchesKeyword = (blog: BlogPost, keyword: string): boolean => {
  const normalizedKeyword = keyword.toLowerCase();
  return (
    blog.title.toLowerCase().includes(normalizedKeyword) ||
    blog.description.toLowerCase().includes(normalizedKeyword) ||
    blog.plainText.toLowerCase().includes(normalizedKeyword)
  );
};

// 記事がカテゴリに属するか判定する(microCMSの `category[contains]{id}` 相当。categories配列のいずれかに一致すればOK)
const matchesCategory = (blog: BlogPost, category: string): boolean =>
  blog.categories.includes(category);

/**
 * getBlogList相当: offset/limitページネーション・カテゴリフィルタ・キーワード検索・publishedAt降順。
 * 戻り値は microCMS の BaseMicroCMSApiListDataType 互換シェイプ({ contents, totalCount, offset, limit })。
 */
export const getBlogList = (
  locale: ContentLocale,
  query: BlogListQuery = {},
): BlogListResult => {
  const { offset = 0, limit = 10, category, keyword } = query;

  let filtered = getPublishedBlogsByLocale(locale);

  if (category) {
    filtered = filtered.filter((blog) => matchesCategory(blog, category));
  }

  if (keyword) {
    filtered = filtered.filter((blog) => matchesKeyword(blog, keyword));
  }

  const sorted = [...filtered].sort(sortByPublishedAtDesc);
  const totalCount = sorted.length;
  const contents = sorted.slice(offset, offset + limit);

  return { contents, totalCount, offset, limit };
};

/**
 * getAllBlogListByLocale相当: ページネーションなしで全件(publishedAt降順)を返す。
 * microCMSの getAllContents (limit=100固定+offset自動ページングで全件取得)の代替。
 */
export const getAllBlogListByLocale = (locale: ContentLocale): BlogPost[] => {
  return [...getPublishedBlogsByLocale(locale)].sort(sortByPublishedAtDesc);
};

/**
 * getBlogByIdByLocale相当(本データ層ではcontent id = slug): 指定localeの記事をslugで1件取得する。
 * 見つからない場合はエラーを投げる(呼び出し元のtry/catchでnotFound()に繋げる現行の使い方を踏襲)。
 */
export const getBlogBySlugByLocale = (locale: ContentLocale, slug: string): BlogPost => {
  const blog = getPublishedBlogsByLocale(locale).find((item) => item.slug === slug);
  if (!blog) {
    throw new Error(`記事が見つかりません: locale=${locale}, slug=${slug}`);
  }
  return blog;
};

/**
 * getBlogByIdByLocaleCached相当: 同一リクエスト内での重複取得を防ぐcache()ラップ版。
 * (generateMetadataとページ本体の二重呼び出しをまとめる用途)
 */
export const getBlogBySlugByLocaleCached = cache(
  (locale: ContentLocale, slug: string): BlogPost => getBlogBySlugByLocale(locale, slug),
);

/**
 * getPrevAndNextBlogByLocale相当: publishedAtでの前後隣接記事を取得する。
 * - prev: 自分より publishedAt が古い記事の中で最も新しいもの(= less_than + orders:-publishedAt + limit:1)
 * - next: 自分より publishedAt が新しい記事の中で最も古いもの(= greater_than + orders:publishedAt + limit:1)
 * 端(最古/最新)の記事の場合は該当する側がnullになる。
 */
export const getPrevAndNextBlogByLocale = (
  locale: ContentLocale,
  data: Pick<BlogPost, "publishedAt">,
): { prevBlogData: BlogPost | null; nextBlogData: BlogPost | null } => {
  const targetTime = new Date(data.publishedAt).getTime();
  const sorted = getAllBlogListByLocale(locale); // publishedAt降順(新しい→古い)

  // 降順配列において「自分より古い記事」の先頭が、直前(prev)にあたる最も新しい記事
  const prevBlogData =
    sorted.find((blog) => new Date(blog.publishedAt).getTime() < targetTime) ?? null;

  // 降順配列を末尾から見て「自分より新しい記事」の先頭(配列的には最後に見つかるもの)が、
  // 直後(next)にあたる最も古い記事。降順配列を逆順に辿ることで求める。
  const nextBlogData =
    [...sorted].reverse().find((blog) => new Date(blog.publishedAt).getTime() > targetTime) ??
    null;

  return { prevBlogData, nextBlogData };
};
