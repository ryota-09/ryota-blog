// 見出し(h1〜h6)にidを注入するrehypeプラグイン。
//
// 背景(docs/adr/0001-content-layer.md 決定6):
// MDXでは `{#custom-id}` 記法(acornパースエラー)や `<h2 id="...">` のJSXリテラル直書き
// (componentsマップが適用されずスタイルが失われる)が使えないため、
// Markdown見出しはそのまま書き、idはrehypeプラグインで文書順に注入する。
//
// idのソースは2系統:
// - 移行記事: frontmatterの headingIds(microCMS由来のid、出現順の配列)を復元する
// - 新規記事(headingIds無し): 見出しテキストのハッシュから自動生成する
//   (microCMS互換の h+16進10桁 形式。詳細は velite/mdast-utils.ts の computeHeadingIds)。
//   TOC(velite.config.tsのextractToc)と同じ computeHeadingIds を同じ本文に対して
//   使うことで、TOCのアンカーと実HTMLのidが必ず一致する
//
// frontmatterへのアクセス方式:
// velite の s.mdx() は compile() に「frontmatterを除いた本文」と「元ファイルパス」しか渡さず、
// rehypeプラグインが受け取るvfileにもfrontmatterは載らない(実機検証済み)。
// そのため file.path から元のMDXファイルをfsで読み直し、frontmatter/本文を取得する。
import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";
import type { VFile } from "vfile";

import { computeHeadingIds } from "./mdast-utils";
import { readFrontmatter, readMdxBody } from "./read-frontmatter";

const HEADING_TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

export const rehypeRestoreHeadingIds = () => (tree: Root, file: VFile) => {
  const frontmatter = readFrontmatter(file.path);
  const restoredIds = Array.isArray(frontmatter.headingIds)
    ? (frontmatter.headingIds as string[])
    : [];
  const headingIds =
    restoredIds.length > 0 ? restoredIds : computeHeadingIds(readMdxBody(file.path));

  if (headingIds.length === 0) return;

  let index = 0;
  visit(tree, "element", (node: Element) => {
    if (!HEADING_TAGS.has(node.tagName)) return;

    const id = headingIds[index];
    index += 1;
    if (!id) return;

    node.properties ??= {};
    node.properties.id = id;
  });
};
