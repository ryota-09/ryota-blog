// LinkCard(#236)のためのOGPキャッシュ生成スクリプト。
// content/blogs配下の全MDXから <LinkCard url="..." /> のURLを抽出し、
// 各URLへfetchしてOGP(og:title/og:description/og:image/favicon)をパースして
// content/ogp-cache.json に保存する(URL→メタのマップ)。
//
// 実行方法: node ./scripts/fetch-ogp-cache.mjs
// ビルド時ではなく手動実行のスクリプト(記事に新しいLinkCardが増えたときに再実行しコミットする)。
// 失敗したURLはtitle=URLのフォールバックエントリを書く。
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_BLOGS_DIR = path.join(__dirname, "..", "content", "blogs");
const OUTPUT_PATH = path.join(__dirname, "..", "content", "ogp-cache.json");

// content/blogs配下の全 index.*.mdx ファイルパスを再帰的に収集する
const collectMdxFiles = (dir) => {
  const entries = readdirSync(dir);
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...collectMdxFiles(fullPath));
    } else if (/^index\.(ja|en)\.mdx$/.test(entry)) {
      files.push(fullPath);
    }
  }
  return files;
};

// <LinkCard url="..." /> からURLを抽出する(シングル/ダブルクォート両対応)
const extractLinkCardUrls = (mdxContent) => {
  const urls = [];
  const pattern = /<LinkCard\s+url=["']([^"']+)["']\s*\/?>/g;
  let match;
  while ((match = pattern.exec(mdxContent)) !== null) {
    urls.push(match[1]);
  }
  return urls;
};

// HTML文字列からOGPタグ(og:title/og:description/og:image)とfaviconを簡易パースする
const parseOgpFromHtml = (html, baseUrl) => {
  const getMetaContent = (property) => {
    // property/name いずれの属性順序・引用符種別にも対応する簡易正規表現
    const patterns = [
      new RegExp(
        `<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["'][^>]*>`,
        "i",
      ),
      new RegExp(
        `<meta[^>]*content=["']([^"']*)["'][^>]*(?:property|name)=["']${property}["'][^>]*>`,
        "i",
      ),
    ];
    for (const pattern of patterns) {
      const m = html.match(pattern);
      if (m) return m[1];
    }
    return undefined;
  };

  const titleTagMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);

  const resolveUrl = (value) => {
    if (!value) return undefined;
    try {
      return new URL(value, baseUrl).toString();
    } catch {
      return undefined;
    }
  };

  const title = getMetaContent("og:title") || titleTagMatch?.[1]?.trim() || baseUrl;
  const description = getMetaContent("og:description") || getMetaContent("description");
  const image = resolveUrl(getMetaContent("og:image"));

  // faviconはlinkタグ(rel="icon"系)から抽出。無ければ/favicon.icoにフォールバック
  const faviconMatch = html.match(
    /<link[^>]*rel=["'](?:shortcut icon|icon|apple-touch-icon)["'][^>]*href=["']([^"']*)["'][^>]*>/i,
  );
  const favicon = resolveUrl(faviconMatch?.[1]) ?? resolveUrl("/favicon.ico");

  return { title, description, image, favicon };
};

const fetchOgp = async (url) => {
  console.log(`fetching: ${url}`);
  try {
    const response = await fetch(url, {
      headers: {
        // 一部サイトはUAが無いとbotとして弾くため、一般的なブラウザUAを付与する
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const html = await response.text();
    const hostname = new URL(url).hostname;
    const ogp = parseOgpFromHtml(html, url);
    return {
      url,
      title: ogp.title,
      description: ogp.description ?? null,
      image: ogp.image ?? null,
      favicon: ogp.favicon ?? null,
      hostname,
      ok: true,
    };
  } catch (error) {
    console.error(`  failed: ${error.message}`);
    return {
      url,
      title: url,
      description: null,
      image: null,
      favicon: null,
      hostname: (() => {
        try {
          return new URL(url).hostname;
        } catch {
          return url;
        }
      })(),
      ok: false,
    };
  }
};

const main = async () => {
  const mdxFiles = collectMdxFiles(CONTENT_BLOGS_DIR);
  const urlSet = new Set();
  for (const file of mdxFiles) {
    const content = readFileSync(file, "utf-8");
    for (const url of extractLinkCardUrls(content)) {
      urlSet.add(url);
    }
  }

  const urls = [...urlSet].sort();
  console.log(`${urls.length}件のLinkCard URLを検出しました`);

  const results = {};
  for (const url of urls) {
    const meta = await fetchOgp(url);
    results[url] = meta;
  }

  // 決定的な出力にするためキーをソートして書き出す
  const sortedResults = Object.fromEntries(
    Object.keys(results)
      .sort()
      .map((key) => [key, results[key]]),
  );

  writeFileSync(OUTPUT_PATH, JSON.stringify(sortedResults, null, 2) + "\n", "utf-8");

  const okCount = Object.values(results).filter((r) => r.ok).length;
  console.log(`完了: ${okCount}/${urls.length}件成功 → ${OUTPUT_PATH}`);
};

main();
