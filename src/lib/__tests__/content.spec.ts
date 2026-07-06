import { describe, expect, it } from "vitest";

import {
  getAllBlogListByLocale,
  getBlogBySlugByLocale,
  getBlogList,
  getPrevAndNextBlogByLocale,
} from "../content";
import { PER_PAGE } from "@/static/blogs";

// 実データ(.velite出力の日英各30記事、計60記事)を使って検証する。
// vitest実行前に `pretest` フック(package.json)で `velite build` が走り、.velite/ が生成される前提。
describe("content.ts", () => {
  describe("getAllBlogListByLocale", () => {
    it("ja/enそれぞれ30件ずつ返す", () => {
      expect(getAllBlogListByLocale("ja")).toHaveLength(30);
      expect(getAllBlogListByLocale("en")).toHaveLength(30);
    });

    it("publishedAt降順(新しい順)にソートされている", () => {
      const list = getAllBlogListByLocale("ja");
      for (let i = 0; i < list.length - 1; i++) {
        const current = new Date(list[i].publishedAt).getTime();
        const next = new Date(list[i + 1].publishedAt).getTime();
        expect(current).toBeGreaterThanOrEqual(next);
      }
    });

    it("最新記事が先頭に来る", () => {
      const list = getAllBlogListByLocale("ja");
      expect(list[0].slug).toBe("best-buy-2026-first-half");
    });
  });

  describe("getBlogList", () => {
    it("PER_PAGE(4)件のページネーションで正しくoffset/limitが動く", () => {
      const page1 = getBlogList("ja", { offset: 0, limit: PER_PAGE });
      const page2 = getBlogList("ja", { offset: PER_PAGE, limit: PER_PAGE });

      expect(page1.contents).toHaveLength(PER_PAGE);
      expect(page2.contents).toHaveLength(PER_PAGE);
      expect(page1.totalCount).toBe(30);
      expect(page1.offset).toBe(0);
      expect(page1.limit).toBe(PER_PAGE);

      // ページ間で記事が重複しない
      const page1Slugs = page1.contents.map((c) => c.slug);
      const page2Slugs = page2.contents.map((c) => c.slug);
      expect(page1Slugs.some((slug) => page2Slugs.includes(slug))).toBe(false);
    });

    it("最終ページは端数件数のみ返す", () => {
      // 30件をPER_PAGE=4で割ると7ページ+2件
      const lastPage = getBlogList("ja", { offset: 28, limit: PER_PAGE });
      expect(lastPage.contents).toHaveLength(2);
      expect(lastPage.totalCount).toBe(30);
    });

    it("範囲外のoffsetは空配列を返すがtotalCountは全体件数を維持する", () => {
      const result = getBlogList("ja", { offset: 1000, limit: PER_PAGE });
      expect(result.contents).toHaveLength(0);
      expect(result.totalCount).toBe(30);
    });

    it("カテゴリで絞り込める(categories配列のいずれかに一致)", () => {
      const result = getBlogList("ja", { offset: 0, limit: 100, category: "zakki" });
      expect(result.totalCount).toBe(11);
      result.contents.forEach((content) => {
        expect(content.categories).toContain("zakki");
      });
    });

    it("該当0件のカテゴリではtotalCount 0を返す", () => {
      const result = getBlogList("ja", { offset: 0, limit: 100, category: "not-exist-category" });
      expect(result.totalCount).toBe(0);
      expect(result.contents).toHaveLength(0);
    });

    it("キーワード検索: タイトルに大文字小文字無視で部分一致する", () => {
      const result = getBlogList("ja", { offset: 0, limit: 100, keyword: "ヒトオシ" });
      expect(result.totalCount).toBeGreaterThan(0);
      result.contents.forEach((content) => {
        const haystack = `${content.title}${content.description}${content.plainText}`.toLowerCase();
        expect(haystack).toContain("ヒトオシ".toLowerCase());
      });
    });

    it("キーワード検索: 存在しない語句では0件になる", () => {
      const result = getBlogList("ja", { offset: 0, limit: 100, keyword: "絶対に存在しないはずのキーワードxyz123" });
      expect(result.totalCount).toBe(0);
    });

    it("カテゴリとキーワードを同時に指定するとAND条件になる", () => {
      const categoryOnly = getBlogList("ja", { offset: 0, limit: 100, category: "aws" });
      expect(categoryOnly.totalCount).toBe(4);

      const combined = getBlogList("ja", {
        offset: 0,
        limit: 100,
        category: "aws",
        keyword: "絶対に存在しないはずのキーワードxyz123",
      });
      expect(combined.totalCount).toBe(0);
    });

    it("デフォルトのoffset/limitが機能する(offset未指定は0扱い)", () => {
      const result = getBlogList("ja", { limit: 5 });
      expect(result.offset).toBe(0);
      expect(result.contents).toHaveLength(5);
    });
  });

  describe("getBlogBySlugByLocale", () => {
    it("slugを指定して記事を1件取得できる", () => {
      const blog = getBlogBySlugByLocale("ja", "hitooshi-members");
      expect(blog.slug).toBe("hitooshi-members");
      expect(blog.locale).toBe("ja");
      expect(blog.title).toContain("ヒトオシ");
    });

    it("存在しないslugを指定するとエラーを投げる", () => {
      expect(() => getBlogBySlugByLocale("ja", "not-exist-slug")).toThrow();
    });

    it("同じslugでもlocaleが違えば別記事(ja/en)を返す", () => {
      const ja = getBlogBySlugByLocale("ja", "hitooshi-members");
      const en = getBlogBySlugByLocale("en", "hitooshi-members");
      expect(ja.locale).toBe("ja");
      expect(en.locale).toBe("en");
      expect(ja.title).not.toBe(en.title);
    });
  });

  describe("getPrevAndNextBlogByLocale", () => {
    it("中間の記事ではprev(より古い)・next(より新しい)の両方が存在する", () => {
      const list = getAllBlogListByLocale("ja");
      const middle = list[Math.floor(list.length / 2)];
      const { prevBlogData, nextBlogData } = getPrevAndNextBlogByLocale("ja", middle);

      expect(prevBlogData).not.toBeNull();
      expect(nextBlogData).not.toBeNull();
      expect(new Date(prevBlogData!.publishedAt).getTime()).toBeLessThan(
        new Date(middle.publishedAt).getTime(),
      );
      expect(new Date(nextBlogData!.publishedAt).getTime()).toBeGreaterThan(
        new Date(middle.publishedAt).getTime(),
      );
    });

    it("最新記事ではnextがnullになる", () => {
      const list = getAllBlogListByLocale("ja");
      const newest = list[0];
      const { nextBlogData } = getPrevAndNextBlogByLocale("ja", newest);
      expect(nextBlogData).toBeNull();
    });

    it("最古記事ではprevがnullになる", () => {
      const list = getAllBlogListByLocale("ja");
      const oldest = list[list.length - 1];
      const { prevBlogData } = getPrevAndNextBlogByLocale("ja", oldest);
      expect(prevBlogData).toBeNull();
    });
  });
});
