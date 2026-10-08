import { describe, expect, it } from "vitest";

import { resolveArticleCanonicalPath } from "../article-canonical-path";

// ja/enでプライマリカテゴリが異なる記事(実例: nextjs-typescript-book-review2)を模したマップ
const categoryMap = {
  ja: { "book-review": "typescript", "same-cat": "next_js" },
  en: { "book-review": "review", "same-cat": "next_js" },
};
const knownCategoryIds = new Set(["typescript", "review", "next_js", "zakki"]);

const resolve = (pathname: string) =>
  resolveArticleCanonicalPath(pathname, categoryMap, knownCategoryIds);

describe("resolveArticleCanonicalPath", () => {
  it("カテゴリがプライマリと異なる記事URLは、そのlocaleの正規URLを返す", () => {
    // 言語切替(ロケール接頭辞のみ置換)で ja のカテゴリのまま en に来たケース
    expect(resolve("/en/blogs/typescript/book-review")).toBe("/en/blogs/review/book-review");
    expect(resolve("/ja/blogs/review/book-review")).toBe("/ja/blogs/typescript/book-review");
  });

  it("正規URL(カテゴリ一致)ならnullを返す(リダイレクト不要)", () => {
    expect(resolve("/ja/blogs/typescript/book-review")).toBeNull();
    expect(resolve("/en/blogs/review/book-review")).toBeNull();
    expect(resolve("/en/blogs/next_js/same-cat")).toBeNull();
  });

  it("存在しない記事slugはnullを返す(404のまま)", () => {
    expect(resolve("/ja/blogs/typescript/not-exist")).toBeNull();
  });

  it("既知カテゴリ以外のセグメント配下は対象外(他ルートを巻き込まない)", () => {
    expect(resolve("/ja/blogs/zenn/book-review")).toBeNull();
    expect(resolve("/ja/blogs/page/book-review")).toBeNull();
  });

  it("未対応locale・記事URL以外の形は対象外", () => {
    expect(resolve("/fr/blogs/typescript/book-review")).toBeNull();
    expect(resolve("/ja/blogs/typescript")).toBeNull();
    expect(resolve("/ja/blogs/typescript/book-review/extra")).toBeNull();
    expect(resolve("/ja/blogs/typescript/page/2")).toBeNull();
  });
});
