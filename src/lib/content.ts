// Velite(content/配下のMDX/JSON)を情報源とするコンテンツ取得層。
// 既存の src/lib/microcms.ts と同等のセマンティクスを持つ関数群を提供する。
// #236で記事詳細ページ(src/app/[locale]/blogs/[category]/[blogId]/page.tsx)をこの層に切り替えた。
import { cache } from "react";
import { getTranslations } from "next-intl/server";

import { blogs as ALL_BLOGS } from "#content/index";
import { CATEGORIES, isHiddenFromHomeByCategory, resolveCategoryOrDefault } from "@/static/categories";
import type { CategoryEntry } from "@/static/categories";
import { buildPageUrl } from "@/lib";
import { getLocalizedCategoryName } from "@/lib/i18n-utils";
import { locales } from "@/i18n/config";
import type { BreadcrumbItemType, TOCAssetsType } from "@/types";
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

// NOTE: draft記事の除外は velite.config.ts の prepare フックで行っている(#240)。
// 本番ビルド(NODE_ENV=production)時点で ALL_BLOGS(#content/index)自体から
// draft: true の記事が取り除かれるため、ここでの追加フィルタは不要。
// (開発環境ではフィルタされないため、`npm run dev` でdraft記事もプレビューできる)
// この関数はロケール絞り込みのみを行うが、全消費関数(getBlogList/getAllBlogListByLocale等)の
// 唯一の起点であるという構造は維持しておく(将来別の絞り込みが必要になった場合の一箇所ポイント)。
const getPublishedBlogsByLocale = (locale: ContentLocale): BlogPost[] =>
  blogsByLocale(locale);

// 検索語・対象文字列の表記ゆれを吸収する正規化。
// NFKC正規化で全角英数字/記号と半角を同一視し(例: "Ｎｅｘｔ" と "Next"を一致させる)、
// その後toLowerCaseで大文字小文字を無視する。
const normalizeForSearch = (value: string): string => value.normalize("NFKC").toLowerCase();

// キーワードがtitle/description/plainTextのいずれかに大文字小文字・全半角無視で部分一致するか判定する
// (microCMSの `q` パラメータ相当。microCMSの`q`は全文検索だが、本データ層ではこの3フィールドに限定する)
const matchesKeyword = (blog: BlogPost, keyword: string): boolean => {
  const normalizedKeyword = normalizeForSearch(keyword);
  return (
    normalizeForSearch(blog.title).includes(normalizedKeyword) ||
    normalizeForSearch(blog.description).includes(normalizedKeyword) ||
    normalizeForSearch(blog.plainText).includes(normalizedKeyword)
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
  const { offset = 0, limit = 10, category, keyword, excludeHiddenFromHome } = query;

  let filtered = getPublishedBlogsByLocale(locale);

  // トップ(/blogs)の全体一覧のみ、以下2種類の記事を除外する。
  //   1. 記事単位の hideFromHome: true (同一クラスタの連投でトップを占有しないための個別指定)
  //   2. primaryカテゴリ(categories[0])が hideFromHome のカテゴリ(雑記・時事・LifeHack)に
  //      属する記事。技術系の読者がトップを見たときに非IT記事が混ざらないようにする
  // カテゴリ一覧(§4のインデックス導線ハブ)・検索には出したいので、呼び出し側で明示的に指定する
  if (excludeHiddenFromHome) {
    filtered = filtered.filter(
      (blog) => !blog.hideFromHome && !isHiddenFromHomeByCategory(blog.categories),
    );
  }

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
 * 指定localeで記事が1件以上あるカテゴリだけを、カテゴリマスタ(content/categories.json)の並び順で返す。
 * 記事0件のカテゴリページは「記事がありません」の空一覧を200で返すことになり、
 * Googleにソフト404と判定される(2026-10 GSCで /blogs/gadget・/blogs/openai_api が該当)。
 * そのため公開導線(静的生成・サイトマップ・サイドナビ)はこの関数を情報源にし、空カテゴリを出さない。
 * NOTE: ja/enで記事のカテゴリ構成が異なりうるため、必ずlocaleごとに判定する。
 */
export const getCategoriesWithArticles = (locale: ContentLocale): CategoryEntry[] => {
  const usedCategoryIds = new Set(
    getPublishedBlogsByLocale(locale).flatMap((blog) => blog.categories),
  );
  return CATEGORIES.filter((category) => usedCategoryIds.has(category.id));
};

/**
 * 記事詳細ページのhreflang(alternates.languages)を組み立てる。
 * 記事のプライマリカテゴリ(categories[0])はja/enで異なりうるため(例: nextjs-typescript-book-review2 は
 * ja=typescript / en=review)、各localeのURLは「そのlocaleの記事」のカテゴリで組み立てる。
 * 表示中localeのカテゴリを使い回すと他localeのURLが404を指し、GSCで404として検出される。
 * そのlocaleに記事が存在しない場合はエントリ自体を含めない。
 */
export const buildArticleLanguageAlternates = (slug: string): Record<string, string> =>
  Object.fromEntries(
    locales.flatMap((locale) => {
      const blog = getPublishedBlogsByLocale(locale).find((item) => item.slug === slug);
      if (!blog) return [];
      const categoryId = resolveCategoryOrDefault(blog.categories[0]).slug;
      return [[locale, buildPageUrl(locale, "blogs", categoryId, slug)]];
    }),
  );

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

/**
 * getPrimaryCategoryId(src/lib/index.ts)のBlogPost版。
 * BlogPost.categoriesは文字列配列(slug)なので、BlogsContentType版のように category[0].id を
 * 取り出す必要はなく、先頭要素をそのままresolveCategoryOrDefaultに渡すだけでよい。
 *
 * NOTE: 実装はクライアント安全な content-utils.ts に移動した(サーバー側の既存importの互換のため再エクスポート)。
 * このファイル(content.ts)は#content/index(全記事JSON・生2.4MB)をトップレベルでimportしているため、
 * クライアントコンポーネントからimportしてはならない(全記事データがクライアントバンドルに混入する)。
 * クライアントでも使う純粋ヘルパーは content-utils.ts に置くこと。
 */
export { getPrimaryCategoryIdFromBlogPost } from "@/lib/content-utils";

/**
 * BlogPost.toc(文書順のフラット配列: {depth, text, id}[])を、
 * TOCList(src/components/ArticleBody/TOCList)が期待するネスト形状(TOCAssetsType[])に変換する。
 * 現行のgenerateTOCAssets(depth2をトップレベル、depth3をsubListにネスト)と同じ構造にする。
 * id が null の見出し(headingIdsが見出し数より少ない場合)はTOC自体から除外する
 * (TOCListはidをキー・アンカーリンク先として必須で使うため)。
 */
export const buildTocAssets = (toc: BlogPost["toc"]): TOCAssetsType[] => {
  const results: TOCAssetsType[] = [];

  for (const entry of toc) {
    if (!entry.id) continue;

    if (entry.depth === 2) {
      results.push({ id: entry.id, text: entry.text, subList: [] });
    } else if (entry.depth === 3 && results.length > 0) {
      results[results.length - 1].subList.push({ id: entry.id, text: entry.text });
    }
  }

  return results;
};

/**
 * BlogPost.related(slug配列)から、実在する関連記事(BlogPost[])を解決する。
 * 現行のrelatedContent(microCMSのリレーションフィールド)相当。
 * 存在しないslug(記事削除等)は黙って除外する。
 */
export const resolveRelatedBlogs = (locale: ContentLocale, related: string[]): BlogPost[] => {
  const blogs = getPublishedBlogsByLocale(locale);
  return related
    .map((slug) => blogs.find((blog) => blog.slug === slug))
    .filter((blog): blog is BlogPost => blog !== undefined);
};

/**
 * generateBreadcrumbAssets(src/lib/index.ts)のBlogPost版。パンくずリストの3階層
 * (ホーム/カテゴリ/記事タイトル)を生成する。ロジックはBlogsContentType版と同一で、
 * カテゴリ解決とタイトル・スラッグの取り出し元をBlogPostの形状に合わせただけ。
 */
export const generateBreadcrumbAssetsFromBlogPost = async (
  blog: Pick<BlogPost, "categories" | "title" | "slug">,
  locale: ContentLocale = "ja",
): Promise<BreadcrumbItemType[]> => {
  const categoryEntry = resolveCategoryOrDefault(blog.categories[0]);
  const categoryId = categoryEntry.slug;
  const t = await getTranslations({ locale, namespace: "navigation" });

  const categoryName = getLocalizedCategoryName(categoryEntry, locale);
  const localePrefix = `/${locale}`;

  return [
    { label: t("home"), href: localePrefix },
    { label: categoryName, href: `${localePrefix}/blogs/${categoryId}` },
    { label: blog.title, href: `${localePrefix}/blogs/${categoryId}/${blog.slug}` },
  ];
};
