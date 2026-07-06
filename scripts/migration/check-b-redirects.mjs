#!/usr/bin/env node
// B. 旧URLリダイレクト(stg)
// middleware.ts / next.config.mjs のリダイレクトルールが stg 上で期待通り動くかを検証する。

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { REPO_ROOT, STG_ORIGIN, fetchNoRedirect, fetchFollow, sleep } from "./lib/common.mjs";

const OUTPUT_PATH = join(REPO_ROOT, ".parity/results/b-redirects.json");

// { name, path, expectedStatus, expectedLocationPath(部分一致) }
const CASES = [
  {
    name: "旧URL(locale無し) /blogs/hitooshi-members",
    path: "/blogs/hitooshi-members",
    expectedStatus: 301,
    expectedLocationIncludes: "/ja/blogs/zakki/hitooshi-members",
  },
  {
    name: "旧URL(locale付き) /ja/blogs/hitooshi-members",
    path: "/ja/blogs/hitooshi-members",
    expectedStatus: 301,
    expectedLocationIncludes: "/ja/blogs/zakki/hitooshi-members",
  },
  {
    name: "存在しない記事slug /blogs/does-not-exist-xyz",
    path: "/blogs/does-not-exist-xyz",
    expectedStatus: 301,
    expectedLocationIncludes: "/ja/blogs",
  },
  {
    // next.config.mjs の redirects() では permanent: true を指定しており、
    // Next.jsはpermanent指定時に308(Permanent Redirect)を返す(301ではない)。
    // これはNext.jsの仕様通りの正しい挙動。
    name: "next.config.mjs: /blogs/page -> /blogs",
    path: "/blogs/page",
    expectedStatus: 308,
    expectedLocationIncludes: "/blogs",
    // 308後にmiddlewareがlocaleなし/blogsを/ja/blogsへさらにリダイレクトする可能性があるため、
    // 最終的な到達先も別途fetchFollowで確認する。
  },
  {
    name: "next.config.mjs: /blogs/page/1 -> /blogs",
    path: "/blogs/page/1",
    expectedStatus: 308,
    expectedLocationIncludes: "/blogs",
  },
  {
    name: "next.config.mjs: /blogs?page=2 -> /blogs/page/2 (query->path)",
    path: "/blogs?page=2",
    expectedStatus: 308,
    expectedLocationIncludes: "/blogs/page/2",
  },
  {
    name: "#241: /blogs?keyword=x のクエリ引き継ぎ",
    path: "/blogs?keyword=x",
    expectedStatus: 301,
    expectedLocationIncludes: "keyword=x",
  },
];

async function main() {
  const results = [];
  for (const c of CASES) {
    const url = `${STG_ORIGIN}${c.path}`;
    const { status, location } = await fetchNoRedirect(url);
    const locationOk = location ? location.includes(c.expectedLocationIncludes) : false;
    const statusOk = status === c.expectedStatus;
    const ok = statusOk && locationOk;

    // 最終到達先(フルリダイレクト追跡)も記録しておく
    let finalUrl = null;
    let finalStatus = null;
    try {
      const followed = await fetchFollow(url);
      finalUrl = followed.finalUrl;
      finalStatus = followed.status;
    } catch (error) {
      finalUrl = `ERROR: ${error}`;
    }

    results.push({
      name: c.name,
      path: c.path,
      expectedStatus: c.expectedStatus,
      actualStatus: status,
      location,
      expectedLocationIncludes: c.expectedLocationIncludes,
      finalUrl,
      finalStatus,
      ok,
    });
    console.log(`${ok ? "PASS" : "FAIL"} | ${c.name}`);
    console.log(`  -> status=${status} location=${location}`);
    console.log(`  -> final: ${finalStatus} ${finalUrl}`);
    await sleep(150);
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    total: results.length,
    pass: results.filter((r) => r.ok).length,
    fail: results.filter((r) => !r.ok).length,
    results,
  };
  writeFileSync(OUTPUT_PATH, JSON.stringify(summary, null, 2), "utf-8");
  console.log(`\n=== B. 旧URLリダイレクト結果 ===`);
  console.log(`total=${summary.total} pass=${summary.pass} fail=${summary.fail}`);
  console.log(`詳細: ${OUTPUT_PATH}`);
  if (summary.fail > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
