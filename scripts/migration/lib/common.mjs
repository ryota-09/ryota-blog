// 移行前後パリティ検証(#242)で使う共通ユーティリティ。
// 本番(旧実装)とstg(新実装)へのfetch、URL正規化、記事メタデータ取得などをまとめる。

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = join(__dirname, "..", "..", "..");

export const PRODUCTION_ORIGIN = "https://ryotablog.jp";
export const STG_ORIGIN = "https://ryota-blog-stg.ryota09dev.workers.dev";

// Veliteのビルド生成物(.velite/*.json)から記事メタデータを読み込む。
// 事前に `NODE_ENV=development npx velite build` 済みであることが前提。
export function loadBlogs() {
  const path = join(REPO_ROOT, ".velite", "blogs.json");
  return JSON.parse(readFileSync(path, "utf-8"));
}

export function loadCategoryMap() {
  const path = join(REPO_ROOT, ".velite", "category-map.json");
  return JSON.parse(readFileSync(path, "utf-8"));
}

export function loadCategories() {
  const path = join(REPO_ROOT, ".velite", "categories.json");
  return JSON.parse(readFileSync(path, "utf-8"));
}

// 記事のカテゴリID(URLパス用)を解決する。複数カテゴリがある場合は先頭を採用。
export function resolveArticleCategoryId(blog, categoryMap) {
  const localeMap = categoryMap[blog.locale] ?? categoryMap.ja;
  return localeMap[blog.slug] ?? blog.categories?.[0];
}

export function articlePath(blog, categoryMap) {
  const categoryId = resolveArticleCategoryId(blog, categoryMap);
  return `/${blog.locale}/blogs/${categoryId}/${blog.slug}`;
}

// 指定ミリ秒待つ(サーバー負荷軽減のためのウェイト用)
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// GETリクエストを送りステータス・ヘッダー・本文を返す。リダイレクトは手動追跡(最大5回)。
export async function fetchFollow(url, { maxRedirects = 5, timeoutMs = 20000 } = {}) {
  let currentUrl = url;
  const redirectChain = [];
  for (let i = 0; i <= maxRedirects; i++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    let res;
    try {
      res = await fetch(currentUrl, { redirect: "manual", signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      const location = new URL(res.headers.get("location"), currentUrl).toString();
      redirectChain.push({ from: currentUrl, to: location, status: res.status });
      currentUrl = location;
      continue;
    }
    const body = await res.text();
    return { status: res.status, headers: res.headers, body, finalUrl: currentUrl, redirectChain };
  }
  throw new Error(`Too many redirects starting from ${url}`);
}

// リダイレクトを追跡せず、1回だけGETしてstatusとlocationヘッダーを返す(リダイレクト検証用)
export async function fetchNoRedirect(url, { timeoutMs = 20000 } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { redirect: "manual", signal: controller.signal });
    return { status: res.status, location: res.headers.get("location"), headers: res.headers };
  } finally {
    clearTimeout(timeout);
  }
}

// スナップショットファイル(# URL: / # Status: / # Headers: / # Body: 形式)をパースする
export function parseSnapshot(text) {
  const bodyMarker = "# Body:\n";
  const idx = text.indexOf(bodyMarker);
  const head = idx >= 0 ? text.slice(0, idx) : text;
  const body = idx >= 0 ? text.slice(idx + bodyMarker.length) : "";
  const statusMatch = head.match(/^# Status: (\d+)/m);
  const urlMatch = head.match(/^# URL: (.+)$/m);
  return {
    url: urlMatch ? urlMatch[1] : null,
    status: statusMatch ? Number(statusMatch[1]) : null,
    body,
  };
}

// ドメイン差を正規化して比較しやすくする(本番ドメイン/stgドメインの表記ゆれを統一)。
// https://host形式・host単体のどちらも "__HOST__" に一本化する(置換先を分けない)。
export function normalizeDomains(text) {
  if (!text) return text;
  return text
    .replaceAll(PRODUCTION_ORIGIN, "__ORIGIN__HOST__")
    .replaceAll(STG_ORIGIN, "__ORIGIN__HOST__")
    .replaceAll("ryotablog.jp", "__HOST__")
    .replaceAll("ryota-blog-stg.ryota09dev.workers.dev", "__HOST__")
    .replaceAll("__ORIGIN__HOST__", "__HOST__");
}

export function nowJst() {
  return new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
}
