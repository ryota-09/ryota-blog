#!/usr/bin/env node
// C. エンドポイントdiff(stg vs 本番スナップショット)
// sitemap.xml / feed×3 / llms.txt×3 をstgから取得し、本番スナップショットと比較する。
// ドメイン差は正規化した上で比較し、差分をEXPECTED/要判断に分類する。

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  REPO_ROOT,
  STG_ORIGIN,
  PRODUCTION_ORIGIN,
  fetchFollow,
  parseSnapshot,
  normalizeDomains,
} from "./lib/common.mjs";

const OUTPUT_PATH = join(REPO_ROOT, ".parity/results/c-endpoint-diff.json");

const TARGETS = [
  { name: "sitemap", path: "/sitemap.xml", snapshot: "sitemap.snapshot" },
  { name: "feed(default)", path: "/feed", snapshot: "feed.snapshot" },
  { name: "ja-feed", path: "/ja/feed", snapshot: "ja-feed.snapshot" },
  { name: "en-feed", path: "/en/feed", snapshot: "en-feed.snapshot" },
  { name: "llms-txt(default)", path: "/docs/llms.txt", snapshot: "llms-txt.snapshot" },
  { name: "ja-llms-txt", path: "/ja/docs/llms.txt", snapshot: "ja-llms-txt.snapshot" },
  { name: "en-llms-txt", path: "/en/docs/llms.txt", snapshot: "en-llms-txt.snapshot" },
];

// RSS(feed)のitemを {guid, link, title, pubDate} で抽出する簡易パーサー
function extractRssItems(xml) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
  return items.map((itemXml) => {
    const get = (tag) => {
      const m = itemXml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
      return m ? m[1].trim() : null;
    };
    return {
      guid: get("guid"),
      link: get("link"),
      title: get("title"),
      pubDate: get("pubDate"),
    };
  });
}

function diffRssItems(prodItems, stgItems, label) {
  const diffs = [];
  const maxLen = Math.max(prodItems.length, stgItems.length);
  if (prodItems.length !== stgItems.length) {
    diffs.push({
      type: "count-mismatch",
      detail: `${label}: prod=${prodItems.length} stg=${stgItems.length}`,
    });
  }
  for (let i = 0; i < maxLen; i++) {
    const p = prodItems[i];
    const s = stgItems[i];
    if (!p || !s) {
      diffs.push({ type: "missing-item", index: i, prod: p, stg: s });
      continue;
    }
    for (const field of ["guid", "link", "title", "pubDate"]) {
      const pVal = normalizeDomains(p[field]);
      const sVal = normalizeDomains(s[field]);
      if (pVal !== sVal) {
        diffs.push({ type: "field-mismatch", index: i, field, prod: p[field], stg: s[field] });
      }
    }
  }
  return diffs;
}

// sitemapの<loc>一覧を比較(ドメイン正規化・順序無視の集合比較+既知の差分は分類)
function diffSitemapLocs(prodBody, stgBody) {
  const prodLocs = [...prodBody.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => normalizeDomains(m[1]));
  const stgLocs = [...stgBody.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => normalizeDomains(m[1]));
  const prodSet = new Set(prodLocs);
  const stgSet = new Set(stgLocs);
  const onlyInProd = prodLocs.filter((u) => !stgSet.has(u));
  const onlyInStg = stgLocs.filter((u) => !prodSet.has(u));
  return { prodCount: prodLocs.length, stgCount: stgLocs.length, onlyInProd, onlyInStg };
}

async function main() {
  const results = [];

  for (const target of TARGETS) {
    console.log(`\n--- ${target.name} ---`);
    const snapshotPath = join(REPO_ROOT, "scripts/migration/snapshots", target.snapshot);
    const { status: prodStatus, body: prodBody } = parseSnapshot(readFileSync(snapshotPath, "utf-8"));

    const stgUrl = `${STG_ORIGIN}${target.path}`;
    const { status: stgStatus, body: stgBody, finalUrl } = await fetchFollow(stgUrl);

    const entry = {
      name: target.name,
      path: target.path,
      prodStatus,
      stgStatus,
      stgFinalUrl: finalUrl,
      classification: null,
      diffs: [],
    };

    if (target.name === "sitemap") {
      const { prodCount, stgCount, onlyInProd, onlyInStg } = diffSitemapLocs(prodBody, stgBody);
      entry.prodCount = prodCount;
      entry.stgCount = stgCount;
      entry.onlyInProd = onlyInProd;
      entry.onlyInStg = onlyInStg;
      console.log(`prodCount=${prodCount} stgCount=${stgCount}`);
      if (onlyInProd.length) console.log(`本番のみ: ${JSON.stringify(onlyInProd)}`);
      if (onlyInStg.length) console.log(`stgのみ: ${JSON.stringify(onlyInStg)}`);

      // 既知差分1: ENカテゴリバグ修正(nextjs-typescript-book-review2: typescript -> review)
      const knownFrom = "__HOST__/en/blogs/typescript/nextjs-typescript-book-review2";
      const knownTo = "__HOST__/en/blogs/review/nextjs-typescript-book-review2";
      const isKnownCategoryFix =
        onlyInProd.includes(knownFrom) && onlyInStg.includes(knownTo);
      entry.classification = isKnownCategoryFix ? "EXPECTED(既知差分1: ENカテゴリバグ修正)" : onlyInProd.length || onlyInStg.length ? "要判断" : "PASS(完全一致)";

      // lastmodの差(既知差分2,3)は別途チェック: 同一URLでlastmodだけ違うケースを検出
      const prodLastmodMap = new Map();
      for (const m of prodBody.matchAll(/<url>\s*<loc>(.*?)<\/loc>\s*<lastmod>(.*?)<\/lastmod>\s*<\/url>/g)) {
        prodLastmodMap.set(normalizeDomains(m[1]), m[2]);
      }
      const stgLastmodMap = new Map();
      for (const m of stgBody.matchAll(/<url>\s*<loc>(.*?)<\/loc>\s*<lastmod>(.*?)<\/lastmod>\s*<\/url>/g)) {
        stgLastmodMap.set(normalizeDomains(m[1]), m[2]);
      }
      // /blogs/{category}/{slug} 形式(記事詳細)かどうかで既知差分2(EN記事lastmodバグ)/3(静的パス)を区別する
      const isArticlePath = (loc) => /__HOST__\/(ja|en)\/blogs\/[^/]+\/[^/]+$/.test(loc);
      let articleLastmodDiffCount = 0;
      let staticLastmodDiffCount = 0;
      const lastmodDiffSamples = [];
      for (const [loc, prodLastmod] of prodLastmodMap) {
        const stgLastmod = stgLastmodMap.get(loc);
        if (stgLastmod && stgLastmod !== prodLastmod) {
          if (isArticlePath(loc)) articleLastmodDiffCount++;
          else staticLastmodDiffCount++;
          if (lastmodDiffSamples.length < 8) {
            lastmodDiffSamples.push({ loc, prodLastmod, stgLastmod, isArticlePath: isArticlePath(loc) });
          }
        }
      }
      entry.articleLastmodDiffCount = articleLastmodDiffCount;
      entry.staticLastmodDiffCount = staticLastmodDiffCount;
      entry.lastmodDiffSamples = lastmodDiffSamples;
      console.log(
        `lastmod差分: 記事=${articleLastmodDiffCount}件(既知差分2: ENのja値流用バグ修正) 静的パス=${staticLastmodDiffCount}件(既知差分3: リクエスト時刻)`,
      );
      console.log(`サンプル: ${JSON.stringify(lastmodDiffSamples.slice(0, 3))}`);
    } else if (target.name === "feed(default)") {
      // 本番スナップショットは/feedへの301リダイレクトのみを記録(bodyなし)。
      // /feedはlocale無しパスなのでmiddlewareがdefaultLocale(ja)へ301するのが正しい挙動であり、
      // stg側も同じく/ja/feedへ301した上でja-feedと同一内容を返せばEXPECTED。
      entry.prodStatus = prodStatus;
      entry.stgStatus = stgStatus;
      const stgIsRedirectedToJa = finalUrl === `${STG_ORIGIN}/ja/feed`;
      entry.classification =
        prodStatus === 301 && stgIsRedirectedToJa
          ? "EXPECTED(/feedは/ja/feedへ301リダイレクト。本番スナップショットもbodyなしの301)"
          : "要判断";
      console.log(`prodStatus=${prodStatus} stgFinalUrl=${finalUrl} classification=${entry.classification}`);
    } else if (target.name.includes("feed")) {
      const prodItems = extractRssItems(prodBody);
      const stgItems = extractRssItems(stgBody);
      entry.prodItemCount = prodItems.length;
      entry.stgItemCount = stgItems.length;
      const diffs = diffRssItems(prodItems, stgItems, target.name);
      entry.diffs = diffs;
      entry.classification = diffs.length === 0 ? "PASS(完全一致)" : "要判断";
      console.log(`prodItems=${prodItems.length} stgItems=${stgItems.length} diffs=${diffs.length}`);
      if (diffs.length) console.log(JSON.stringify(diffs.slice(0, 10), null, 2));
    } else if (target.name.includes("llms-txt")) {
      const normProd = normalizeDomains(prodBody).trim();
      const normStg = normalizeDomains(stgBody).trim();
      entry.bodyMatches = normProd === normStg;
      if (entry.bodyMatches) {
        entry.classification = "PASS(完全一致)";
        console.log("bodyMatches=true");
      } else {
        // 差分行を抽出
        const prodLines = normProd.split("\n");
        const stgLines = normStg.split("\n");
        const maxLen = Math.max(prodLines.length, stgLines.length);
        const lineDiffs = [];
        for (let i = 0; i < maxLen; i++) {
          if (prodLines[i] !== stgLines[i]) {
            lineDiffs.push({ line: i + 1, prod: prodLines[i], stg: stgLines[i] });
          }
        }
        entry.lineDiffs = lineDiffs;

        // ## Categories / ## カテゴリ セクションの行のみが差分で、
        // かつセット(順序無視)としては一致するなら「カテゴリ表示順序の差」として分類する。
        // (microCMSのカテゴリ取得順とVeliteのJSONファイル記述順の違いに起因。件数・カテゴリ内容自体は一致)
        const categoryLineDiffs = lineDiffs.filter((d) => {
          const isCategoryLine = (s) => typeof s === "string" && s.startsWith("- ");
          return isCategoryLine(d.prod) && isCategoryLine(d.stg);
        });
        const onlyCategoryLinesDiffer = categoryLineDiffs.length === lineDiffs.length && lineDiffs.length > 0;
        let isOrderOnlyDiff = false;
        if (onlyCategoryLinesDiffer) {
          const prodCatSet = new Set(prodLines.filter((l) => l.startsWith("- ")));
          const stgCatSet = new Set(stgLines.filter((l) => l.startsWith("- ")));
          isOrderOnlyDiff =
            prodCatSet.size === stgCatSet.size &&
            [...prodCatSet].every((v) => stgCatSet.has(v));
        }

        entry.classification = isOrderOnlyDiff
          ? "EXPECTED(カテゴリ表示順序の差。内容は完全一致、microCMS取得順とVelite JSON順の違い)"
          : "要判断";
        console.log(`bodyMatches=false, 差分行数=${lineDiffs.length}, classification=${entry.classification}`);
        console.log(JSON.stringify(lineDiffs.slice(0, 5), null, 2));
      }
    }

    results.push(entry);
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2), "utf-8");
  console.log(`\n=== C. エンドポイントdiff結果 ===`);
  for (const r of results) {
    console.log(`${r.name}: ${r.classification}`);
  }
  console.log(`詳細: ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
