// MDX本文中のimg要素にwidth/height属性を注入するrehypeプラグイン。
//
// なぜrehypeプラグインが必要か:
// MDXのimg("![alt](./images/xxx.jpeg)")はs.image()と違い、Veliteがwidth/height/blurDataURLの
// メタデータを生成しない(生成するのはfrontmatterのthumbnailフィールドのみ)。
// 記事本文中の画像は素のMarkdown image構文のままなので、レンダリング時にnext/imageへ渡す
// width/heightが無く、CLS(レイアウトシフト)の原因になる。
//
// 実行順序の制約(実装時に確定した重要事項):
// velite の s.mdx() は remarkPlugins に [remarkGfm, remarkRemoveComments, remarkCopyLinkedFiles, ...(config指定分)]
// を必ずこの順で積む。つまり velite.config.ts の mdx.remarkPlugins で追加するプラグインは
// 必ず remarkCopyLinkedFiles より「後」に実行される。そのため mdast(remark)段階で画像パスを見ても、
// 既に `/static/xxxxxxxx-hash.ext` へ書き換わった後の値しか見えない(コピー前のcontent/blogs/.../images/相対パスは失われる)。
// この制約により、本プラグインはrehype(hast)段階で動作し、書き換え後の `/static/...` パスから
// public/static配下の実ファイルを直接読んでサイズを取得する方式を採る。
//
// velite標準の output 設定(output.assets 既定値 "public/static", output.base 既定値 "/static/")
// に依存するため、projectRoot(process.cwd())を基点に解決する。
import { readFile } from "node:fs/promises";
import path from "node:path";

import { visit } from "unist-util-visit";
import sharp from "sharp";
import type { Root, Element } from "hast";

// veliteのoutput既定値(velite.config.tsでoutputを明示指定していないため既定値のまま)
const OUTPUT_BASE = "/static/";
const OUTPUT_ASSETS_DIR = "public/static";

// 画像サイズのキャッシュ(同一画像が複数記事から参照されるケースの重複読み込みを防ぐ)
const sizeCache = new Map<string, { width: number; height: number } | null>();

const resolvePublicAssetPath = (src: string): string | null => {
  if (!src.startsWith(OUTPUT_BASE)) return null;
  const relative = src.slice(OUTPUT_BASE.length);
  return path.join(process.cwd(), OUTPUT_ASSETS_DIR, relative);
};

const readImageSize = async (
  assetPath: string,
): Promise<{ width: number; height: number } | null> => {
  const cached = sizeCache.get(assetPath);
  if (cached !== undefined) return cached;

  try {
    const buffer = await readFile(assetPath);
    const metadata = await sharp(buffer).metadata();
    if (!metadata.width || !metadata.height) {
      sizeCache.set(assetPath, null);
      return null;
    }
    const size = { width: metadata.width, height: metadata.height };
    sizeCache.set(assetPath, size);
    return size;
  } catch {
    // 画像が見つからない・破損している等の場合はwidth/height無しでフォールバックさせる
    sizeCache.set(assetPath, null);
    return null;
  }
};

export const rehypeImageSize = () => async (tree: Root) => {
  const imageNodes: Element[] = [];
  visit(tree, "element", (node: Element) => {
    if (node.tagName === "img") imageNodes.push(node);
  });

  await Promise.all(
    imageNodes.map(async (node) => {
      const src = node.properties?.src;
      if (typeof src !== "string") return;

      const assetPath = resolvePublicAssetPath(src);
      if (!assetPath) return;

      const size = await readImageSize(assetPath);
      if (!size) return;

      node.properties ??= {};
      node.properties.width = size.width;
      node.properties.height = size.height;
    }),
  );
};
