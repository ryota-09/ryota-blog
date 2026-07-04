// microCMSの「categories」コンテンツを取得し、src/static/categories.generated.ts を書き出す。
// npm run dev / npm run build の predev / prebuild フックから実行される（package.json参照）。
//
// 取得に失敗した場合はファイルを上書きせず終了する（既存ファイル＝前回成功時の内容を維持する）。
// そのため src/static/categories.generated.ts は git 管理下に置き、CIのLintステップ
// （MICROCMS_API_KEY を持たず本スクリプトを実行しない）でも常に解決可能な状態を保つ。
const { writeFileSync } = require("fs");
const path = require("path");
const { loadEnvConfig } = require("@next/env");
const { createClient } = require("microcms-js-sdk");

loadEnvConfig(process.cwd());

const OUTPUT_PATH = path.join(__dirname, "../src/static/categories.generated.ts");

// microCMSのcontent idと、過去に公開しインデックスされたURLスラッグが異なる例外のみ列挙する。
// 新規カテゴリ追加時にここへの追記は基本的に不要（content id をそのままスラッグとして使う）。
const CATEGORY_SLUG_OVERRIDES = {
  "ui-parts": "ui_parts",
};

// microCMSが無応答の場合にnpm run dev/buildが無期限にハングするのを防ぐための上限（ミリ秒）
const FETCH_TIMEOUT_MS = 15_000;

const FILE_HEADER = `// このファイルは \`node scripts/generate-categories.js\` によって自動生成されます。
// 手動で編集しないでください（次回の npm run dev / npm run build で上書きされます）。
// microCMSの「categories」コンテンツが唯一の情報源です。

export type CategoryEntry = {
  id: string;
  slug: string;
  name: string;
  name_en: string;
};

`;

function toFileContent(entries) {
  const body = entries
    .map(
      (entry) =>
        `  { id: ${JSON.stringify(entry.id)}, slug: ${JSON.stringify(entry.slug)}, name: ${JSON.stringify(entry.name)}, name_en: ${JSON.stringify(entry.name_en)} },`,
    )
    .join("\n");
  return `${FILE_HEADER}export const CATEGORIES: CategoryEntry[] = [\n${body}\n];\n`;
}

async function fetchCategoryEntries() {
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = process.env.MICROCMS_API_KEY;

  if (!serviceDomain || !apiKey) {
    throw new Error("MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY が設定されていません");
  }

  const client = createClient({ serviceDomain, apiKey });
  // getAllContents は limit=100 固定 + offset ページネーションで全件を自動取得する
  const categories = await client.getAllContents({
    endpoint: "categories",
    queries: { fields: "id,name,name_en", orders: "createdAt" },
    customRequestInit: { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) },
  });

  if (categories.length === 0) {
    throw new Error("microCMSから取得したカテゴリが0件でした");
  }

  return categories.map((category) => ({
    id: category.id,
    slug: CATEGORY_SLUG_OVERRIDES[category.id] || category.id,
    name: category.name,
    name_en: category.name_en || category.name,
  }));
}

(async () => {
  try {
    const entries = await fetchCategoryEntries();
    writeFileSync(OUTPUT_PATH, toFileContent(entries));
    console.log(`[generate-categories] microCMSから${entries.length}件のカテゴリを取得し、生成しました。`);
  } catch (error) {
    console.warn(
      "[generate-categories] microCMSからの取得に失敗しました。既存の src/static/categories.generated.ts をそのまま使用します。",
      error,
    );
  }
})();
