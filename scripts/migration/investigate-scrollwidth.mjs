#!/usr/bin/env node
// F項目で発見した「記事詳細ページの横スクロール(scrollWidth超過)」について、
// 本番/stg双方でのscrollWidth超過量を全記事で比較調査する一時スクリプト。
import { writeFileSync } from "node:fs";
import { chromium } from "playwright";
import { PRODUCTION_ORIGIN, STG_ORIGIN, loadBlogs, loadCategoryMap, articlePath, sleep } from "./lib/common.mjs";

const VIEWPORT = { width: 390, height: 844 };

async function measureScrollWidth(context, origin, path) {
  const page = await context.newPage();
  try {
    await page.goto(`${origin}${path}`, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(1000);
    return await page.evaluate(() => ({
      scrollWidth: document.body.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
  } finally {
    await page.close();
  }
}

async function main() {
  const blogs = loadBlogs();
  const categoryMap = loadCategoryMap();
  const browser = await chromium.launch();
  const prodContext = await browser.newContext({ viewport: VIEWPORT });
  const stgContext = await browser.newContext({ viewport: VIEWPORT });

  const results = [];
  let i = 0;
  for (const blog of blogs) {
    i++;
    const path = articlePath(blog, categoryMap);
    const [prod, stg] = await Promise.all([
      measureScrollWidth(prodContext, PRODUCTION_ORIGIN, path).catch((e) => ({ error: String(e) })),
      measureScrollWidth(stgContext, STG_ORIGIN, path).catch((e) => ({ error: String(e) })),
    ]);
    results.push({ locale: blog.locale, slug: blog.slug, path, prod, stg });
    console.log(`[${i}/${blogs.length}] ${blog.locale}:${blog.slug} prod=${prod.scrollWidth} stg=${stg.scrollWidth}`);
    await sleep(150);
  }

  await browser.close();

  console.log("\n=== 横スクロール超過サマリ ===");
  const prodOverflow = results.filter((r) => r.prod.scrollWidth > r.prod.clientWidth);
  const stgOverflow = results.filter((r) => r.stg.scrollWidth > r.stg.clientWidth);
  const stgWorse = results.filter((r) => r.stg.scrollWidth > r.prod.scrollWidth + 5);
  console.log(`本番で横スクロールあり: ${prodOverflow.length}/${results.length}`);
  console.log(`stgで横スクロールあり: ${stgOverflow.length}/${results.length}`);
  console.log(`stgが本番より悪化: ${stgWorse.length}/${results.length}`);
  console.log("\n悪化記事一覧:");
  for (const r of stgWorse.sort((a, b) => b.stg.scrollWidth - a.stg.scrollWidth)) {
    console.log(`  ${r.locale}:${r.slug} prod=${r.prod.scrollWidth} stg=${r.stg.scrollWidth} (差=${r.stg.scrollWidth - r.prod.scrollWidth})`);
  }

  writeFileSync(
    "/Users/nakanishiryota/react-workspace/ryota-blog/.parity/results/scrollwidth-investigation.json",
    JSON.stringify(results, null, 2),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
