// 検索結果ページ用OGP画像。/blogs と同じ汎用デザイン(サイトタイトル+著者)を流用する。
// OGP画像のファイル規約は子セグメントへ継承されないため、明示的に再エクスポートしないと
// 検索結果URLの共有時に og:image / twitter:image が欠落する(回帰レビューで検出)
export { default, size, contentType } from "../opengraph-image";
