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
//
// 重要な訂正(#237で判明): 当初は「rehype段階でpublic/static配下の実ファイルを読む」方式だったが、
// veliteは各コレクションのMDXコンパイル中(rehypeプラグイン実行中)にはまだアセットファイルを
// public/static/へコピーしていない(コピーは全コレクションのビルド完了後に一括outputAssetsで行われる)。
// そのため実行タイミングによっては ENOENT で読み込みに失敗し、width/heightが注入されないことがあった。
// この問題を避けるため、velite本体がexportする `assets`(出力ファイル名 → 元ファイル絶対パスのMap)を
// 直接参照し、public/static へのコピー完了を待たずに「変換前の元ファイル」からサイズを取得する方式に変更した。
import path from "node:path";

import { visit } from "unist-util-visit";
import sharp from "sharp";
import { assets as veliteAssets } from "velite";
import type { Root, Element } from "hast";

// veliteのoutput既定値(velite.config.tsでoutputを明示指定していないため既定値のまま)
const OUTPUT_BASE = "/static/";

// 画像サイズのキャッシュ(同一画像が複数記事から参照されるケースの重複読み込みを防ぐ)
const sizeCache = new Map<string, { width: number; height: number } | null>();

// `/static/xxxx-hash.ext` 形式のsrcから、velite管理下の出力ファイル名(`xxxx-hash.ext`)を取り出す
const resolveOutputName = (src: string): string | null => {
  if (!src.startsWith(OUTPUT_BASE)) return null;
  // URLエンコードされている可能性がある(日本語ファイル名等)ためデコードする
  return decodeURIComponent(src.slice(OUTPUT_BASE.length));
};

const readImageSize = async (
  sourcePath: string,
): Promise<{ width: number; height: number } | null> => {
  const cached = sizeCache.get(sourcePath);
  if (cached !== undefined) return cached;

  try {
    const metadata = await sharp(sourcePath).metadata();
    if (!metadata.width || !metadata.height) {
      sizeCache.set(sourcePath, null);
      return null;
    }
    const size = { width: metadata.width, height: metadata.height };
    sizeCache.set(sourcePath, size);
    return size;
  } catch {
    // 画像が見つからない・破損している等の場合はwidth/height無しでフォールバックさせる
    sizeCache.set(sourcePath, null);
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

      const outputName = resolveOutputName(src);
      if (!outputName) return;

      // velite管理下の`assets` Mapから元ファイルの絶対パスを解決する
      // (rehypeCopyLinkedFilesが同期的にMapへ登録済みのため、この時点で必ず参照可能)
      const sourcePath = veliteAssets.get(outputName);
      if (!sourcePath) return;

      const size = await readImageSize(path.resolve(sourcePath));
      if (!size) return;

      node.properties ??= {};
      node.properties.width = size.width;
      node.properties.height = size.height;
    }),
  );
};
