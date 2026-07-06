// rehypeプラグインからfrontmatterを取得するための共通ユーティリティ。
//
// なぜ必要か:
// velite の s.mdx() は `compile({ value, path: meta.path }, ...)` という形で
// 「frontmatterを除いた本文(value)」と「元ファイルの絶対パス(path)」だけをMDXコンパイラに渡す。
// rehype/remarkプラグインが受け取る vfile(file引数) には file.data にfrontmatterは載らない
// (実機検証済み: file.data は常に {} )。
// そのため、file.path から元のMDXファイルをfsで直接読み直し、frontmatterをパースする。
// ビルド時(Node.js環境)にのみ実行されるため fs アクセスは問題ない(本番Cloudflare Workersでは実行されない)。
import { readFileSync } from "node:fs";

import yaml from "js-yaml";

// 同一ファイルへの複数回アクセス(remark/rehype複数プラグインからの呼び出し)に備え、
// パース結果をモジュール内でキャッシュする
const frontmatterCache = new Map<string, Record<string, unknown>>();

// `---\n...\n---` のYAMLフロントマターブロックを抽出する正規表現
const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

// 指定したMDXファイルパスからfrontmatterをパースして返す。frontmatterが無い場合は空オブジェクト。
export const readFrontmatter = (filePath: string): Record<string, unknown> => {
  const cached = frontmatterCache.get(filePath);
  if (cached) return cached;

  const raw = readFileSync(filePath, "utf-8");
  const match = raw.match(FRONTMATTER_PATTERN);
  if (!match) {
    frontmatterCache.set(filePath, {});
    return {};
  }

  const parsed = yaml.load(match[1]);
  const result = (parsed ?? {}) as Record<string, unknown>;
  frontmatterCache.set(filePath, result);
  return result;
};
