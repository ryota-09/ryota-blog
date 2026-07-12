#!/usr/bin/env node
// Lighthouse計測ドライバー(エージェント用)
//
// 使い方(リポジトリルートから):
//   node .claude/skills/lighthouse-audit/measure.mjs [path|url ...] [flags]
//
// 引数:
//   path|url          計測対象。/ から始まるパスはローカル(port 3001)または--prod時に本番へ解決。
//                     省略時は /ja/blogs を計測する
// flags:
//   --prod            ローカルサーバーではなく https://ryotablog.jp を計測する
//   --desktop         desktop設定で計測(デフォルトはmobile。判断基準は常にmobile)
//   --all-categories  全カテゴリを計測(デフォルトはperformanceのみで高速)
//   --keep-server     計測後にローカルサーバーを終了しない(連続計測・DevToolsデバッグ用)
//
// 出力: 標準出力にスコア+コア指標+改善機会のサマリ、JSON全文は .lighthouseci/agent/ に保存

import { spawn, execFileSync } from "node:child_process";
import { existsSync, mkdirSync, cpSync, readFileSync } from "node:fs";

const PORT = 3001;
const LOCAL_ORIGIN = `http://localhost:${PORT}`;
const PROD_ORIGIN = "https://ryotablog.jp";
const OUT_DIR = ".lighthouseci/agent";

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const targets = args.filter((a) => !a.startsWith("--"));
if (targets.length === 0) targets.push("/ja/blogs");

const isProd = flags.has("--prod");
const isDesktop = flags.has("--desktop");
const allCategories = flags.has("--all-categories");
const keepServer = flags.has("--keep-server");

// ---- ローカルサーバー管理 -------------------------------------------------

const isServerUp = async () => {
  try {
    await fetch(`${LOCAL_ORIGIN}/`, { redirect: "manual" });
    return true;
  } catch {
    return false;
  }
};

let spawnedServer = null;

const ensureLocalServer = async () => {
  if (await isServerUp()) {
    console.log(`[server] port ${PORT} で既にサーバーが動作中。再利用する`);
    return;
  }
  if (!existsSync(".next/standalone/server.js")) {
    console.error(
      "[server] .next/standalone/server.js が無い。先に `npm run build` を実行すること"
    );
    process.exit(1);
  }
  // e2e:serve と同じ手順: standalone成果物にpublicとstaticをコピーしてから起動する
  cpSync("public", ".next/standalone/public", { recursive: true });
  cpSync(".next/static", ".next/standalone/.next/static", { recursive: true });
  spawnedServer = spawn("node", [".next/standalone/server.js"], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: "ignore",
  });
  for (let i = 0; i < 20; i++) {
    if (await isServerUp()) {
      console.log(`[server] standaloneサーバーを起動した (port ${PORT})`);
      return;
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.error("[server] 20秒待ってもサーバーが起動しない");
  process.exit(1);
};

const stopServer = () => {
  if (spawnedServer && !keepServer) {
    spawnedServer.kill("SIGTERM");
    console.log("[server] 起動したサーバーを停止した");
  } else if (spawnedServer) {
    console.log(`[server] --keep-server 指定のため port ${PORT} は起動したまま`);
  }
};

// ---- URL解決 ---------------------------------------------------------------

// リダイレクトチェーン(例: / → /ja → /ja/blogs)をLighthouseに計測させると
// リダイレクト分がLCPに乗って不当に悪化するため、最終URLに解決してから計測する
const resolveFinalUrl = async (target) => {
  const origin = isProd ? PROD_ORIGIN : LOCAL_ORIGIN;
  const url = target.startsWith("http") ? target : `${origin}${target}`;
  const res = await fetch(url, { redirect: "follow" });
  if (res.url !== url) {
    console.log(`[url] リダイレクト解決: ${url} → ${res.url}`);
  }
  if (!res.ok) {
    console.error(`[url] ${res.url} が ${res.status} を返した。計測をスキップ`);
    return null;
  }
  return res.url;
};

// ---- Lighthouse実行とサマリ -----------------------------------------------

// 本番とローカルの結果を上書きし合わないよう、本番は prod_ プレフィックスを付ける
const slugify = (url) => {
  const u = new URL(url);
  const path = u.pathname.replaceAll("/", "_").replace(/^_|_$/g, "") || "top";
  return (u.hostname === "localhost" ? "" : "prod_") + path;
};

const runLighthouse = (url) => {
  const outPath = `${OUT_DIR}/${slugify(url)}.${isDesktop ? "desktop" : "mobile"}.json`;
  const lhArgs = [
    "lighthouse",
    url,
    "--output=json",
    `--output-path=${outPath}`,
    '--chrome-flags=--headless=new',
    "--quiet",
  ];
  if (isDesktop) lhArgs.push("--preset=desktop");
  if (!allCategories) lhArgs.push("--only-categories=performance");
  execFileSync("npx", lhArgs, { stdio: ["ignore", "inherit", "inherit"] });
  return outPath;
};

const printSummary = (outPath, url) => {
  const r = JSON.parse(readFileSync(outPath, "utf8"));
  console.log(`\n=== ${url} [${r.configSettings.formFactor}] ===`);
  for (const [key, cat] of Object.entries(r.categories)) {
    console.log(`  ${key}: ${Math.round(cat.score * 100)}`);
  }
  const metrics = [
    "first-contentful-paint",
    "largest-contentful-paint",
    "cumulative-layout-shift",
    "total-blocking-time",
    "speed-index",
  ];
  for (const m of metrics) {
    const a = r.audits[m];
    if (a?.displayValue) console.log(`  ${m}: ${a.displayValue}`);
  }
  // LCP内訳(デバッグの起点として重要: TTFB/LoadDelay/LoadDuration/RenderDelayのどこが支配的か)
  // Lighthouse 13では旧 largest-contentful-paint-element ではなく lcp-breakdown-insight に入っている
  const breakdown = r.audits["lcp-breakdown-insight"]?.details?.items?.find(
    (i) => i.type === "table"
  )?.items;
  if (breakdown) {
    console.log("  LCP内訳:");
    for (const p of breakdown) {
      console.log(`    ${p.subpart}: ${Math.round(p.duration)} ms`);
    }
  }
  const lcpNode = r.audits["lcp-breakdown-insight"]?.details?.items?.find(
    (i) => i.type === "node"
  );
  if (lcpNode) console.log(`  LCP要素: ${lcpNode.selector}`);
  // 改善機会(推定削減量の大きい順)
  const opps = Object.values(r.audits)
    .filter((a) => a.details?.overallSavingsMs > 0 && a.score !== null && a.score < 1)
    .sort((a, b) => b.details.overallSavingsMs - a.details.overallSavingsMs)
    .slice(0, 5);
  if (opps.length) {
    console.log("  改善機会(推定削減ms):");
    for (const o of opps) {
      console.log(`    ${o.id}: ${Math.round(o.details.overallSavingsMs)} ms — ${o.title}`);
    }
  }
  console.log(`  JSON: ${outPath}`);
};

// ---- メイン -----------------------------------------------------------------

mkdirSync(OUT_DIR, { recursive: true });
if (!isProd) await ensureLocalServer();

try {
  for (const target of targets) {
    const url = await resolveFinalUrl(target);
    if (!url) continue;
    const outPath = runLighthouse(url);
    printSummary(outPath, url);
  }
} finally {
  stopServer();
}
