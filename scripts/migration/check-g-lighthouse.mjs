#!/usr/bin/env node
// G. Lighthouse(mobile、本番 vs stg、3ページ)
// npx lighthouse (CHROME_PATHにplaywrightのchromiumを指定)で、
// トップ(/ja)・一覧(/ja/blogs)・重い記事(/ja/blogs/zakki/best-buy-2026-first-half)を
// mobileプリセットで計測(各2回の中央値)。Performance score / LCP / CLS / TBT を比較する。

import { execFileSync } from "node:child_process";
import { writeFileSync, mkdtempSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";
import { REPO_ROOT, PRODUCTION_ORIGIN, STG_ORIGIN, sleep } from "./lib/common.mjs";

const OUTPUT_PATH = join(REPO_ROOT, ".parity/results/g-lighthouse.json");
const RUNS_PER_PAGE = process.env.LH_RUNS ? Number(process.env.LH_RUNS) : 2;

const PAGES = [
  { name: "top-ja", path: "/ja" },
  { name: "list-ja-blogs", path: "/ja/blogs" },
  { name: "article-heavy", path: "/ja/blogs/zakki/best-buy-2026-first-half" },
];

function median(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function runLighthouse(url, outJsonPath, chromePath) {
  execFileSync(
    "npx",
    [
      "lighthouse",
      url,
      "--output=json",
      `--output-path=${outJsonPath}`,
      "--preset=perf",
      "--form-factor=mobile",
      "--screenEmulation.mobile",
      "--screenEmulation.width=390",
      "--screenEmulation.height=844",
      "--screenEmulation.deviceScaleFactor=2",
      "--throttling-method=simulate",
      '--chrome-flags="--headless=new --no-sandbox"',
      "--quiet",
    ],
    {
      env: { ...process.env, CHROME_PATH: chromePath },
      stdio: ["ignore", "ignore", "pipe"],
      timeout: 120000,
    },
  );
}

async function measurePage(origin, path, chromePath, tmpDir, label) {
  const scores = [];
  for (let i = 0; i < RUNS_PER_PAGE; i++) {
    const url = `${origin}${path}`;
    const outPath = join(tmpDir, `${label}-${i}.json`);
    console.log(`  実行中: ${label} run${i + 1}/${RUNS_PER_PAGE} (${url})`);
    try {
      runLighthouse(url, outPath, chromePath);
      const report = JSON.parse(readFileSync(outPath, "utf-8"));
      const perfScore = report.categories?.performance?.score ?? null;
      const lcp = report.audits?.["largest-contentful-paint"]?.numericValue ?? null;
      const cls = report.audits?.["cumulative-layout-shift"]?.numericValue ?? null;
      const tbt = report.audits?.["total-blocking-time"]?.numericValue ?? null;
      scores.push({ perfScore, lcp, cls, tbt });
    } catch (error) {
      console.log(`    エラー: ${error.message?.slice(0, 300)}`);
      scores.push({ error: String(error.message || error).slice(0, 300) });
    }
    await sleep(1000);
  }
  const valid = scores.filter((s) => !s.error);
  if (valid.length === 0) return { error: "全実行が失敗", raw: scores };
  return {
    perfScoreMedian: median(valid.map((s) => s.perfScore)) * 100,
    lcpMedianMs: median(valid.map((s) => s.lcp)),
    clsMedian: median(valid.map((s) => s.cls)),
    tbtMedianMs: median(valid.map((s) => s.tbt)),
    runs: scores,
  };
}

async function main() {
  const chromePath = chromium.executablePath();
  console.log(`Chrome実行パス: ${chromePath}`);

  const tmpDir = mkdtempSync(join(tmpdir(), "lighthouse-parity-"));
  const results = [];

  try {
    for (const page of PAGES) {
      console.log(`\n--- ${page.name} (${page.path}) ---`);
      console.log("本番計測:");
      const prod = await measurePage(PRODUCTION_ORIGIN, page.path, chromePath, tmpDir, `prod-${page.name}`);
      console.log("stg計測:");
      const stg = await measurePage(STG_ORIGIN, page.path, chromePath, tmpDir, `stg-${page.name}`);

      const entry = { name: page.name, path: page.path, prod, stg };
      if (!prod.error && !stg.error) {
        entry.scoreDiff = stg.perfScoreMedian - prod.perfScoreMedian;
        entry.lcpDiffMs = stg.lcpMedianMs - prod.lcpMedianMs;
        entry.clsDiff = stg.clsMedian - prod.clsMedian;
        entry.tbtDiffMs = stg.tbtMedianMs - prod.tbtMedianMs;
        entry.judgement =
          entry.scoreDiff < -10 || entry.lcpDiffMs > 1000
            ? "FAIL(大幅悪化)"
            : "PASS";
      } else {
        entry.judgement = "計測失敗";
      }
      results.push(entry);

      console.log(`結果: prod score=${prod.perfScoreMedian ?? "N/A"} stg score=${stg.perfScoreMedian ?? "N/A"}`);
    }
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2), "utf-8");

  console.log(`\n=== G. Lighthouse比較結果 ===`);
  for (const r of results) {
    console.log(`\n${r.name} (${r.path}): ${r.judgement}`);
    if (!r.prod.error) {
      console.log(`  本番: score=${r.prod.perfScoreMedian?.toFixed(0)} LCP=${(r.prod.lcpMedianMs / 1000).toFixed(2)}s CLS=${r.prod.clsMedian?.toFixed(3)} TBT=${r.prod.tbtMedianMs?.toFixed(0)}ms`);
    }
    if (!r.stg.error) {
      console.log(`  stg : score=${r.stg.perfScoreMedian?.toFixed(0)} LCP=${(r.stg.lcpMedianMs / 1000).toFixed(2)}s CLS=${r.stg.clsMedian?.toFixed(3)} TBT=${r.stg.tbtMedianMs?.toFixed(0)}ms`);
    }
  }
  console.log(`\n詳細: ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
