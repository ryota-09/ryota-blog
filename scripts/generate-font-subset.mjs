// サイトで実際に使用する文字だけを含むKosugi Maruサブセットwoff2をビルド時に生成するスクリプト。
//
// 実行: node scripts/generate-font-subset.mjs (predev/prebuildから自動実行される)
//
// 背景(フォント読み込みパフォーマンス改善):
// - 従来はGoogle Fonts CDNのunicode-range 121分割CSS(kosugi-maru-v17.css)を使用していたが、
//   この分割は「日本語Web全体の平均頻度」向けの汎用最適化のため、記事ページでは
//   34〜49スライス・280〜631KBの転送が発生していた(記事の漢字種類数に比例)。
// - 当ブログはVeliteにより全コンテンツがビルド時に確定するため、実使用文字を
//   ビルド時に抽出してサブセット化すれば、全ページ共通の1ファイル(約283KB)で足り、
//   欠字リスクも構造的に発生しない(新記事追加時はprebuildで自動再生成される)。
// - Kosugi MaruはApache License 2.0(assets/fonts/LICENSE.txt参照)でサブセット・再配布可。
//
// 生成物(文字セットが変わらない限りファイル名・内容は不変):
// - public/fonts/kosugi-maru-subset.<hash>.woff2 : サブセット本体(gitignore対象)
// - public/fonts/kosugi-maru-subset.<hash>.css   : @font-face定義(gitignore対象。layout.tsxがload後に挿入)
// - src/generated/font-manifest.json             : CSSパスをlayout.tsxへ伝えるマニフェスト(コミット対象)
// woff2/CSSは全ビルド経路(predev/prebuild=CI・デプロイ含む)で再生成されるためコミットしない
// (記事追加のたびに約283KBのバイナリがgit履歴に積まれるのを避ける)。マニフェストは
// tsc/ESLintのimport解決に静的な実在が必要なためコミットする。
//
// ファイル名のhashはwoff2バイナリ+CSSテンプレートのsha256先頭10桁。フォント内容だけでなく
// CSSテンプレート(フォールバックメトリクス等)の変更でもファイル名が変わるため、
// public/_headers の /fonts/* immutableキャッシュと両立する(旧ハッシュのファイルは自動削除)。
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import subsetFont from "subset-font";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SOURCE_TTF = path.join(ROOT, "assets", "fonts", "KosugiMaru-Regular.ttf");
const FONTS_DIR = path.join(ROOT, "public", "fonts");
const MANIFEST_PATH = path.join(ROOT, "src", "generated", "font-manifest.json");

// 文字収集の対象: 記事本文(MDX)・UIソース・i18nメッセージ・カテゴリマスタ。
// srcはコード内コメント等も拾うため過剰包含だが、UI文言の取りこぼし防止を優先する
// (過剰分のサイズ影響は軽微。実測で漢字1字あたり約170バイト)。
// draft記事の文字も意図的に含める: 公開切替時の欠字を防ぐためで、サイズ・情報面の実害はない。
const COLLECT_TARGETS = [
  { dir: path.join(ROOT, "content", "blogs"), exts: [".mdx"] },
  { dir: path.join(ROOT, "src"), exts: [".ts", ".tsx", ".json"] },
  { dir: path.join(ROOT, "locales"), exts: [".json"] },
];
const COLLECT_FILES = [path.join(ROOT, "content", "categories.json")];

// 将来の記事・動的文言で確実に使われる基本文字は使用実績に関わらず常に含める(安全マージン)。
// 漢字はここに含めない: 未収録漢字はフォールバック(size-adjust済みシステムフォント)で
// 表示され可読性は保たれるうえ、新記事はビルド時に自動収集されるため実害がない。
const codeRange = (from, to) =>
  Array.from({ length: to - from + 1 }, (_, i) => String.fromCodePoint(from + i)).join("");
const SAFETY_CHARS = [
  codeRange(0x20, 0x7e), // ASCII
  codeRange(0x3041, 0x3096), // ひらがな
  codeRange(0x30a1, 0x30fa), // カタカナ
  "ーゝゞヽヾ々〆〤", // 長音・繰り返し記号等
  codeRange(0x3000, 0x303f), // CJK記号・約物(全角スペース・句読点・括弧類)
  codeRange(0xff01, 0xff60), // 全角英数・記号
  "…‥“”‘’–—‐〜・×÷±→←↑↓⇒⇔※℃€£¥§¶†‡°′″∞≠≒≦≧",
].join("");

// 対象ディレクトリを再帰走査してファイルパスを収集する
function collectFiles(dir, exts) {
  if (!existsSync(dir)) return [];
  const files = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      files.push(...collectFiles(fullPath, exts));
    } else if (exts.some((ext) => entry.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

async function main() {
  if (!existsSync(SOURCE_TTF)) {
    console.error(`generate-font-subset: ソースフォントが見つかりません: ${SOURCE_TTF}`);
    process.exit(1);
  }

  // 1. 使用文字の収集(コードポイント単位。制御文字は除外)。
  //    収集対象の欠落はサイレントにサブセットが縮む事故につながるため、必ずエラーで落とす
  //    (ディレクトリ移動・リネーム時にこのスクリプトの追随漏れを検知する)
  for (const { dir } of COLLECT_TARGETS) {
    if (!existsSync(dir)) {
      console.error(`generate-font-subset: 収集対象ディレクトリが見つかりません: ${dir}`);
      process.exit(1);
    }
  }
  const chars = new Set([...SAFETY_CHARS]);
  const targetFiles = [
    ...COLLECT_TARGETS.flatMap(({ dir, exts }) => collectFiles(dir, exts)),
    ...COLLECT_FILES,
  ];
  if (targetFiles.length < 10) {
    console.error(
      `generate-font-subset: 収集ファイル数が異常に少ないです(${targetFiles.length}件)。収集対象の設定を確認してください`,
    );
    process.exit(1);
  }
  for (const file of targetFiles) {
    for (const ch of readFileSync(file, "utf8")) {
      if (ch.codePointAt(0) >= 0x20) chars.add(ch);
    }
  }
  // ソート済み文字列にすることで、同一文字セットなら常に同一のsubset入力になる(ハッシュ安定化)
  const text = [...chars].sort().join("");

  // 2. サブセットwoff2の生成と@font-face定義CSSテンプレートの構築。
  //    フォールバックのsize-adjust系の値はnext/font(Kosugi_Maru)が生成していた実績値を
  //    そのまま継承しCLSパリティを維持する(旧kosugi-maru-v17.cssと同一。変更しないこと)
  const ttf = readFileSync(SOURCE_TTF);
  const woff2 = await subsetFont(ttf, text, { targetFormat: "woff2" });
  const cssTemplate = `/* Kosugi Maru サブセット版(サイト実使用文字のみ、scripts/generate-font-subset.mjsが生成)。
 * render-blockingを避けるためscript挿入で非同期に読み込まれる(src/app/layout.tsx参照)。
 * ファイル名のhashは内容由来(immutableキャッシュ対応)。手動編集せずスクリプトで再生成すること。 */
@font-face{font-family:'Kosugi Maru';font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/__WOFF2_NAME__) format('woff2');}
@font-face{font-family:'Kosugi Maru Fallback';src:local(Arial);ascent-override:78.45%;descent-override:10.71%;line-gap-override:0.0%;size-adjust:112.16%;}
`;

  // 3. ハッシュの確定。woff2バイナリに加えCSSテンプレートも入力に含めることで、
  //    フォールバックメトリクス等のテンプレート変更時にもファイル名が変わり、
  //    immutableキャッシュに旧CSSが残留する事故を防ぐ
  const hash = createHash("sha256")
    .update(woff2)
    .update(cssTemplate)
    .digest("hex")
    .slice(0, 10);
  const woff2Name = `kosugi-maru-subset.${hash}.woff2`;
  const cssName = `kosugi-maru-subset.${hash}.css`;
  const css = cssTemplate.replaceAll("__WOFF2_NAME__", woff2Name);

  // 4. 出力(内容が同じ場合は書き込みをスキップしてタイムスタンプを保つ)
  mkdirSync(FONTS_DIR, { recursive: true });
  mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  const outputs = [
    { file: path.join(FONTS_DIR, woff2Name), content: woff2 },
    { file: path.join(FONTS_DIR, cssName), content: css },
    {
      file: MANIFEST_PATH,
      content: `${JSON.stringify({ fontCssPath: `/fonts/${cssName}` }, null, 2)}\n`,
    },
  ];
  for (const { file, content } of outputs) {
    const buf = Buffer.isBuffer(content) ? content : Buffer.from(content, "utf8");
    if (existsSync(file) && readFileSync(file).equals(buf)) continue;
    writeFileSync(file, buf);
  }

  // 5. 旧ハッシュの生成物を削除(public/fontsに古いファイルを溜めない)
  for (const entry of readdirSync(FONTS_DIR)) {
    if (/^kosugi-maru-subset\..+\.(woff2|css)$/.test(entry) && !entry.includes(hash)) {
      unlinkSync(path.join(FONTS_DIR, entry));
    }
  }

  console.log(
    `generate-font-subset: ${chars.size}文字種 → ${woff2Name} (${(woff2.length / 1024).toFixed(1)} KB)`,
  );
}

main().catch((err) => {
  console.error("generate-font-subset: 失敗しました", err);
  process.exit(1);
});
