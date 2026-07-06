// フェンスドコードブロックの meta 文字列(例: ```bash title="terminal" の title="terminal" 部分)を
// code要素の properties["data-meta"] にコピーするrehypeプラグイン。
//
// なぜ必要か:
// mdast-util-to-hast(MDXが内部で使うmdast→hast変換)は、コードのmeta文字列を
// hastノードの `data.meta` に保持するのみで、`properties`(=JSXのprops)にはコピーしない。
// MDXの components マップ(pre/code)はJSXのpropsしか参照できないため、
// このプラグインで明示的に data-meta プロパティへコピーし、MdxContent側の
// pre コンポーネントから `props.children.props["data-meta"]` として参照できるようにする。
import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";

export const rehypeCodeMeta = () => (tree: Root) => {
  visit(tree, "element", (node: Element) => {
    if (node.tagName !== "code") return;
    const meta = node.data?.meta;
    if (typeof meta !== "string" || meta.length === 0) return;

    node.properties ??= {};
    node.properties["data-meta"] = meta;
  });
};
