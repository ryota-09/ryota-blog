// 見出し(h1〜h6)にmicroCMS由来のidを復元するrehypeプラグイン。
//
// 背景(docs/adr/0001-content-layer.md 決定6):
// MDXでは `{#custom-id}` 記法(acornパースエラー)や `<h2 id="...">` のJSXリテラル直書き
// (componentsマップが適用されずスタイルが失われる)が使えないため、
// Markdown見出しはそのまま書き、frontmatterの headingIds(出現順のid配列)を
// rehypeプラグインで文書順に注入する。
//
// frontmatterへのアクセス方式:
// velite の s.mdx() は compile() に「frontmatterを除いた本文」と「元ファイルパス」しか渡さず、
// rehypeプラグインが受け取るvfileにもfrontmatterは載らない(実機検証済み)。
// そのため file.path から元のMDXファイルをfsで読み直し、frontmatterのheadingIdsを取得する。
import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";
import type { VFile } from "vfile";

import { readFrontmatter } from "./read-frontmatter";

const HEADING_TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

export const rehypeRestoreHeadingIds = () => (tree: Root, file: VFile) => {
  const frontmatter = readFrontmatter(file.path);
  const headingIds = Array.isArray(frontmatter.headingIds)
    ? (frontmatter.headingIds as string[])
    : [];

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
