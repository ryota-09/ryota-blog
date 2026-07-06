// Velite生成型(.velite/index.d.ts相当)を元にしたドメイン型定義。
// #235時点ではデータ層の新設のみが目的で、既存のmicrocms.ts/microcms.tsの型とは独立して共存させる。
// ページ・コンポーネントの置き換えは後続Issue(#236/#238/#239)で行う。
import type { Blogs, Categories } from "#content/index";

// Veliteが生成する記事コレクションの型をそのまま公開する。
// (title/description/publishedAt/updatedAt/categories/thumbnail/noIndex/isAdvertisement/related/
//  headingIds/moshimoWidgets/body/raw/slug/locale/toc/plainText を含む)
export type BlogPost = Blogs;

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
