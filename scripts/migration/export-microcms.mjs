#!/usr/bin/env node
/**
 * microCMSの全コンテンツ（blogs / blogs_en / categories）と、
 * それらが参照する画像アセットをローカルにバックアップするスクリプト。
 *
 * - Node.js 18+ のグローバル fetch のみを使用（新規npm依存なし）
 * - 出力先: .backup/microcms/
 *
 * 使い方:
 *   node scripts/migration/export-microcms.mjs
 */

import { readFileSync, existsSync, mkdirSync, writeFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const BACKUP_DIR = join(REPO_ROOT, ".backup", "microcms");
const ASSETS_DIR = join(BACKUP_DIR, "assets");

const ENDPOINTS = ["blogs", "blogs_en", "categories"];

/**
 * .env.local をシンプルな行パースで読み込み、環境変数オブジェクトを返す。
 * dotenv 等のライブラリは使わず、KEY=value 形式のみサポートする。
 * 値はクォート(" or ')で囲まれている場合は除去する。
 */
function loadEnvLocal() {
  const envPath = join(REPO_ROOT, ".env.local");
  if (!existsSync(envPath)) {
    throw new Error(`.env.local が見つかりません: ${envPath}`);
  }

  const content = readFileSync(envPath, "utf-8");
  const env = {};

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    // 空行・コメント行はスキップ
    if (!line || line.startsWith("#")) continue;

    const eqIndex = line.indexOf("=");
    if (eqIndex === -1) continue;

    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();

    // 前後のクォートを除去
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

/**
 * 指定エンドポイントの全件を offset ページネーションで取得する。
 */
async function fetchAllContents({ serviceDomain, apiKey, endpoint }) {
  const limit = 100;
  let offset = 0;
  let totalCount = Infinity;
  const contents = [];

  while (offset < totalCount) {
    const url = `https://${serviceDomain}.microcms.io/api/v1/${endpoint}?limit=${limit}&offset=${offset}`;
    const res = await fetch(url, {
      headers: { "X-MICROCMS-API-KEY": apiKey },
    });

    if (!res.ok) {
      throw new Error(
        `microCMS API取得に失敗しました: endpoint=${endpoint} status=${res.status} ${res.statusText}`,
      );
    }

    const data = await res.json();
    contents.push(...(data.contents ?? []));
    totalCount = data.totalCount ?? contents.length;
    offset += limit;
  }

  return { contents, totalCount };
}

/**
 * JSON文字列群から microcms-assets.io の画像URLを抽出し、重複排除して返す。
 * JSON.stringify によって "/" が "\/" にエスケープされている可能性があるため、
 * 抽出前に "\/" -> "/" へ置換しておく。
 */
function extractAssetUrls(jsonStrings) {
  const urlSet = new Set();
  // URL末尾の `"` や `?クエリ` 、エスケープの残骸である `\` を含めないようにマッチさせる
  const pattern = /https:\/\/images\.microcms-assets\.io\/assets\/[^\s"'?\\]+/g;

  for (const jsonString of jsonStrings) {
    const normalized = jsonString.replace(/\\\//g, "/");
    const matches = normalized.match(pattern);
    if (matches) {
      for (const match of matches) {
        urlSet.add(match);
      }
    }
  }

  return Array.from(urlSet);
}

/**
 * 画像アセットURLから serviceId / assetId / filename を抽出する。
 * URL形式: https://images.microcms-assets.io/assets/{serviceId}/{assetId}/{filename}
 */
function parseAssetUrl(url) {
  const path = url.replace("https://images.microcms-assets.io/assets/", "");
  const parts = path.split("/");
  if (parts.length < 3) {
    return null;
  }
  const [serviceId, assetId, ...rest] = parts;
  const filename = decodeURIComponent(rest.join("/"));
  return { serviceId, assetId, filename };
}

/**
 * 単一アセットをダウンロードして保存する。
 * 既にサイズ>0で存在する場合はスキップ（冪等性担保）。
 */
async function downloadAsset(url) {
  const parsed = parseAssetUrl(url);
  if (!parsed) {
    return { url, ok: false, error: "URLの形式が不正です", bytes: 0, path: null };
  }

  const { assetId, filename } = parsed;
  const assetDir = join(ASSETS_DIR, assetId);
  const filePath = join(assetDir, filename);

  if (existsSync(filePath)) {
    const stat = statSync(filePath);
    if (stat.size > 0) {
      return {
        url,
        ok: true,
        skipped: true,
        bytes: stat.size,
        path: relative(BACKUP_DIR, filePath),
      };
    }
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return { url, ok: false, error: `status=${res.status}`, bytes: 0, path: null };
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    mkdirSync(assetDir, { recursive: true });
    writeFileSync(filePath, buffer);
    return {
      url,
      ok: true,
      skipped: false,
      bytes: buffer.byteLength,
      path: relative(BACKUP_DIR, filePath),
    };
  } catch (err) {
    return { url, ok: false, error: String(err), bytes: 0, path: null };
  }
}

async function main() {
  const env = loadEnvLocal();
  const serviceDomain = env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = env.MICROCMS_API_KEY;

  if (!serviceDomain || !apiKey) {
    throw new Error(
      ".env.local に MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY が見つかりません",
    );
  }

  mkdirSync(BACKUP_DIR, { recursive: true });
  mkdirSync(ASSETS_DIR, { recursive: true });

  console.log("=== microCMS コンテンツ取得開始 ===");

  const counts = {};
  const jsonStrings = [];

  for (const endpoint of ENDPOINTS) {
    process.stdout.write(`- ${endpoint} を取得中...`);
    const { contents, totalCount } = await fetchAllContents({
      serviceDomain,
      apiKey,
      endpoint,
    });
    console.log(` 完了 (${contents.length}/${totalCount}件)`);

    counts[endpoint] = contents.length;

    const jsonString = JSON.stringify(contents, null, 2);
    jsonStrings.push(jsonString);
    writeFileSync(join(BACKUP_DIR, `${endpoint}.json`), jsonString);
  }

  console.log("\n=== 画像アセット抽出・ダウンロード開始 ===");
  const assetUrls = extractAssetUrls(jsonStrings);
  console.log(`検出したユニークアセットURL数: ${assetUrls.length}`);

  const results = [];
  let doneCount = 0;
  for (const url of assetUrls) {
    const result = await downloadAsset(url);
    results.push(result);
    doneCount += 1;
    if (doneCount % 10 === 0 || doneCount === assetUrls.length) {
      process.stdout.write(`  ダウンロード進捗: ${doneCount}/${assetUrls.length}\r`);
    }
  }
  console.log("");

  const failures = results.filter((r) => !r.ok);
  const successes = results.filter((r) => r.ok);
  const totalBytes = successes.reduce((sum, r) => sum + r.bytes, 0);

  // マニフェスト作成
  const manifest = {
    exportedAt: new Date().toISOString(),
    counts: {
      blogs: counts.blogs ?? 0,
      blogs_en: counts.blogs_en ?? 0,
      categories: counts.categories ?? 0,
      assets: successes.length,
    },
    assets: successes.map((r) => ({
      url: r.url,
      path: r.path,
      bytes: r.bytes,
    })),
  };
  writeFileSync(
    join(BACKUP_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );

  // サマリ出力
  console.log("\n=== サマリ ===");
  console.log(`blogs: ${counts.blogs ?? 0}件`);
  console.log(`blogs_en: ${counts.blogs_en ?? 0}件`);
  console.log(`categories: ${counts.categories ?? 0}件`);
  console.log(`assets: ${successes.length}件 (失敗 ${failures.length}件)`);
  console.log(`合計サイズ: ${totalBytes.toLocaleString()} bytes (${(totalBytes / 1024 / 1024).toFixed(2)} MB)`);

  if (failures.length > 0) {
    console.error("\n=== ダウンロード失敗一覧 ===");
    for (const f of failures) {
      console.error(`  ${f.url} (${f.error})`);
    }
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("エクスポート処理でエラーが発生しました:", err.message);
  process.exitCode = 1;
});
