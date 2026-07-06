#!/usr/bin/env node
// A. URL網羅チェック(stg)
// 本番sitemapスナップショットの全URL(118件)をstgドメインに置換してGETし、
// 200(またはリダイレクト後200)であることを確認する。
// 追加で feed/llms.txt/ブログ一覧のページング/検索/robots.txt/sitemap.xml も確認する。

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  REPO_ROOT,
  STG_ORIGIN,
  PRODUCTION_ORIGIN,
  fetchFollow,
  parseSnapshot,
  sleep,
} from "./lib/common.mjs";

const SNAPSHOT_PATH = join(REPO_ROOT, "scripts/migration/snapshots/sitemap.snapshot");
const OUTPUT_PATH = join(REPO_ROOT, ".parity/results/a-url-coverage.json");

const EXTRA_PATHS = [
  "/feed",
  "/ja/feed",
  "/en/feed",
  "/docs/llms.txt",
  "/ja/docs/llms.txt",
  "/en/docs/llms.txt",
  "/ja/blogs/page/2",
  "/ja/blogs?keyword=Next",
  "/robots.txt",
  "/sitemap.xml",
];

function extractUrls(sitemapBody) {
  const matches = [...sitemapBody.matchAll(/<loc>(.*?)<\/loc>/g)];
  return matches.map((m) => m[1]);
}

async function main() {
  const raw = readFileSync(SNAPSHOT_PATH, "utf-8");
  const { body } = parseSnapshot(raw);
  const urls = extractUrls(body);
  console.log(`sitemapから抽出したURL数: ${urls.length}`);

  const targets = [
    ...urls.map((u) => u.replace(PRODUCTION_ORIGIN, STG_ORIGIN)),
    ...EXTRA_PATHS.map((p) => `${STG_ORIGIN}${p}`),
  ];

  const results = [];
  let okCount = 0;
  let ngCount = 0;

  for (const [i, url] of targets.entries()) {
    try {
      const { status, finalUrl, redirectChain } = await fetchFollow(url);
      const ok = status >= 200 && status < 300;
      if (ok) okCount++;
      else ngCount++;
      results.push({ url, status, finalUrl, redirectChain, ok });
      console.log(`[${i + 1}/${targets.length}] ${status} ${ok ? "OK" : "NG"} ${url}${finalUrl !== url ? ` -> ${finalUrl}` : ""}`);
    } catch (error) {
      ngCount++;
      results.push({ url, status: null, error: String(error), ok: false });
      console.log(`[${i + 1}/${targets.length}] ERROR ${url}: ${error}`);
    }
    // stgへの負荷軽減のため軽くウェイトを挟む
    await sleep(80);
  }

  const summary = {
    total: targets.length,
    ok: okCount,
    ng: ngCount,
    generatedAt: new Date().toISOString(),
    results,
  };
  writeFileSync(OUTPUT_PATH, JSON.stringify(summary, null, 2), "utf-8");
  console.log(`\n=== A. URL網羅チェック結果 ===`);
  console.log(`total=${summary.total} ok=${summary.ok} ng=${summary.ng}`);
  console.log(`詳細: ${OUTPUT_PATH}`);
  if (ngCount > 0) {
    console.log("\nNG一覧:");
    for (const r of results.filter((r) => !r.ok)) {
      console.log(`  ${r.status ?? "ERR"} ${r.url}`);
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
