#!/usr/bin/env node
/**
 * 本番環境(https://ryotablog.jp)のsitemap/RSSフィード/llms.txtエンドポイントをfetchし、
 * scripts/migration/snapshots/{name}.snapshot として保存するスクリプト。
 *
 * #239(sitemap/RSS/llms.txt/OGP画像のデータソース差し替え)の前後比較材料として使う。
 * 存在しないURL（404等）もステータス込みで記録し、差分比較(#242)の基準にする。
 *
 * - Node.js 18+ のグローバル fetch のみを使用（新規npm依存なし）
 * - 本番への書き込みは一切行わない（GETのみ）
 *
 * 使い方:
 *   node scripts/migration/snapshot-endpoints.mjs
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SNAPSHOT_DIR = join(__dirname, "snapshots");

const PRODUCTION_ORIGIN = "https://ryotablog.jp";

// name: 保存ファイル名(拡張子除く), path: 取得対象のパス
const TARGETS = [
  { name: "sitemap", path: "/sitemap.xml" },
  { name: "feed", path: "/feed" },
  { name: "ja-feed", path: "/ja/feed" },
  { name: "en-feed", path: "/en/feed" },
  { name: "llms-txt", path: "/docs/llms.txt" },
  { name: "ja-llms-txt", path: "/ja/docs/llms.txt" },
  { name: "en-llms-txt", path: "/en/docs/llms.txt" },
];

/**
 * 1エンドポイントをfetchし、ステータス・ヘッダー・本文をまとめたスナップショット文字列を作る。
 * 404等のエラーレスポンスも「存在しない」という事実として記録する。
 */
async function fetchSnapshot(path) {
  const url = `${PRODUCTION_ORIGIN}${path}`;
  try {
    const res = await fetch(url, { redirect: "manual" });
    const body = await res.text();
    const headerLines = [...res.headers.entries()]
      .filter(([key]) => key.toLowerCase() !== "date") // 日時ヘッダーは実行のたびに変わるため除外
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    return [
      `# URL: ${url}`,
      `# Status: ${res.status}`,
      `# Headers:`,
      headerLines,
      `# Body:`,
      body,
    ].join("\n");
  } catch (error) {
    return [`# URL: ${url}`, `# Error: ${error instanceof Error ? error.message : String(error)}`].join(
      "\n",
    );
  }
}

async function main() {
  if (!existsSync(SNAPSHOT_DIR)) {
    mkdirSync(SNAPSHOT_DIR, { recursive: true });
  }

  for (const { name, path } of TARGETS) {
    console.log(`Fetching ${PRODUCTION_ORIGIN}${path} ...`);
    const snapshot = await fetchSnapshot(path);
    const outputPath = join(SNAPSHOT_DIR, `${name}.snapshot`);
    writeFileSync(outputPath, snapshot, "utf-8");
    console.log(`  -> saved to ${outputPath}`);
  }

  console.log("done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
