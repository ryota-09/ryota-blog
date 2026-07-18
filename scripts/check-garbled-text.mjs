// content/blogs配下の全MDXについて、文字化け(漢字の誤変換・異常コードポイント)をチェックするスクリプト。
//
// 実行: node scripts/check-garbled-text.mjs [対象ファイル...]
//       node scripts/check-garbled-text.mjs --self-test
//
// 背景: 2026-07、hitooshi-members のja版で「大卒→大匲」「男性→男有」のような
// 近傍コードポイント(類形漢字)への置換型の文字化けが24箇所見つかった(旧microCMS入稿時に混入)。
// 実測では、この種の化けの約44%は機械的に検出できる(残りはLLMレビュー層 blog-proofread-checker が担当)。
//
// チェック内容:
// 1. 異常コードポイント: 単独の結合濁点/半濁点(U+3099/309A)、小書きゕゖ、U+FFFD、
//    制御文字(改行/タブ等を除く)、NFC非正規化テキスト
// 2. 既知の化けパターン: 過去事案で実際に出現した化け文字列の再発検知
// 3. kuromoji形態素解析: 辞書に無い日本語トークン(UNKNOWN語)の検出。
//    カタカナ語(外来語)と、許可リスト(scripts/garbled-text-allowlist.txt)の語は除外
//
// 対象外(スコープ外):
// - コードブロック・インラインコード・URL・JSX/HTMLタグの内部
// - 実在語の組み合わせに化けたケース(「全員→全和」等)は形態素解析では原理的に検出不能。
//   この層はLLMレビュー(review-blog-article の blog-proofread-checker)でカバーする
//
// 許可リストの運用: 誤検知(筆者名「りょた」の分割トークン、「ぁぁぁ」等の口語表現など)は
// scripts/garbled-text-allowlist.txt に1行1語で追記する。追記時は本当に意図した表記かを必ず目視確認すること。
//
// 終了コード: 問題があれば1、なければ0。CI(npm run lint:content)から呼ばれる。
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tokenize } from "kuromojin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BLOGS_DIR = path.join(ROOT, "content", "blogs");
const ALLOWLIST_PATH = path.join(__dirname, "garbled-text-allowlist.txt");

// 2026-07 hitooshi-members事案で実際に出現した化け文字列(再発検知用)
const KNOWN_GARBLED_PATTERNS = [
  "大匲",
  "男有",
  "女有",
  "全和",
  "遇遇",
  "突屈",
  "噴み合",
  "眠める",
  "こひ使",
  "ガチ契",
  "妗",
];

// 日本語文字(ひらがな・カタカナ・CJK漢字)を含むか
const HAS_JAPANESE = /[぀-ヿ一-鿿]/;
// カタカナ語(外来語・中黒複合語含む)のみのトークンは未知語でも正常とみなす
const KATAKANA_ONLY = /^[ァ-ヶー〜・]+$/;

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

function loadAllowlist() {
  if (!existsSync(ALLOWLIST_PATH)) return new Set();
  return new Set(
    readFileSync(ALLOWLIST_PATH, "utf8")
      .split("\n")
      .map((line) => line.replace(/#.*$/, "").trim())
      .filter((line) => line.length > 0),
  );
}

// スコープ外領域(コードブロック・インラインコード・URL・タグ)を、
// 行番号を保つため改行以外を空白に置換してマスクする
function maskOutOfScope(text) {
  const blank = (m) => m.replace(/[^\n]/g, " ");
  return text
    .replace(/```[\s\S]*?```/g, blank) // フェンスコードブロック
    .replace(/`[^`\n]*`/g, blank) // インラインコード
    .replace(/https?:\/\/[^\s)]+/g, blank) // URL
    .replace(/<\/?[A-Za-z][^<>]*>/g, blank); // JSX/HTMLタグ
}

function lineOf(text, index) {
  let line = 1;
  for (let i = 0; i < index && i < text.length; i++) {
    if (text[i] === "\n") line++;
  }
  return line;
}

function contextOf(text, index, length) {
  return text
    .slice(Math.max(0, index - 10), index + length + 10)
    .replace(/\n/g, "␣");
}

// 1. 異常コードポイントの検出
function findAnomalousCodepoints(masked) {
  const findings = [];
  for (let i = 0; i < masked.length; i++) {
    const ch = masked[i];
    const cp = ch.codePointAt(0);
    let reason = null;
    if (cp === 0x3099 || cp === 0x309a) reason = "単独の結合濁点/半濁点";
    else if (cp === 0x3095 || cp === 0x3096) reason = `小書き仮名「${ch}」`;
    else if (cp === 0xfffd) reason = "置換文字U+FFFD";
    else if (cp < 0x20 && ch !== "\n" && ch !== "\t" && ch !== "\r")
      reason = `制御文字U+${cp.toString(16).toUpperCase().padStart(4, "0")}`;
    if (reason) {
      findings.push({ line: lineOf(masked, i), reason, context: contextOf(masked, i, 1) });
    }
  }
  return findings;
}

// 2. 既知の化けパターンの検出
function findKnownGarbled(masked) {
  const findings = [];
  for (const pattern of KNOWN_GARBLED_PATTERNS) {
    let index = masked.indexOf(pattern);
    while (index !== -1) {
      findings.push({
        line: lineOf(masked, index),
        reason: `既知の化けパターン「${pattern}」`,
        context: contextOf(masked, index, pattern.length),
      });
      index = masked.indexOf(pattern, index + pattern.length);
    }
  }
  return findings;
}

// 3. 形態素解析による未知語の検出
async function findUnknownTokens(masked, allowlist) {
  const findings = [];
  const tokens = await tokenize(masked);
  for (const token of tokens) {
    if (token.word_type !== "UNKNOWN") continue;
    const surface = token.surface_form;
    if (!HAS_JAPANESE.test(surface)) continue;
    if (KATAKANA_ONLY.test(surface)) continue;
    if (allowlist.has(surface)) continue;
    const index = token.word_position - 1;
    findings.push({
      line: lineOf(masked, index),
      reason: `辞書に無い日本語トークン「${surface}」`,
      context: contextOf(masked, index, surface.length),
    });
  }
  return findings;
}

async function checkText(raw, allowlist) {
  const findings = [];
  if (raw.normalize("NFC") !== raw) {
    findings.push({ line: 1, reason: "NFC非正規化テキスト(濁点分離などの疑い)", context: "(ファイル全体)" });
  }
  const masked = maskOutOfScope(raw);
  findings.push(...findAnomalousCodepoints(masked));
  findings.push(...findKnownGarbled(masked));
  findings.push(...(await findUnknownTokens(masked, allowlist)));
  findings.sort((a, b) => a.line - b.line);
  return findings;
}

async function selfTest(allowlist) {
  // 実事案(hitooshi-members, 2026-07)由来の化けサンプル。各検出器が最低1件ずつ反応すること
  const corruptedSample = [
    "学歴は大匲9割です。", // 既知パターン + 未知語(匲)
    "1人だけゖ孳の方がいた。", // 異常コードポイント(ゖ) + 未知語(孳)
    "同世代〜2、゙歳上でした。", // 単独結合濁点
    "サービスは突屈に感じます。", // 未知語(突/屈) ※両方常用漢字だが語として非実在
  ].join("\n");
  const cleanSample = [
    "こんにちは！普段は都内でエンジニアとして業務をしてます！",
    "学歴は大卒9割で、紹介された相手は全員30歳前後の女性でした。",
    "マッチングアプリでよく遭遇する光景とは噛み合いません。",
    "```typescript\nconst 大匲 = 1; // コードブロック内は対象外\n```",
  ].join("\n");

  const corruptedFindings = await checkText(corruptedSample, allowlist);
  const cleanFindings = await checkText(cleanSample, allowlist);

  const ok = corruptedFindings.length >= 6 && cleanFindings.length === 0;
  console.log(`self-test: 化けサンプル検出 ${corruptedFindings.length}件(期待>=6) / クリーンサンプル誤検知 ${cleanFindings.length}件(期待0)`);
  if (!ok) {
    console.error("self-test 失敗:");
    for (const f of [...corruptedFindings, ...cleanFindings]) {
      console.error(`  - L${f.line} ${f.reason} …${f.context}…`);
    }
    process.exit(1);
  }
  console.log("self-test: OK");
}

async function main() {
  const args = process.argv.slice(2);
  const allowlist = loadAllowlist();

  if (args.includes("--self-test")) {
    await selfTest(allowlist);
    return;
  }

  const files = args.length > 0 ? args.map((p) => path.resolve(p)) : collectMdxFiles(BLOGS_DIR);

  const errors = [];
  for (const filePath of files) {
    const relPath = path.relative(ROOT, filePath);
    const raw = readFileSync(filePath, "utf8");
    const findings = await checkText(raw, allowlist);
    for (const f of findings) {
      errors.push(`${relPath}: L${f.line} ${f.reason} …${f.context}…`);
    }
  }

  if (errors.length > 0) {
    console.error(`\n文字化けチェックでエラーが見つかりました(${errors.length}件):\n`);
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    console.error("\n誤検知(意図した表記)の場合は scripts/garbled-text-allowlist.txt に追記してください。\n");
    process.exit(1);
  }

  console.log(`文字化けチェック: 問題なし(${files.length}ファイルを検査、許可リスト${allowlist.size}語)`);
}

main();
