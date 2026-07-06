// 変換した全MDXファイルを @mdx-js/mdx の compile() に通し、パースエラーが無いか検証する。
// frontmatter は remark-frontmatter 相当の除去を行わず、単純に先頭の --- ブロックを取り除いて本文のみを検証する。
//
// 実行: node scripts/migration/validate-mdx.mjs

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { globSync } from "node:fs";
import { compile } from "@mdx-js/mdx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const BLOGS_DIR = path.join(ROOT, "content/blogs");

// content/blogs 配下の index.*.mdx を全件収集する。
const files = globSync("**/index.*.mdx", { cwd: BLOGS_DIR }).sort();

// frontmatter(先頭の --- ... --- ブロック)を取り除いて本文を返す。
function stripFrontmatter(src) {
  if (src.startsWith("---")) {
    const end = src.indexOf("\n---", 3);
    if (end !== -1) {
      const after = src.indexOf("\n", end + 1);
      return src.slice(after + 1);
    }
  }
  return src;
}

let ok = 0;
let ng = 0;
const failures = [];

for (const rel of files) {
  const full = path.join(BLOGS_DIR, rel);
  const src = readFileSync(full, "utf8");
  const body = stripFrontmatter(src);
  try {
    await compile(body, {});
    ok += 1;
  } catch (err) {
    ng += 1;
    failures.push({ file: rel, message: err.message.split("\n")[0] });
  }
}

console.log(`[validate-mdx] 対象 ${files.length} ファイル / 成功 ${ok} / 失敗 ${ng}`);
if (failures.length > 0) {
  for (const f of failures) {
    console.log(`  FAIL ${f.file}: ${f.message}`);
  }
  process.exit(1);
}
console.log("[validate-mdx] 全件 MDX compile 成功");
