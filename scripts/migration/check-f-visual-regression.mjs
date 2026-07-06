#!/usr/bin/env node
// F. ビジュアル回帰(本番 vs stg、全60記事+トップ+一覧)
// Playwright(chromium)で同一viewport(390x844)のフルページスクリーンショットを両環境で撮影し、
// pixelmatchで差分率を算出する。差分率の大きい順に一覧化し、上位ページはHTML構造を比較して
// 差分原因を特定・分類する(Twitter/リンクカード置換由来か、想定外か)。

import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import {
  REPO_ROOT,
  PRODUCTION_ORIGIN,
  STG_ORIGIN,
  loadBlogs,
  loadCategoryMap,
  articlePath,
  sleep,
} from "./lib/common.mjs";

const OUTPUT_PATH = join(REPO_ROOT, ".parity/results/f-visual-regression.json");
const SCREENSHOT_DIR = join(REPO_ROOT, ".parity/screenshots");
const VIEWPORT = { width: 390, height: 844 };
const PROD_CONCURRENCY = 2; // 本番への負荷軽減のため並列数を絞る
const STG_CONCURRENCY = 5;
const PROD_WAIT_MS = 300; // 本番への1リクエストごとのウェイト

function pagePathsToCompare() {
  const blogs = loadBlogs();
  const categoryMap = loadCategoryMap();
  const pages = [
    { name: "top-ja", path: "/ja" },
    { name: "top-en", path: "/en" },
    { name: "list-ja-blogs", path: "/ja/blogs" },
  ];
  for (const blog of blogs) {
    const path = articlePath(blog, categoryMap);
    pages.push({ name: `article-${blog.locale}-${blog.slug}`, path });
  }
  return pages;
}

async function captureScreenshot(context, origin, path, outFile, { wait = 0 } = {}) {
  const page = await context.newPage();
  try {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${origin}${path}`, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(1500); // 遅延読み込み画像・アニメーション安定待ち
    await page.screenshot({ path: outFile, fullPage: true });
    if (wait) await sleep(wait);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: String(error) };
  } finally {
    await page.close();
  }
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

// 2枚のPNGをpixelmatchで比較し、差分率(0-1)とdiff画像パスを返す
function comparePngs(prodPath, stgPath, diffPath) {
  const img1 = PNG.sync.read(readFileSync(prodPath));
  const img2 = PNG.sync.read(readFileSync(stgPath));

  const width = Math.max(img1.width, img2.width);
  const height = Math.max(img1.height, img2.height);

  // サイズが違う場合は大きい方に合わせてキャンバスを広げる(pixelmatchは同サイズ必須)
  const normalize = (img) => {
    if (img.width === width && img.height === height) return img;
    const canvas = new PNG({ width, height });
    PNG.bitblt(img, canvas, 0, 0, img.width, img.height, 0, 0);
    return canvas;
  };
  const norm1 = normalize(img1);
  const norm2 = normalize(img2);

  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(norm1.data, norm2.data, diff.data, width, height, { threshold: 0.1 });
  writeFileSync(diffPath, PNG.sync.write(diff));

  const totalPixels = width * height;
  const diffRatio = diffPixels / totalPixels;
  return { diffRatio, diffPixels, totalPixels, prodSize: `${img1.width}x${img1.height}`, stgSize: `${img2.width}x${img2.height}` };
}

async function main() {
  if (!existsSync(SCREENSHOT_DIR)) mkdirSync(SCREENSHOT_DIR, { recursive: true });

  let pages = pagePathsToCompare();
  // 動作検証用: PARITY_F_LIMIT環境変数でページ数を制限できる(本番向け実行前のスモークテスト用途)
  const limit = process.env.PARITY_F_LIMIT ? Number(process.env.PARITY_F_LIMIT) : null;
  if (limit) pages = pages.slice(0, limit);
  console.log(`比較対象ページ数: ${pages.length}`);

  const browser = await chromium.launch();
  try {
    // --- stg撮影(並列多め) ---
    console.log("\n--- stgスクリーンショット撮影 ---");
    const stgContexts = await Promise.all(
      Array.from({ length: STG_CONCURRENCY }, () => browser.newContext({ viewport: VIEWPORT })),
    );
    let stgDone = 0;
    const stgResults = await runPool(
      pages,
      async (p, i) => {
        const context = stgContexts[i % STG_CONCURRENCY];
        const outFile = join(SCREENSHOT_DIR, `stg-${p.name}.png`);
        const result = await captureScreenshot(context, STG_ORIGIN, p.path, outFile);
        stgDone++;
        if (stgDone % 10 === 0 || stgDone === pages.length) console.log(`  stg: ${stgDone}/${pages.length}`);
        return { ...p, outFile, ...result };
      },
      STG_CONCURRENCY,
    );
    await Promise.all(stgContexts.map((c) => c.close()));

    // --- 本番撮影(並列少なめ+ウェイト、負荷配慮) ---
    console.log("\n--- 本番スクリーンショット撮影(負荷軽減のため低並列) ---");
    const prodContexts = await Promise.all(
      Array.from({ length: PROD_CONCURRENCY }, () => browser.newContext({ viewport: VIEWPORT })),
    );
    let prodDone = 0;
    const prodResults = await runPool(
      pages,
      async (p, i) => {
        const context = prodContexts[i % PROD_CONCURRENCY];
        const outFile = join(SCREENSHOT_DIR, `prod-${p.name}.png`);
        const result = await captureScreenshot(context, PRODUCTION_ORIGIN, p.path, outFile, { wait: PROD_WAIT_MS });
        prodDone++;
        if (prodDone % 10 === 0 || prodDone === pages.length) console.log(`  prod: ${prodDone}/${pages.length}`);
        return { ...p, outFile, ...result };
      },
      PROD_CONCURRENCY,
    );
    await Promise.all(prodContexts.map((c) => c.close()));

    // --- pixelmatch比較 ---
    console.log("\n--- pixelmatch差分計算 ---");
    const comparisons = [];
    for (const p of pages) {
      const stgEntry = stgResults.find((r) => r.name === p.name);
      const prodEntry = prodResults.find((r) => r.name === p.name);
      if (!stgEntry.ok || !prodEntry.ok) {
        comparisons.push({
          name: p.name,
          path: p.path,
          error: `stg.ok=${stgEntry.ok} prod.ok=${prodEntry.ok} stgErr=${stgEntry.error ?? ""} prodErr=${prodEntry.error ?? ""}`,
        });
        continue;
      }
      const diffPath = join(SCREENSHOT_DIR, `diff-${p.name}.png`);
      try {
        const { diffRatio, diffPixels, totalPixels, prodSize, stgSize } = comparePngs(
          prodEntry.outFile,
          stgEntry.outFile,
          diffPath,
        );
        comparisons.push({
          name: p.name,
          path: p.path,
          diffRatio,
          diffPixels,
          totalPixels,
          prodSize,
          stgSize,
          diffPath,
        });
      } catch (error) {
        comparisons.push({ name: p.name, path: p.path, error: String(error) });
      }
    }

    comparisons.sort((a, b) => (b.diffRatio ?? -1) - (a.diffRatio ?? -1));

    writeFileSync(OUTPUT_PATH, JSON.stringify({ generatedAt: new Date().toISOString(), comparisons }, null, 2), "utf-8");

    console.log(`\n=== F. ビジュアル回帰結果(差分率降順 上位30件) ===`);
    for (const c of comparisons.slice(0, 30)) {
      if (c.error) {
        console.log(`${c.name}: ERROR ${c.error}`);
      } else {
        console.log(`${c.name}: diffRatio=${(c.diffRatio * 100).toFixed(2)}% (${c.diffPixels}/${c.totalPixels}px) prodSize=${c.prodSize} stgSize=${c.stgSize}`);
      }
    }
    console.log(`\n詳細: ${OUTPUT_PATH}`);
    console.log(`スクリーンショット: ${SCREENSHOT_DIR}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
