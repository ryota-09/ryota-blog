// velite.config.ts の transform で使用するmdastパースユーティリティ。
// 生のMDX本文(raw)からTOC(見出し一覧)・検索用プレーンテキストを計算する。
//
// なぜmdastでパースするか:
// - コードブロック内の `## foo` のような文字列を見出しと誤検出しないため
// - JSX要素(<MoshimoAffiliate .../> 等)の属性値をテキストとして拾わないため
import { fromMarkdown } from "mdast-util-from-markdown";
import { mdxFromMarkdown } from "mdast-util-mdx";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { mdxjs } from "micromark-extension-mdxjs";
import { gfm } from "micromark-extension-gfm";
import { visit } from "unist-util-visit";
import type { Root, Heading } from "mdast";

export type TocEntry = {
  depth: number;
  text: string;
  id: string | null;
};

// MDX本文をmdastツリーへパースする（GFM + MDX JSX拡張を有効化）
export const parseMdxToMdast = (raw: string): Root => {
  return fromMarkdown(raw, {
    extensions: [mdxjs(), gfm()],
    mdastExtensions: [mdxFromMarkdown(), gfmFromMarkdown()],
  });
};

// 見出しノードから、インライン装飾(強調・リンク等)を除いたプレーンテキストを取り出す
const extractHeadingText = (node: Heading): string => {
  let text = "";
  visit(node, "text", (textNode) => {
    text += textNode.value;
  });
  // インラインコード(`code`)も見出しテキストの一部として扱う
  visit(node, "inlineCode", (codeNode) => {
    text += codeNode.value;
  });
  return text.trim();
};

// 文書順のTOCを抽出し、frontmatterのheadingIds(出現順のid配列)と順序ベースでzipする。
// headingIdsが見出し数より短い場合、対応するエントリのidはnullになる。
export const extractToc = (raw: string, headingIds: string[]): TocEntry[] => {
  const tree = parseMdxToMdast(raw);
  const toc: TocEntry[] = [];
  let index = 0;

  visit(tree, "heading", (node: Heading) => {
    toc.push({
      depth: node.depth,
      text: extractHeadingText(node),
      id: headingIds[index] ?? null,
    });
    index++;
  });

  return toc;
};

// 検索用のプレーンテキストを抽出する。コードブロックの中身も検索対象に含める。
// JSXタグ自体(タグ名・属性)やリンクURLは含まれない(mdastのtext/inlineCode/codeノードのみを結合するため)。
export const extractPlainText = (raw: string): string => {
  const tree = parseMdxToMdast(raw);
  const parts: string[] = [];

  visit(tree, (node) => {
    if (node.type === "text" || node.type === "inlineCode" || node.type === "code") {
      const value = (node as { value: string }).value;
      if (value) parts.push(value);
    }
  });

  return parts.join(" ");
};
