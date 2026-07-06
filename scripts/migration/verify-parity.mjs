#!/usr/bin/env node
// 移行前後パリティ検証(Issue #242)の統合実行スクリプト。
// A〜Gの各チェックを順に実行し、結果を .parity/results/*.json に出力する。
// H(MICROCMSキー無しビルドゲート)は .env.local の退避/復元が必要なため、
// 事故防止のためこのスクリプトには含めない(README/レポート記載の手順を手動実行すること)。
//
// 使い方:
//   node scripts/migration/verify-parity.mjs           # A〜Gを全部実行
//   node scripts/migration/verify-parity.mjs a b c      # 指定したステップのみ実行
//
// 前提: NODE_ENV=development npx velite build 済みであること(.velite/*.json を使用する)。

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const STEPS = {
  a: { file: "check-a-urls.mjs", label: "A. URL網羅チェック" },
  b: { file: "check-b-redirects.mjs", label: "B. 旧URLリダイレクト" },
  c: { file: "check-c-endpoint-diff.mjs", label: "C. エンドポイントdiff" },
  d: { file: "check-d-metadata.mjs", label: "D. メタデータ・構造パリティ" },
  e: { file: "check-e-article-structure.mjs", label: "E. 記事コンテンツ構造検証(Playwright、時間がかかる)" },
  f: { file: "check-f-visual-regression.mjs", label: "F. ビジュアル回帰(Playwright+pixelmatch、最も時間がかかる)" },
  g: { file: "check-g-lighthouse.mjs", label: "G. Lighthouse比較(要Playwright chromium)" },
};

function main() {
  const requested = process.argv.slice(2).map((s) => s.toLowerCase());
  const keys = requested.length > 0 ? requested.filter((k) => STEPS[k]) : Object.keys(STEPS);

  if (keys.length === 0) {
    console.error(`有効なステップ指定がありません。使用可能: ${Object.keys(STEPS).join(", ")}`);
    process.exit(1);
  }

  console.log(`実行するステップ: ${keys.join(", ")}`);
  const summary = [];

  for (const key of keys) {
    const step = STEPS[key];
    const scriptPath = join(__dirname, step.file);
    console.log(`\n${"=".repeat(60)}`);
    console.log(`${step.label}`);
    console.log(`${"=".repeat(60)}`);

    const result = spawnSync("node", [scriptPath], { stdio: "inherit" });
    const ok = result.status === 0;
    summary.push({ key, label: step.label, ok, status: result.status });

    if (!ok) {
      console.log(`\n[警告] ${step.label} が非ゼロ終了(status=${result.status})。詳細はログ・.parity/results/を確認してください。`);
    }
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log("verify-parity.mjs 実行サマリ");
  console.log(`${"=".repeat(60)}`);
  for (const s of summary) {
    console.log(`  [${s.ok ? "OK" : "要確認"}] ${s.label}`);
  }
  console.log(`\n結果詳細: .parity/results/*.json`);
  console.log(`スクリーンショット(F項目): .parity/screenshots/`);
  console.log(`\nH項目(MICROCMSキー無しビルドゲート)は以下を手動実行してください:`);
  console.log(`  mv .env.local /tmp/env-local-backup`);
  console.log(`  npm run build`);
  console.log(`  grep -rl "images.microcms-assets.io" .next/server/app/`);
  console.log(`  mv /tmp/env-local-backup .env.local`);

  const anyFailed = summary.some((s) => !s.ok);
  process.exit(anyFailed ? 1 : 0);
}

main();
