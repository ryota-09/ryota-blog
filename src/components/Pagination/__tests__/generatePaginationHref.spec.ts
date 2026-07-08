import { describe, expect, test } from "vitest";

import { generatePaginationHref } from "@/components/Pagination/generatePaginationHref";

// useSearchParams()の戻り値を模したスタブ
const params = (init: Record<string, string> = {}) => new URLSearchParams(init);

describe("generatePaginationHref", () => {
  test("basePath指定時はパスベースのページネーションを生成する", () => {
    expect(
      generatePaginationHref({ pathname: "/ja/blogs", searchParams: params(), pageNumber: 1, basePath: "/ja/blogs" })
    ).toBe("/ja/blogs");
    expect(
      generatePaginationHref({ pathname: "/ja/blogs", searchParams: params(), pageNumber: 3, basePath: "/ja/blogs" })
    ).toBe("/ja/blogs/page/3");
    expect(
      generatePaginationHref({ pathname: "/ja/blogs/typescript", searchParams: params(), pageNumber: 2, basePath: "/ja/blogs/typescript" })
    ).toBe("/ja/blogs/typescript/page/2");
  });

  test("検索ページではkeyword/categoryクエリを保持したままpageクエリで遷移する", () => {
    expect(
      generatePaginationHref({ pathname: "/ja/blogs/search", searchParams: params({ keyword: "Next" }), pageNumber: 2 })
    ).toBe("/ja/blogs/search?keyword=Next&page=2");
    expect(
      generatePaginationHref({ pathname: "/ja/blogs/search", searchParams: params({ keyword: "テスト", category: "typescript" }), pageNumber: 3 })
    ).toBe(`/ja/blogs/search?keyword=${encodeURIComponent("テスト")}&category=typescript&page=3`);
    // 1ページ目はpageクエリを付けない
    expect(
      generatePaginationHref({ pathname: "/ja/blogs/search", searchParams: params({ keyword: "Next" }), pageNumber: 1 })
    ).toBe("/ja/blogs/search?keyword=Next");
  });

  test("検索ページではbasePathが渡されても検索条件の保持を優先する", () => {
    expect(
      generatePaginationHref({ pathname: "/ja/blogs/search", searchParams: params({ keyword: "Next" }), pageNumber: 2, basePath: "/ja/blogs" })
    ).toBe("/ja/blogs/search?keyword=Next&page=2");
  });

  test("basePathなしのカテゴリページではpathnameからカテゴリを解決する", () => {
    expect(
      generatePaginationHref({ pathname: "/ja/blogs/typescript", searchParams: params(), pageNumber: 2 })
    ).toBe("/ja/blogs/typescript/page/2");
    expect(
      generatePaginationHref({ pathname: "/ja/blogs/typescript", searchParams: params(), pageNumber: 1 })
    ).toBe("/ja/blogs/typescript");
  });

  test("ページネーション済みカテゴリパスでもカテゴリ文脈を維持する(旧EllipsisMenuItemの潜在バグの回帰防止)", () => {
    expect(
      generatePaginationHref({ pathname: "/ja/blogs/typescript/page/4", searchParams: params(), pageNumber: 2 })
    ).toBe("/ja/blogs/typescript/page/2");
    expect(
      generatePaginationHref({ pathname: "/en/blogs/zakki/page/3", searchParams: params(), pageNumber: 1 })
    ).toBe("/en/blogs/zakki");
  });

  test("カテゴリなしのページネーション済みパスは素の一覧を基点にする", () => {
    expect(
      generatePaginationHref({ pathname: "/ja/blogs/page/3", searchParams: params(), pageNumber: 2 })
    ).toBe("/ja/blogs/page/2");
    expect(
      generatePaginationHref({ pathname: "/ja/blogs/page/3", searchParams: params(), pageNumber: 1 })
    ).toBe("/ja/blogs");
  });

  test("localeを正しく引き継ぐ", () => {
    expect(
      generatePaginationHref({ pathname: "/en/blogs/search", searchParams: params({ keyword: "react" }), pageNumber: 2 })
    ).toBe("/en/blogs/search?keyword=react&page=2");
  });
});
