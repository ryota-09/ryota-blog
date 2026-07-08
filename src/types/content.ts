// Velite生成型(.velite/index.d.ts相当)を元にしたドメイン型定義。
// #235時点ではデータ層の新設のみが目的で、既存のmicrocms.ts/microcms.tsの型とは独立して共存させる。
// ページ・コンポーネントの置き換えは後続Issue(#236/#238/#239)で行う。
import type { Blogs, Categories } from "#content/index";

// Veliteが生成する記事コレクションの型をそのまま公開する。
// (title/description/publishedAt/updatedAt/categories/thumbnail/noIndex/isAdvertisement/related/
//  headingIds/moshimoWidgets/body/raw/slug/locale/toc/plainText を含む)
export type BlogPost = Blogs;

// クライアントコンポーネント(記事カード・前後ナビ・関連記事等)へ渡してよい軽量サマリ型。
// BlogPostにはbody(コンパイル済みMDX)/raw(生MDX)/plainText等の重量フィールドが含まれ、
// クライアント境界をフルオブジェクトのまま越えるとRSCペイロード(HTML)に全文が
// シリアライズされて転送量が激増する(一覧ページで実測349KB)。
// クライアントへは必ずtoBlogPostSummary(content-utils.ts)で絞ってから渡すこと
export type BlogPostSummary = Pick<
  BlogPost,
  "slug" | "title" | "description" | "thumbnail" | "categories" | "publishedAt" | "updatedAt"
>;

// もしもアフィリエイトウィジェット1件分の型(MoshimoAffiliateコンポーネントのprops用)。
// フィールド名の意味はvelite.config.tsのmoshimoWidgetSchemaコメントを参照。
export type MoshimoWidget = BlogPost["moshimoWidgets"][number];

// TOCエントリ(velite/mdast-utils.tsのextractTocが生成する形状)。
export type TocEntry = BlogPost["toc"][number];

// Veliteが生成するカテゴリコレクションの型をそのまま公開する。
export type Category = Categories;

// 記事のロケール。現行microCMSの blogs / blogs_en エンドポイントの切り替えに対応する。
export type ContentLocale = "ja" | "en";

// getBlogList相当の戻り値シェイプ。microCMSのBaseMicroCMSApiListDataTypeと互換の形にする。
export type BlogListResult = {
  contents: BlogPost[];
  totalCount: number;
  offset: number;
  limit: number;
};

// getBlogList相当のクエリパラメータ。microCMSQueriesのうち本データ層で使うサブセット。
export type BlogListQuery = {
  offset?: number;
  limit?: number;
  // カテゴリでの絞り込み。カテゴリslug(content id相当)を渡す
  category?: string;
  // タイトル・説明・本文プレーンテキストに対する大文字小文字無視の部分一致検索(microCMSの`q`相当)
  keyword?: string;
};
