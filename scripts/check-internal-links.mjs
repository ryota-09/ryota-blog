// content/blogs配下の全MDXについて、内部リンクと相対画像パスの整合性をチェックするスクリプト(#240)。
//
// 実行: node scripts/check-internal-links.mjs
//
// チェック内容:
// 1. 内部リンク `/{locale}/blogs/{category}/{slug}` の実在確認
//    - 参照先slugが該当localeの記事として実在するか
//    - リンク中の{category}が、参照先記事の実際のプライマリカテゴリ(categories配列の先頭)と一致するか
//      (カテゴリはslugのURLの一部でしかないため、記事移動でズレると404やSEO上の不整合を招く)
// 2. 相対画像パス(本文中の `![](./images/...)` と frontmatterの `thumbnail: ./images/...`)の実在確認
//
// 対象外(スコープ外):
// - 外部URL(http/https始まり)へのリンク
// - AmazonLink/LinkCard/Tweet等の埋め込みコンポーネントの外部URL
//
// 終了コード: 問題があれば1、なければ0。CI(npm run lint:content)から呼ばれる。
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BLOGS_DIR = path.join(ROOT, "content", "blogs");
const CATEGORIES_PATH = path.join(ROOT, "content", "categories.json");

// content/blogs配下の全 index.{ja,en}.mdx ファイルパスを再帰的に収集する
function collectMdxFiles(dir) {
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
}

// MDXファイルからfrontmatter(YAML)と本文を分離してパースする
function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { data: {}, body: raw };
  }
  const data = yaml.load(match[1]) ?? {};
  return { data, body: match[2] };
}

// 全記事の「slug×locale → プライマリカテゴリ」「slug×localeの実在」マップを構築する
function buildBlogIndex(files) {
  // key: `${locale}/${slug}` -> { primaryCategory, dir }
  const index = new Map();
  for (const filePath of files) {
    const relPath = path.relative(BLOGS_DIR, filePath).split(path.sep).join("/");
    const match = relPath.match(/^([^/]+)\/index\.(ja|en)\.mdx$/);
    if (!match) continue;
    const [, slug, locale] = match;
    const raw = readFileSync(filePath, "utf8");
    const { data } = parseFrontmatter(raw);
    const categories = Array.isArray(data.categories) ? data.categories : [];
    index.set(`${locale}/${slug}`, {
      primaryCategory: categories[0] ?? null,
      dir: path.dirname(filePath),
    });
  }
  return index;
}

// 内部リンク `/{locale}/blogs/{category}/{slug}` を本文から抽出する
// (Markdownリンク記法 `[text](url)` および素のURL文字列の両方を拾う)
function extractInternalLinks(body) {
  const results = [];
  const pattern = /\/(ja|en)\/blogs\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)/g;
  let match;
  while ((match = pattern.exec(body)) !== null) {
    results.push({ locale: match[1], category: match[2], slug: match[3] });
  }
  return results;
}

// 相対画像パス(`./images/...`)を本文とfrontmatterのthumbnailから抽出する
function extractRelativeImagePaths(body, frontmatterData) {
  const results = [];
  const mdImagePattern = /!\[[^\]]*\]\((\.\/images\/[^)\s]+)\)/g;
  let match;
  while ((match = mdImagePattern.exec(body)) !== null) {
    results.push(match[1]);
  }
  if (typeof frontmatterData.thumbnail === "string" && frontmatterData.thumbnail.startsWith("./images/")) {
    results.push(frontmatterData.thumbnail);
  }
  return results;
}

function main() {
  const categoriesRaw = JSON.parse(readFileSync(CATEGORIES_PATH, "utf8"));
  const validCategoryIds = new Set(categoriesRaw.map((c) => c.id));

  const files = collectMdxFiles(BLOGS_DIR);
  const blogIndex = buildBlogIndex(files);

  const errors = [];

  for (const filePath of files) {
    const relPath = path.relative(ROOT, filePath);
    const raw = readFileSync(filePath, "utf8");
    const { data, body } = parseFrontmatter(raw);

    // 1. 内部リンクのチェック
    const links = extractInternalLinks(body);
    for (const link of links) {
      const key = `${link.locale}/${link.slug}`;
      const target = blogIndex.get(key);
      if (!target) {
        errors.push(
          `${relPath}: 内部リンク先の記事が存在しません -> /${link.locale}/blogs/${link.category}/${link.slug}`,
        );
        continue;
      }
      if (!validCategoryIds.has(link.category)) {
        errors.push(
          `${relPath}: 内部リンクのカテゴリ "${link.category}" がcategories.jsonに存在しません -> /${link.locale}/blogs/${link.category}/${link.slug}`,
        );
        continue;
      }
      if (target.primaryCategory !== link.category) {
        errors.push(
          `${relPath}: 内部リンクのカテゴリが実際のプライマリカテゴリと不一致です ` +
            `(リンク上: "${link.category}", 実際: "${target.primaryCategory}") -> /${link.locale}/blogs/${link.category}/${link.slug}`,
        );
      }
    }

    // 2. 相対画像パスのチェック
    const imagePaths = extractRelativeImagePaths(body, data);
    const postDir = path.dirname(filePath);
    for (const imagePath of imagePaths) {
      const resolvedPath = path.join(postDir, imagePath);
      if (!existsSync(resolvedPath)) {
        errors.push(`${relPath}: 画像ファイルが存在しません -> ${imagePath}`);
      }
    }
  }

  if (errors.length > 0) {
    console.error(`\n内部リンク・画像パスのチェックでエラーが見つかりました(${errors.length}件):\n`);
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    console.error("");
    process.exit(1);
  }

  console.log(`内部リンク・画像パスのチェック: 問題なし(${files.length}ファイルを検査)`);
}

main();
