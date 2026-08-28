// MDX本文中の「画像のみを含む段落」から<p>ラッパーを外すrehypeプラグイン。
//
// なぜ必要か:
// Markdownの画像("![alt](./images/xxx.jpeg)")は段落として<p>にラップされるが、
// レンダリング側のMdxImg(src/components/ArticleBody/MdxContent/MdxImg.tsx)は
// PopupModalの<div>やCustomImgの<p>を描画するため、<p>の子に<div>/<p>が入る
// 不正なHTMLネストになる(React devオーバーレイのhydration警告・本番HTMLでも不正のまま)。
// コンポーネント側をphrasing contentに寄せるより、そもそも段落ラッパーを外すほうが
// 全ケース(PopupModalの二重div・CustomImgのp)を一度に解決できる。
//
// unwrap対象は「画像・画像のみを含むリンク・空白テキストだけで構成され、
// 画像を1枚以上含む段落」(rehype-unwrap-imagesと同等の判定)。
// テキストと画像が混在する段落は通常の段落として維持する
// (現状の記事には存在しないことを確認済み。存在しても表示が壊れるわけではない)。
import { SKIP, visit } from "unist-util-visit";

import type { Element, ElementContent, Root } from "hast";

// 空白のみのテキストノードか
const isWhitespaceText = (node: ElementContent): boolean =>
  node.type === "text" && /^[ \t\r\n]*$/.test(node.value);

const isImg = (node: ElementContent): boolean =>
  node.type === "element" && node.tagName === "img";

// 子が「画像・空白・(画像のみを含む)リンク」だけで構成され、画像を1枚以上含むか
const containsOnlyImages = (children: ElementContent[]): boolean => {
  let hasImage = false;
  for (const child of children) {
    if (isWhitespaceText(child)) continue;
    if (isImg(child)) {
      hasImage = true;
      continue;
    }
    if (child.type === "element" && child.tagName === "a") {
      if (!containsOnlyImages(child.children)) return false;
      hasImage = true;
      continue;
    }
    return false;
  }
  return hasImage;
};

export const rehypeUnwrapImages = () => (tree: Root) => {
  visit(tree, "element", (node: Element, index, parent) => {
    if (node.tagName !== "p" || index === undefined || !parent) return;
    if (!containsOnlyImages(node.children)) return;

    parent.children.splice(index, 1, ...node.children);
    // 展開した子ノードを再訪問する必要はないため、その直後から走査を続行する
    return [SKIP, index + node.children.length];
  });
};
