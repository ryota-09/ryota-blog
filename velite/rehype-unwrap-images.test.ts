import { describe, expect, it } from "vitest";

import { rehypeUnwrapImages } from "./rehype-unwrap-images";

import type { Element, ElementContent, Root, Text } from "hast";

// テスト用のhastノード生成ヘルパー
const el = (tagName: string, children: ElementContent[] = []): Element => ({
  type: "element",
  tagName,
  properties: {},
  children,
});

const img = (src: string): Element => ({
  type: "element",
  tagName: "img",
  properties: { src },
  children: [],
});

const text = (value: string): Text => ({ type: "text", value });

const root = (children: Root["children"]): Root => ({ type: "root", children });

// プラグインを適用して変換後のツリーを返す
const run = (tree: Root): Root => {
  rehypeUnwrapImages()(tree);
  return tree;
};

describe("rehypeUnwrapImages", () => {
  it("画像のみの段落からpラッパーを外す", () => {
    const tree = run(root([el("p", [img("/static/a.png")])]));
    expect(tree.children).toHaveLength(1);
    expect((tree.children[0] as Element).tagName).toBe("img");
  });

  it("複数画像が並ぶ段落(空白テキスト含む)もunwrapする", () => {
    const tree = run(
      root([el("p", [img("/static/a.png"), text("\n"), img("/static/b.png")])]),
    );
    const tagNames = tree.children
      .filter((node): node is Element => node.type === "element")
      .map((node) => node.tagName);
    expect(tagNames).toEqual(["img", "img"]);
  });

  it("画像のみを含むリンクだけの段落もunwrapする", () => {
    const tree = run(
      root([el("p", [el("a", [img("/static/a.png")])])]),
    );
    expect(tree.children).toHaveLength(1);
    expect((tree.children[0] as Element).tagName).toBe("a");
  });

  it("テキストと画像が混在する段落は変更しない", () => {
    const tree = run(
      root([el("p", [text("説明: "), img("/static/a.png")])]),
    );
    expect(tree.children).toHaveLength(1);
    expect((tree.children[0] as Element).tagName).toBe("p");
  });

  it("画像を含まない通常の段落は変更しない", () => {
    const tree = run(root([el("p", [text("ただの文章")])]));
    expect(tree.children).toHaveLength(1);
    expect((tree.children[0] as Element).tagName).toBe("p");
  });

  it("blockquote内など入れ子の画像段落もunwrapする", () => {
    const tree = run(
      root([el("blockquote", [el("p", [img("/static/a.png")])])]),
    );
    const blockquote = tree.children[0] as Element;
    expect((blockquote.children[0] as Element).tagName).toBe("img");
  });
});
