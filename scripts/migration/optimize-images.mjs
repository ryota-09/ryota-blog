// content/配下のラスタ画像(記事画像 + カテゴリアイコン)を非可逆圧縮するスクリプト(#237)。
//
// 実行: node scripts/migration/optimize-images.mjs
//
// 対象: content/blogs/*/images/* と content/images/categories/* のうち jpg/jpeg/png/webp。
// SVGとGIFは対象外(SVGはベクタでそのまま最適、GIFはアニメーション破壊防止のため無変換)。
//
// 処理内容:
// - 長辺が1600pxを超える場合のみ縮小(拡大はしない)
// - JPEG: mozjpeg品質80で再圧縮
// - PNG: パレット化(png8相当)を品質80で試行し、失敗/非効率ならそのまま(通常のPNG最適化)品質80を採用
// - WebP: 品質80で再圧縮
// - 再圧縮後のサイズが元より大きい場合は元ファイルを維持する(壊すより安全側)
// - 拡張子・ファイル名は変更しない(MDX内の参照を壊さないため。フォーマット変換はしない)
//
// 冪等性: ファイルの内容ハッシュ(sha256)を scripts/migration/optimized-images.json に記録し、
// 既に処理済み(同一ハッシュ)のファイルはスキップする。2回実行しても再圧縮による劣化は進まない。
//
// レポート: ファイルごとのbefore/afterサイズと、合計削減量をconsoleに出力する。

import { readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const CONTENT_DIR = path.join(ROOT, "content");
const BLOGS_DIR = path.join(CONTENT_DIR, "blogs");
const CATEGORY_IMAGES_DIR = path.join(CONTENT_DIR, "images/categories");
const MARKER_PATH = path.join(__dirname, "optimized-images.json");

// 長辺の上限(px)。これを超える場合のみ縮小する
const MAX_DIMENSION = 1600;
// 再圧縮時の品質(JPEG/PNG(palette)/WebP共通)
const QUALITY = 80;

// 圧縮対象の拡張子(小文字比較)。SVG/GIFは含めない
const RASTER_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

// ── ユーティリティ ────────────────────────────────────────────

// ファイル内容からsha256ハッシュを計算する(冪等性マーカー用)
function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

// バイト数を人間可読な文字列(KB/MB)に整形する
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

// 対象ディレクトリ配下(再帰)の全ファイルパスを列挙する
async function listFilesRecursive(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursive(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

// 冪等性マーカー(処理済みファイルのハッシュ記録)を読み込む
function loadMarker() {
  if (!existsSync(MARKER_PATH)) return {};
  try {
    return JSON.parse(readFileSync(MARKER_PATH, "utf8"));
  } catch {
    return {};
  }
}

function saveMarker(marker) {
  writeFileSync(MARKER_PATH, JSON.stringify(marker, null, 2) + "\n");
}

// ── 画像ごとの圧縮処理 ────────────────────────────────────────

// 1枚の画像を圧縮する。圧縮後のBufferが元より小さい場合のみ採用し、そうでなければnullを返す(元ファイル維持)。
async function compressImage(inputBuffer, ext) {
  const image = sharp(inputBuffer, { failOn: "none" });
  const metadata = await image.metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  const longSide = Math.max(width, height);

  // 長辺が上限を超える場合のみ縮小する(拡大はしない)
  let pipeline = image;
  if (longSide > MAX_DIMENSION) {
    pipeline = pipeline.resize({
      width: width >= height ? MAX_DIMENSION : undefined,
      height: height > width ? MAX_DIMENSION : undefined,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  // 元のEXIF Orientationを反映してから再圧縮する(向きの崩れ防止)
  pipeline = pipeline.rotate();

  let outputBuffer;
  if (ext === ".jpg" || ext === ".jpeg") {
    outputBuffer = await pipeline
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toBuffer();
  } else if (ext === ".png") {
    // まずパレット化(png8相当)を試行する。写真的PNGでは効果が薄いことがあるため、
    // 非パレット(通常)圧縮も試して、より小さい方を採用する。
    const [paletteBuffer, plainBuffer] = await Promise.all([
      pipeline.clone().png({ quality: QUALITY, palette: true, effort: 10 }).toBuffer(),
      pipeline.clone().png({ quality: QUALITY, effort: 10 }).toBuffer(),
    ]);
    outputBuffer = paletteBuffer.length <= plainBuffer.length ? paletteBuffer : plainBuffer;
  } else if (ext === ".webp") {
    outputBuffer = await pipeline.webp({ quality: QUALITY }).toBuffer();
  } else {
    return null;
  }

  // 再圧縮後のほうが大きい場合は元ファイルを維持する
  if (outputBuffer.length >= inputBuffer.length) {
    return null;
  }
  return outputBuffer;
}

// ── メイン処理 ────────────────────────────────────────────────

async function main() {
  const marker = loadMarker();
  const targetDirs = [BLOGS_DIR, CATEGORY_IMAGES_DIR];

  const allFiles = (
    await Promise.all(targetDirs.map((dir) => listFilesRecursive(dir)))
  ).flat();

  const rasterFiles = allFiles.filter((file) =>
    RASTER_EXTENSIONS.has(path.extname(file).toLowerCase()),
  );

  const skippedNonRaster = allFiles.length - rasterFiles.length;

  const results = [];
  let totalBefore = 0;
  let totalAfter = 0;
  let skippedAlreadyOptimized = 0;
  let skippedNoGain = 0;

  for (const filePath of rasterFiles) {
    const relPath = path.relative(ROOT, filePath);
    const ext = path.extname(filePath).toLowerCase();
    const inputBuffer = readFileSync(filePath);
    const beforeSize = inputBuffer.length;
    const beforeHash = sha256(inputBuffer);

    // 既に処理済み(同一ハッシュがマーカーに記録済み)ならスキップ
    if (marker[relPath] && marker[relPath].hash === beforeHash) {
      skippedAlreadyOptimized++;
      totalBefore += beforeSize;
      totalAfter += beforeSize;
      results.push({
        path: relPath,
        before: beforeSize,
        after: beforeSize,
        status: "skip(already-optimized)",
      });
      continue;
    }

    let outputBuffer;
    try {
      outputBuffer = await compressImage(inputBuffer, ext);
    } catch (err) {
      console.error(`  ! 圧縮失敗、元ファイルを維持: ${relPath} (${err.message})`);
      totalBefore += beforeSize;
      totalAfter += beforeSize;
      results.push({ path: relPath, before: beforeSize, after: beforeSize, status: "error" });
      continue;
    }

    if (!outputBuffer) {
      // 再圧縮しても縮まらなかった場合は元ファイルを維持しつつ、マーカーには記録して次回スキップ対象にする
      skippedNoGain++;
      totalBefore += beforeSize;
      totalAfter += beforeSize;
      marker[relPath] = { hash: beforeHash, size: beforeSize };
      results.push({ path: relPath, before: beforeSize, after: beforeSize, status: "skip(no-gain)" });
      continue;
    }

    writeFileSync(filePath, outputBuffer);
    const afterHash = sha256(outputBuffer);
    marker[relPath] = { hash: afterHash, size: outputBuffer.length };

    totalBefore += beforeSize;
    totalAfter += outputBuffer.length;
    results.push({
      path: relPath,
      before: beforeSize,
      after: outputBuffer.length,
      status: "optimized",
    });
  }

  saveMarker(marker);

  // ── レポート出力 ──────────────────────────────────────────
  console.log("\n=== 画像圧縮レポート ===\n");
  for (const r of results) {
    const delta = r.before - r.after;
    const pct = r.before > 0 ? ((delta / r.before) * 100).toFixed(1) : "0.0";
    console.log(
      `${r.status.padEnd(24)} ${r.path.padEnd(70)} ${formatBytes(r.before).padStart(9)} -> ${formatBytes(r.after).padStart(9)} (${delta >= 0 ? "-" : "+"}${pct}%)`,
    );
  }

  const totalDelta = totalBefore - totalAfter;
  const totalPct = totalBefore > 0 ? ((totalDelta / totalBefore) * 100).toFixed(1) : "0.0";

  console.log("\n--- サマリ ---");
  console.log(`対象ラスタ画像: ${rasterFiles.length}件 (SVG/GIF等 非対象: ${skippedNonRaster}件)`);
  console.log(`  既に最適化済み(スキップ): ${skippedAlreadyOptimized}件`);
  console.log(`  再圧縮しても縮まらず維持: ${skippedNoGain}件`);
  console.log(`  実際に圧縮: ${results.filter((r) => r.status === "optimized").length}件`);
  console.log(`合計サイズ: ${formatBytes(totalBefore)} -> ${formatBytes(totalAfter)}`);
  console.log(`削減量: ${formatBytes(totalDelta)} (${totalPct}%削減)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
