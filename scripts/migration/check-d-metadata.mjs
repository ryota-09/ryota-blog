#!/usr/bin/env node
// D. メタデータ・構造パリティ(本番 vs stg、代表8ページ)
// title / meta description / canonical / og:title / og:image / twitter:card / hreflang / JSON-LDの@type を比較する。

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { REPO_ROOT, PRODUCTION_ORIGIN, STG_ORIGIN, fetchFollow, normalizeDomains, sleep } from "./lib/common.mjs";

const OUTPUT_PATH = join(REPO_ROOT, ".parity/results/d-metadata.json");

const PAGES = [
  { name: "トップ(ja)", path: "/ja" },
  { name: "トップ(en)", path: "/en" },
  { name: "一覧(ja/blogs)", path: "/ja/blogs" },
  { name: "カテゴリ(ja/blogs/zakki)", path: "/ja/blogs/zakki" },
  { name: "記事(ja: best-buy-2026-first-half)", path: "/ja/blogs/zakki/best-buy-2026-first-half" },
  { name: "記事(ja: amplify-custom-ssl-acm-import)", path: "/ja/blogs/aws/amplify-custom-ssl-acm-import" },
  { name: "記事(en: hitooshi-review)", path: "/en/blogs/zakki/hitooshi-review" },
  { name: "記事(TOC・コード多め: jstqb-foundation-study-method)", path: "/ja/blogs/test/jstqb-foundation-study-method" },
];

function extractMeta(html) {
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? null;
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? null;
  const canonical = html.match(/rel="canonical" href="([^"]*)"/)?.[1] ?? null;
  const ogTitle = html.match(/property="og:title" content="([^"]*)"/)?.[1] ?? null;
  const ogImage = html.match(/property="og:image" content="([^"]*)"/)?.[1] ?? null;
  const ogType = html.match(/property="og:type" content="([^"]*)"/)?.[1] ?? null;
  const twitterCard = html.match(/name="twitter:card" content="([^"]*)"/)?.[1] ?? null;
  const hreflangs = [...html.matchAll(/<link rel="alternate" hrefLang="([^"]*)" href="([^"]*)"\/>/g)].map(
    (m) => ({ lang: m[1], href: m[2] }),
  );

  // JSON-LD(複数script/複数@type配列あり得る)から@typeを全部集める
  const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(
    (m) => m[1],
  );
  const jsonLdTypes = [];
  for (const block of jsonLdBlocks) {
    try {
      const parsed = JSON.parse(block);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of arr) {
        if (item && item["@type"]) jsonLdTypes.push(item["@type"]);
      }
    } catch {
      jsonLdTypes.push(`PARSE_ERROR`);
    }
  }

  return {
    title,
    description,
    canonical,
    ogTitle,
    ogImage,
    ogType,
    twitterCard,
    hreflangs,
    jsonLdTypes,
  };
}

// og:imageのようにハッシュクエリ(?b3333e0...)が付くフィールドは、クエリを除去して比較する
function stripQuery(url) {
  if (!url) return url;
  return url.split("?")[0];
}

function compareField(prodVal, stgVal, { ignoreQuery = false } = {}) {
  let p = normalizeDomains(prodVal);
  let s = normalizeDomains(stgVal);
  if (ignoreQuery) {
    p = stripQuery(p);
    s = stripQuery(s);
  }
  return { prod: prodVal, stg: stgVal, match: p === s };
}

async function main() {
  const results = [];

  for (const page of PAGES) {
    console.log(`\n--- ${page.name} (${page.path}) ---`);
    const prodUrl = `${PRODUCTION_ORIGIN}${page.path}`;
    const stgUrl = `${STG_ORIGIN}${page.path}`;

    const [prodRes, stgRes] = await Promise.all([fetchFollow(prodUrl), fetchFollow(stgUrl)]);
    const prodMeta = extractMeta(prodRes.body);
    const stgMeta = extractMeta(stgRes.body);

    const fields = {
      title: compareField(prodMeta.title, stgMeta.title),
      description: compareField(prodMeta.description, stgMeta.description),
      canonical: compareField(prodMeta.canonical, stgMeta.canonical),
      ogTitle: compareField(prodMeta.ogTitle, stgMeta.ogTitle),
      ogImage: compareField(prodMeta.ogImage, stgMeta.ogImage, { ignoreQuery: true }),
      ogType: compareField(prodMeta.ogType, stgMeta.ogType),
      twitterCard: compareField(prodMeta.twitterCard, stgMeta.twitterCard),
    };

    const prodHreflangNorm = prodMeta.hreflangs.map((h) => ({ lang: h.lang, href: normalizeDomains(h.href) }));
    const stgHreflangNorm = stgMeta.hreflangs.map((h) => ({ lang: h.lang, href: normalizeDomains(h.href) }));
    const hreflangMatch = JSON.stringify(prodHreflangNorm) === JSON.stringify(stgHreflangNorm);

    const jsonLdMatch = JSON.stringify(prodMeta.jsonLdTypes.sort()) === JSON.stringify(stgMeta.jsonLdTypes.sort());

    const allMatch =
      Object.values(fields).every((f) => f.match) && hreflangMatch && jsonLdMatch;

    const entry = {
      name: page.name,
      path: page.path,
      prodFinalUrl: prodRes.finalUrl,
      stgFinalUrl: stgRes.finalUrl,
      fields,
      hreflang: { prod: prodMeta.hreflangs, stg: stgMeta.hreflangs, match: hreflangMatch },
      jsonLdTypes: { prod: prodMeta.jsonLdTypes, stg: stgMeta.jsonLdTypes, match: jsonLdMatch },
      allMatch,
    };
    results.push(entry);

    for (const [key, val] of Object.entries(fields)) {
      console.log(`  ${key}: ${val.match ? "PASS" : "DIFF"}${val.match ? "" : ` prod="${val.prod}" stg="${val.stg}"`}`);
    }
    console.log(`  hreflang: ${hreflangMatch ? "PASS" : "DIFF"}${hreflangMatch ? "" : ` prod=${JSON.stringify(prodMeta.hreflangs)} stg=${JSON.stringify(stgMeta.hreflangs)}`}`);
    console.log(`  jsonLdTypes: ${jsonLdMatch ? "PASS" : "DIFF"}${jsonLdMatch ? "" : ` prod=${JSON.stringify(prodMeta.jsonLdTypes)} stg=${JSON.stringify(stgMeta.jsonLdTypes)}`}`);

    await sleep(200);
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2), "utf-8");
  console.log(`\n=== D. メタデータ・構造パリティ結果 ===`);
  const passCount = results.filter((r) => r.allMatch).length;
  console.log(`total=${results.length} allMatch=${passCount} diff=${results.length - passCount}`);
  console.log(`詳細: ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
