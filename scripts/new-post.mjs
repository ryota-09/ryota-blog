// 新規記事の雛形を生成するスクリプト(#240)。
//
// 実行: npm run new-post -- <slug>
//
// content/blogs/{slug}/index.ja.mdx と index.en.mdx をfrontmatterテンプレート付きで生成し、
// 画像コロケーション用の images/ ディレクトリ(.gitkeep付き)も作成する。
// 既に同名slugのディレクトリが存在する場合は中断する(誤って上書きしないため)。
//
// 生成directoの書き方は docs/writing.md を参照。
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BLOGS_DIR = path.join(ROOT, "content", "blogs");

// slugのバリデーション: 英小文字・数字・ハイフンのみ許可する
// (URL(/{locale}/blogs/{category}/{slug})にそのまま使われるため)
const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

function main() {
  const slug = process.argv[2];

  if (!slug) {
    console.error("使い方: npm run new-post -- <slug>");
    console.error("例:     npm run new-post -- my-new-article");
    process.exit(1);
  }

  if (!SLUG_PATTERN.test(slug)) {
    console.error(
      `無効なslugです: "${slug}"\nslugは英小文字・数字・ハイフンのみ使用できます(例: my-new-article)。`,
    );
    process.exit(1);
  }

  const postDir = path.join(BLOGS_DIR, slug);

  if (existsSync(postDir)) {
    console.error(`既に同名の記事ディレクトリが存在します: content/blogs/${slug}`);
    console.error("別のslugを指定するか、既存の記事を編集してください。");
    process.exit(1);
  }

  const now = new Date().toISOString();

  mkdirSync(postDir, { recursive: true });
  mkdirSync(path.join(postDir, "images"), { recursive: true });
  // 画像フォルダが空でもgitに追跡させるための空ファイル
  writeFileSync(path.join(postDir, "images", ".gitkeep"), "");

  writeFileSync(path.join(postDir, "index.ja.mdx"), buildFrontmatter({ now, locale: "ja" }));
  writeFileSync(path.join(postDir, "index.en.mdx"), buildFrontmatter({ now, locale: "en" }));

  console.log(`記事の雛形を作成しました: content/blogs/${slug}/`);
  console.log("  - index.ja.mdx");
  console.log("  - index.en.mdx");
  console.log("  - images/ (.gitkeep)");
  console.log("");
  console.log("次のステップ:");
  console.log("  1. frontmatter(title/description/categories等)を編集する");
  console.log("  2. 本文を執筆する(埋め込みコンポーネントの使い方は docs/writing.md を参照)");
  console.log("  3. `npm run dev` でプレビュー(draft: true の記事は開発環境でのみ表示されます)");
  console.log("  4. 公開準備ができたら draft: false に変更し、PRを作成する");
  console.log("");
  console.log("詳しい書き方ガイド: docs/writing.md");
}

// ロケール別のfrontmatterテンプレートを生成する
function buildFrontmatter({ now, locale }) {
  const title = locale === "ja" ? "(タイトルを入力してください)" : "(Enter title here)";
  const description =
    locale === "ja" ? "(記事の説明を入力してください)" : "(Enter description here)";

  return `---
title: ${title}
description: ${description}
publishedAt: "${now}"
updatedAt: "${now}"
categories:
  - test
draft: true
---

## 見出し

本文をここに書きます。
`;
}

main();
