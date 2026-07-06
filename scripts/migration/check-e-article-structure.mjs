#!/usr/bin/env node
// E. 記事コンテンツの構造検証(stg、全60記事)
// 各記事ページをPlaywright(chromium)で実レンダリングし、以下を検証する:
//   1. 見出しid(id="h...")がTOCリンク(href="#h...")と対応して存在するか
//   2. images.microcms-assets.io への参照がゼロであるか
//   3. 埋め込み(msmaflink div、AmazonLink、react-tweet、LinkCard)のDOM存在確認
// 60記事全件の実測値を集計してレポートする。
//
// NOTE: msmaflink(もしもアフィリエイト)ウィジェットは外部bundle.jsがload後に非同期描画するため、
//       単純なHTTP fetchの生HTMLでは検出できない(RSCペイロード内の未展開JSON文字列のみ存在)。
//       そのため実ブラウザでload完了+少し待機した後のDOMを見る必要がある。

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import { REPO_ROOT, STG_ORIGIN, loadBlogs, loadCategoryMap, articlePath } from "./lib/common.mjs";

const OUTPUT_PATH = join(REPO_ROOT, ".parity/results/e-article-structure.json");
const CONCURRENCY = 4;
const POST_LOAD_WAIT_MS = 2000; // moshimoウィジェット等の非同期描画を待つ

// NOTE: page.content()(シリアライズされたHTML文字列)にはNext.jsのRSCフライトデータ
// (<script>self.__next_f.push(...)</script>、未使用のJSON文字列)が含まれており、
// 正規表現でこの文字列に対して走査すると実際の描画要素数の2倍にカウントされてしまう。
// そのため実DOM(document.querySelectorAll)を直接評価し、正確な件数を取得する。
async function analyzeRenderedPage(page) {
  return page.evaluate(() => {
    const headingIds = [...new Set([...document.querySelectorAll('[id^="h"]')].map((el) => el.id))].filter(
      (id) => /^h[0-9a-f]{6,}$/.test(id),
    );
    const tocHrefs = [
      ...new Set(
        [...document.querySelectorAll('a[href^="#h"]')]
          .map((el) => el.getAttribute("href").slice(1))
          .filter((id) => /^h[0-9a-f]{6,}$/.test(id)),
      ),
    ];
    const tocHrefsWithoutHeading = tocHrefs.filter((id) => !headingIds.includes(id));
    const headingsWithoutToc = headingIds.filter((id) => !tocHrefs.includes(id));

    // microCMS画像参照(img src / next/image srcset等すべて)
    const microcmsAssetRefs = [...document.querySelectorAll("img")].filter((img) =>
      (img.src || "").includes("images.microcms-assets.io") || (img.srcset || "").includes("images.microcms-assets.io"),
    ).length;

    // msmaflink: もしもアフィリエイトウィジェットの親div(id="msmaflink-XXXXX-N")
    const msmaflinkCount = document.querySelectorAll('[id^="msmaflink-"]').length;

    // AmazonLink: aside > a.after:content-['Amazon'] を持つ特徴的なリンクカード
    const amazonLinkCount = [...document.querySelectorAll("aside")].filter((aside) => {
      const a = aside.querySelector("a");
      return a && a.className.includes("after:content-['Amazon']");
    }).length;

    // react-tweet: react-tweetライブラリの最終描画ルート要素
    const reactTweetCount = document.querySelectorAll(".react-tweet-theme").length;

    // LinkCard: OGPカードの特徴的な高さクラスの組み合わせを持つaside
    const linkCardCount = [...document.querySelectorAll("aside")].filter((aside) =>
      aside.className.includes("h-[90px]"),
    ).length;

    return {
      headingIdCount: headingIds.length,
      tocHrefCount: tocHrefs.length,
      tocHrefsWithoutHeading,
      headingsWithoutToc,
      tocMatchesHeadings: tocHrefsWithoutHeading.length === 0,
      microcmsAssetRefs,
      msmaflinkCount,
      amazonLinkCount,
      reactTweetCount,
      linkCardCount,
    };
  });
}

async function runPool(items, worker, concurrency) {
  const results = new Array(items.length);
  let cursor = 0;
  async function runner() {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, runner));
  return results;
}

async function main() {
  const blogs = loadBlogs();
  const categoryMap = loadCategoryMap();
  console.log(`対象記事数: ${blogs.length}`);

  const browser = await chromium.launch();
  let processed = 0;

  try {
    const contexts = await Promise.all(
      Array.from({ length: CONCURRENCY }, () => browser.newContext({ viewport: { width: 390, height: 844 } })),
    );

    const results = await runPool(
      blogs,
      async (blog, i) => {
        const context = contexts[i % CONCURRENCY];
        const path = articlePath(blog, categoryMap);
        const url = `${STG_ORIGIN}${path}`;
        let entry;
        const page = await context.newPage();
        try {
          const res = await page.goto(url, { waitUntil: "load", timeout: 45000 });
          await page.waitForTimeout(POST_LOAD_WAIT_MS);
          const status = res?.status() ?? null;
          const analysis = status === 200 ? await analyzeRenderedPage(page) : null;
          entry = {
            locale: blog.locale,
            slug: blog.slug,
            path,
            status,
            expectedHeadingCount: blog.headingIds?.length ?? 0,
            expectedMoshimoWidgets: blog.moshimoWidgets?.length ?? 0,
            ...analysis,
          };
        } catch (error) {
          entry = { locale: blog.locale, slug: blog.slug, path, status: null, error: String(error) };
        } finally {
          await page.close();
        }
        processed++;
        if (processed % 10 === 0 || processed === blogs.length) {
          console.log(`  ${processed}/${blogs.length} 完了`);
        }
        return entry;
      },
      CONCURRENCY,
    );

    await Promise.all(contexts.map((c) => c.close()));

    // 集計
    const errorEntries = results.filter((r) => r.status !== 200);
    const microcmsAssetLeaks = results.filter((r) => r.microcmsAssetRefs > 0);
    const tocMismatches = results.filter((r) => r.tocMatchesHeadings === false);
    const msmaflinkByLocale = { ja: 0, en: 0 };
    for (const r of results) {
      if (r.msmaflinkCount) msmaflinkByLocale[r.locale] = (msmaflinkByLocale[r.locale] || 0) + r.msmaflinkCount;
    }
    const totalMsmaflink = msmaflinkByLocale.ja + msmaflinkByLocale.en;
    const articlesWithMsmaflink = results.filter((r) => r.msmaflinkCount > 0);
    const articlesWithAmazonLink = results.filter((r) => r.amazonLinkCount > 0);
    const articlesWithReactTweet = results.filter((r) => r.reactTweetCount > 0);
    const articlesWithLinkCard = results.filter((r) => r.linkCardCount > 0);
    const articlesWithHeadings = results.filter((r) => (r.headingIdCount || 0) > 0);

    const summary = {
      generatedAt: new Date().toISOString(),
      totalArticles: results.length,
      httpErrors: errorEntries.length,
      microcmsAssetLeakCount: microcmsAssetLeaks.length,
      tocMismatchCount: tocMismatches.length,
      articlesWithHeadingIdsCount: articlesWithHeadings.length,
      msmaflink: {
        totalWidgetCount: totalMsmaflink,
        byLocale: msmaflinkByLocale,
        articlesWithMsmaflinkCount: articlesWithMsmaflink.length,
        articles: articlesWithMsmaflink.map((r) => `${r.locale}:${r.slug}(${r.msmaflinkCount})`),
      },
      amazonLink: {
        articlesCount: articlesWithAmazonLink.length,
        articles: articlesWithAmazonLink.map((r) => `${r.locale}:${r.slug}(${r.amazonLinkCount})`),
      },
      reactTweet: {
        articlesCount: articlesWithReactTweet.length,
        articles: articlesWithReactTweet.map((r) => `${r.locale}:${r.slug}(${r.reactTweetCount})`),
      },
      linkCard: {
        articlesCount: articlesWithLinkCard.length,
        articles: articlesWithLinkCard.map((r) => `${r.locale}:${r.slug}(${r.linkCardCount})`),
      },
    };

    writeFileSync(OUTPUT_PATH, JSON.stringify({ summary, results }, null, 2), "utf-8");

    console.log(`\n=== E. 記事コンテンツの構造検証結果 ===`);
    console.log(`総記事数: ${summary.totalArticles}`);
    console.log(`HTTPエラー: ${summary.httpErrors}`);
    console.log(`microCMS画像参照リーク: ${summary.microcmsAssetLeakCount}`);
    console.log(`TOC/見出しid不一致: ${summary.tocMismatchCount}`);
    console.log(`見出しid保持記事数: ${summary.articlesWithHeadingIdsCount}`);
    console.log(
      `msmaflink: 総数=${summary.msmaflink.totalWidgetCount} ja=${summary.msmaflink.byLocale.ja || 0} en=${summary.msmaflink.byLocale.en || 0} 保持記事数=${summary.msmaflink.articlesWithMsmaflinkCount}`,
    );
    console.log(`  記事: ${JSON.stringify(summary.msmaflink.articles)}`);
    console.log(`AmazonLink保持記事数: ${summary.amazonLink.articlesCount} -> ${JSON.stringify(summary.amazonLink.articles)}`);
    console.log(`react-tweet保持記事数: ${summary.reactTweet.articlesCount} -> ${JSON.stringify(summary.reactTweet.articles)}`);
    console.log(`LinkCard保持記事数: ${summary.linkCard.articlesCount} -> ${JSON.stringify(summary.linkCard.articles)}`);

    if (errorEntries.length > 0) {
      console.log(`\nHTTPエラー詳細:`);
      for (const e of errorEntries) console.log(`  ${e.locale}:${e.slug} status=${e.status} ${e.error ?? ""}`);
    }
    if (microcmsAssetLeaks.length > 0) {
      console.log(`\nmicroCMS画像参照リーク詳細:`);
      for (const e of microcmsAssetLeaks) console.log(`  ${e.locale}:${e.slug} refs=${e.microcmsAssetRefs}`);
    }
    if (tocMismatches.length > 0) {
      console.log(`\nTOC/見出しid不一致詳細:`);
      for (const e of tocMismatches) {
        console.log(`  ${e.locale}:${e.slug} tocHrefsWithoutHeading=${JSON.stringify(e.tocHrefsWithoutHeading)}`);
      }
    }

    console.log(`\n詳細: ${OUTPUT_PATH}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
