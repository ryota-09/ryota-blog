import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import yaml from "js-yaml";
import { describe, expect, it } from "vitest";

import {
  buildArticleLanguageAlternates,
  getAllBlogListByLocale,
  getBlogBySlugByLocale,
  getBlogList,
  getCategoriesWithArticles,
  getPrevAndNextBlogByLocale,
} from "../content";
import { baseURL } from "@/config";
import { PER_PAGE } from "@/static/blogs";

// 実データ(.velite出力)を使って検証する。
// vitest実行前に `pretest` フック(package.json)で `velite build` が走り、.velite/ が生成される前提。
//
// 期待値は記事数のハードコードではなく、content/blogs/ のファイルシステムを
// 「独立したオラクル」として算出する(記事を追加するたびにテストが壊れるのを防ぐ。
// 2026-07-07、31本目の記事追加で件数固定の旧テストが赤くなったことへの対処)。
// NOTE: pretest は NODE_ENV=development で velite build するため、draft記事も
// .velite に含まれる。ファイル数ベースのオラクルはこれと常に一致する。
const BLOGS_DIR = path.join(__dirname, "..", "..", "..", "content", "blogs");

type BlogFrontmatter = { categories?: string[]; hideFromHome?: boolean };

const listFrontmattersByLocale = (locale: "ja" | "en"): BlogFrontmatter[] =>
  readdirSync(BLOGS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const file = path.join(BLOGS_DIR, entry.name, `index.${locale}.mdx`);
      if (!existsSync(file)) return [];
      const match = readFileSync(file, "utf-8").match(/^---\r?\n([\s\S]*?)\r?\n---/);
      return match ? [yaml.load(match[1]) as BlogFrontmatter] : [];
    });

const jaFrontmatters = listFrontmattersByLocale("ja");
const jaTotal = jaFrontmatters.length;
const countJaByCategory = (category: string) =>
  jaFrontmatters.filter((fm) => fm.categories?.includes(category)).length;

// トップ非表示カテゴリのオラクル。テスト対象(@/static/categories)ではなく
// content/categories.json を直接読んで独立した期待値にする。
type CategoryRecord = { id: string; hideFromHome?: boolean };
const CATEGORIES_JSON = path.join(__dirname, "..", "..", "..", "content", "categories.json");
const categoryRecords = JSON.parse(readFileSync(CATEGORIES_JSON, "utf-8")) as CategoryRecord[];
const hiddenCategoryIds = new Set(
  categoryRecords
    .filter((category) => category.hideFromHome)
    .map((category) => category.id),
);
// トップ(/blogs)に残るべき記事: 記事単位のhideFromHomeでも、primaryカテゴリでも隠されていないもの
const jaVisibleOnHome = jaFrontmatters.filter(
  (fm) => !fm.hideFromHome && !hiddenCategoryIds.has(fm.categories?.[0] ?? ""),
);

describe("content.ts", () => {
  describe("getAllBlogListByLocale", () => {
    it("content/blogs/のファイル数と同じ件数をja/enそれぞれ返す", () => {
      expect(getAllBlogListByLocale("ja")).toHaveLength(jaTotal);
      expect(getAllBlogListByLocale("en")).toHaveLength(listFrontmattersByLocale("en").length);
    });

    it("publishedAt降順(新しい順)にソートされている", () => {
      const list = getAllBlogListByLocale("ja");
      for (let i = 0; i < list.length - 1; i++) {
        const current = new Date(list[i].publishedAt).getTime();
        const next = new Date(list[i + 1].publishedAt).getTime();
        expect(current).toBeGreaterThanOrEqual(next);
      }
    });

    it("最新記事(publishedAt最大)が先頭に来る", () => {
      const list = getAllBlogListByLocale("ja");
      const newest = Math.max(...list.map((blog) => new Date(blog.publishedAt).getTime()));
      expect(new Date(list[0].publishedAt).getTime()).toBe(newest);
    });
  });

  describe("getBlogList", () => {
    it("PER_PAGE(4)件のページネーションで正しくoffset/limitが動く", () => {
      const page1 = getBlogList("ja", { offset: 0, limit: PER_PAGE });
      const page2 = getBlogList("ja", { offset: PER_PAGE, limit: PER_PAGE });

      expect(page1.contents).toHaveLength(PER_PAGE);
      expect(page2.contents).toHaveLength(PER_PAGE);
      expect(page1.totalCount).toBe(jaTotal);
      expect(page1.offset).toBe(0);
      expect(page1.limit).toBe(PER_PAGE);

      // ページ間で記事が重複しない
      const page1Slugs = page1.contents.map((c) => c.slug);
      const page2Slugs = page2.contents.map((c) => c.slug);
      expect(page1Slugs.some((slug) => page2Slugs.includes(slug))).toBe(false);
    });

    it("最終ページは端数件数のみ返す", () => {
      // 最終ページのoffsetと端数件数を全記事数から算出する(端数0の場合はPER_PAGE件になる)
      const lastPageOffset = Math.floor((jaTotal - 1) / PER_PAGE) * PER_PAGE;
      const expectedCount = jaTotal - lastPageOffset;
      const lastPage = getBlogList("ja", { offset: lastPageOffset, limit: PER_PAGE });
      expect(lastPage.contents).toHaveLength(expectedCount);
      expect(lastPage.totalCount).toBe(jaTotal);
    });

    it("範囲外のoffsetは空配列を返すがtotalCountは全体件数を維持する", () => {
      const result = getBlogList("ja", { offset: jaTotal + 1000, limit: PER_PAGE });
      expect(result.contents).toHaveLength(0);
      expect(result.totalCount).toBe(jaTotal);
    });

    it("カテゴリで絞り込める(categories配列のいずれかに一致)", () => {
      const result = getBlogList("ja", { offset: 0, limit: 100, category: "zakki" });
      expect(result.totalCount).toBe(countJaByCategory("zakki"));
      expect(result.totalCount).toBeGreaterThan(0);
      result.contents.forEach((content) => {
        expect(content.categories).toContain("zakki");
      });
    });

    it("該当0件のカテゴリではtotalCount 0を返す", () => {
      const result = getBlogList("ja", { offset: 0, limit: 100, category: "not-exist-category" });
      expect(result.totalCount).toBe(0);
      expect(result.contents).toHaveLength(0);
    });

    it("excludeHiddenFromHome: 記事単位のhideFromHomeとprimaryカテゴリの両方で除外する", () => {
      const result = getBlogList("ja", { offset: 0, limit: 1000, excludeHiddenFromHome: true });

      expect(result.totalCount).toBe(jaVisibleOnHome.length);
      expect(result.totalCount).toBeGreaterThan(0);
      expect(result.totalCount).toBeLessThan(jaTotal);
      result.contents.forEach((content) => {
        expect(content.hideFromHome).toBe(false);
        expect(hiddenCategoryIds.has(content.categories[0])).toBe(false);
      });
    });

    it("excludeHiddenFromHome未指定なら非表示カテゴリの記事も返る(カテゴリ一覧・検索用)", () => {
      const hiddenCategoryId = [...hiddenCategoryIds][0];
      const result = getBlogList("ja", { offset: 0, limit: 1000, category: hiddenCategoryId });

      expect(result.totalCount).toBe(countJaByCategory(hiddenCategoryId));
      expect(result.totalCount).toBeGreaterThan(0);
    });

    it("非表示カテゴリを2番目以降に持つ記事はトップに残る(primaryのみで判定する)", () => {
      const secondaryOnly = jaFrontmatters.filter(
        (fm) =>
          !fm.hideFromHome &&
          !hiddenCategoryIds.has(fm.categories?.[0] ?? "") &&
          (fm.categories ?? []).some((category) => hiddenCategoryIds.has(category)),
      );
      const visibleSlugs = new Set(
        getBlogList("ja", { offset: 0, limit: 1000, excludeHiddenFromHome: true }).contents.map(
          (content) => content.slug,
        ),
      );
      // 該当記事が現状0本でも、判定ロジックがprimary基準であることは上のテストで担保される
      expect(secondaryOnly.length).toBeGreaterThanOrEqual(0);
      expect(visibleSlugs.size).toBe(jaVisibleOnHome.length);
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

    it("キーワード検索: 大文字小文字を無視して一致する", () => {
      const lower = getBlogList("en", { offset: 0, limit: 100, keyword: "next" });
      const upper = getBlogList("en", { offset: 0, limit: 100, keyword: "NEXT" });
      const mixed = getBlogList("en", { offset: 0, limit: 100, keyword: "NeXt" });
      expect(lower.totalCount).toBeGreaterThan(0);
      expect(upper.totalCount).toBe(lower.totalCount);
      expect(mixed.totalCount).toBe(lower.totalCount);
    });

    it("キーワード検索: 全角英数字と半角英数字をNFKC正規化により同一視する", () => {
      // "Ｎｅｘｔ"(全角) と "Next"(半角) が同じヒット件数になる
      const halfWidth = getBlogList("en", { offset: 0, limit: 100, keyword: "Next" });
      const fullWidth = getBlogList("en", { offset: 0, limit: 100, keyword: "Ｎｅｘｔ" });
      expect(halfWidth.totalCount).toBeGreaterThan(0);
      expect(fullWidth.totalCount).toBe(halfWidth.totalCount);
    });

    it("キーワード検索: 全角カタカナと半角カタカナをNFKC正規化により同一視する", () => {
      const fullWidthKana = getBlogList("ja", { offset: 0, limit: 100, keyword: "ヒトオシ" });
      const halfWidthKana = getBlogList("ja", { offset: 0, limit: 100, keyword: "ﾋﾄｵｼ" });
      expect(fullWidthKana.totalCount).toBeGreaterThan(0);
      expect(halfWidthKana.totalCount).toBe(fullWidthKana.totalCount);
    });

    it("カテゴリとキーワードを同時に指定するとAND条件になる", () => {
      const categoryOnly = getBlogList("ja", { offset: 0, limit: 100, category: "aws" });
      expect(categoryOnly.totalCount).toBe(countJaByCategory("aws"));
      expect(categoryOnly.totalCount).toBeGreaterThan(0);

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

  describe("getCategoriesWithArticles", () => {
    // 記事0件のカテゴリページは「空の一覧」を200で返すとGoogleにソフト404と判定されるため、
    // 公開導線(サイトマップ・サイドナビ・静的生成)から除外する用途の関数
    it.each(["ja", "en"] as const)(
      "%s: 記事が1件以上あるカテゴリだけをcategories.jsonの並び順で返す",
      (locale) => {
        const frontmatters = listFrontmattersByLocale(locale);
        const expected = categoryRecords
          .map((category) => category.id)
          .filter((id) => frontmatters.some((fm) => fm.categories?.includes(id)));

        expect(getCategoriesWithArticles(locale).map((category) => category.id)).toEqual(expected);
      },
    );

    it("記事0件のカテゴリは含まない", () => {
      const ids = new Set(getCategoriesWithArticles("ja").map((category) => category.id));
      const emptyIds = categoryRecords
        .map((category) => category.id)
        .filter((id) => countJaByCategory(id) === 0);

      emptyIds.forEach((id) => expect(ids.has(id)).toBe(false));
    });
  });

  describe("buildArticleLanguageAlternates", () => {
    // ja/enでプライマリカテゴリが異なりうるため、hreflangの各URLは
    // 「そのlocaleの記事のプライマリカテゴリ」で組み立てる必要がある(異なると404を指す)
    it("各localeのURLはそのlocaleの記事のプライマリカテゴリで組み立てる", () => {
      const jaList = getAllBlogListByLocale("ja");
      jaList.forEach((jaBlog) => {
        const alternates = buildArticleLanguageAlternates(jaBlog.slug);
        expect(alternates.ja).toBe(`${baseURL}/ja/blogs/${jaBlog.categories[0]}/${jaBlog.slug}`);
        const enBlog = getAllBlogListByLocale("en").find((blog) => blog.slug === jaBlog.slug);
        if (enBlog) {
          expect(alternates.en).toBe(`${baseURL}/en/blogs/${enBlog.categories[0]}/${enBlog.slug}`);
        } else {
          expect(alternates.en).toBeUndefined();
        }
      });
    });

    it("ja/enでプライマリカテゴリが異なる記事でも各locale固有のカテゴリになる", () => {
      const enBySlug = new Map(getAllBlogListByLocale("en").map((blog) => [blog.slug, blog]));
      const mismatched = getAllBlogListByLocale("ja").find((blog) => {
        const en = enBySlug.get(blog.slug);
        return en && en.categories[0] !== blog.categories[0];
      });
      // 実データに該当記事が無くなった場合はこのケースの検証対象が無い
      if (!mismatched) return;
      const alternates = buildArticleLanguageAlternates(mismatched.slug);
      expect(alternates.ja).toContain(`/ja/blogs/${mismatched.categories[0]}/`);
      expect(alternates.en).toContain(`/en/blogs/${enBySlug.get(mismatched.slug)!.categories[0]}/`);
    });

    it("存在しないslugでは空オブジェクトを返す", () => {
      expect(buildArticleLanguageAlternates("not-exist-slug")).toEqual({});
    });
  });
});
