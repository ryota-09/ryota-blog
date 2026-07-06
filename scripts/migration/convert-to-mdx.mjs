// microCMSのバックアップデータ(.backup/microcms/)を content/ 配下のMDXへ一括変換するスクリプト。
//
// 実行: node scripts/migration/convert-to-mdx.mjs
//
// 特徴:
// - ネットワークアクセス無し。.backup/ のデータのみから決定的に変換する。
// - 冪等。content/ を削除して再実行しても同一出力になる(画像コピー・順序を固定)。
// - 変換内容は scripts/migration/conversion-report.md にレポートとして出力する。
//
// パイプライン:
//   rehype-parse(fragment) で richEditor HTML → hast
//   → 前処理(script除去・見出しid収集など、unist-util-visit)
//   → hast-util-to-mdast(カスタムハンドラで埋め込み要素をMDXコンポーネント化)
//   → mdast-util-to-markdown(gfm/mdx拡張)でMDX本文へシリアライズ
//
// frontmatter は js-yaml で dump する(キー順固定)。

import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import { toMdast } from "hast-util-to-mdast";
import { toMarkdown } from "mdast-util-to-markdown";
import { gfmToMarkdown } from "mdast-util-gfm";
import { mdxToMarkdown } from "mdast-util-mdx";
import { visit } from "unist-util-visit";
import yaml from "js-yaml";

// ── パス定義 ────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const BACKUP_DIR = path.join(ROOT, ".backup/microcms");
const CONTENT_DIR = path.join(ROOT, "content");
const BLOGS_DIR = path.join(CONTENT_DIR, "blogs");
const CATEGORY_IMAGES_DIR = path.join(CONTENT_DIR, "images/categories");
const REPORT_PATH = path.join(__dirname, "conversion-report.md");

// scripts/generate-categories.js の CATEGORY_SLUG_OVERRIDES と同一のロジックを流用する。
// microCMSのcontent idと、過去に公開しインデックスされたURLスラッグが異なる例外のみ列挙する。
const CATEGORY_SLUG_OVERRIDES = {
  "ui-parts": "ui_parts",
};

// カテゴリidにオーバーライドを適用してURL用スラッグを得る。
function categorySlug(id) {
  return CATEGORY_SLUG_OVERRIDES[id] || id;
}

// ── JSON読み込み ────────────────────────────────────────────
function loadJson(name) {
  return JSON.parse(readFileSync(path.join(BACKUP_DIR, name), "utf8"));
}

const blogsJa = loadJson("blogs.json");
const blogsEn = loadJson("blogs_en.json");
const categoriesJson = loadJson("categories.json");
const manifest = loadJson("manifest.json");

// microCMSアセットURL(クエリ・エンティティ除去後) → ローカルパス の対応表。
const assetByUrl = new Map();
for (const asset of manifest.assets) {
  assetByUrl.set(asset.url, asset);
}

// 記事id → 主カテゴリスラッグ(旧 /blogs/{slug} リンク解決用)。日本語版を情報源とする。
const primaryCategoryBySlug = new Map();
for (const post of blogsJa) {
  const first = (post.category || [])[0];
  if (first) {
    primaryCategoryBySlug.set(post.id, categorySlug(first.id));
  }
}

// ── 変換全体の集計(レポート用) ──────────────────────────────
const report = {
  posts: [], // 記事ごとの行
  images: new Set(), // コピーした記事画像のコピー先パス(重複排除)
  embeds: { tweet: 0, linkCard: 0, amazonLink: 0, moshimo: 0, copyable: 0 },
  brCount: 0,
  headingIdsTotal: 0,
  lossy: [], // 情報が落ちた/HTMLのまま残した箇所
  unknownHtmlBlocks: [], // 想定外のhtmlブロック
  removedScripts: [], // 想定外のscript
  unknownTags: [], // 変換できなかった要素タグ
  tableSpanFlags: [], // colspan/rowspan >= 2 を含むテーブル
  unresolvedBlogLinks: [], // 解決できなかった /blogs/{slug} リンク
  externalImages: [], // microCMS以外の外部画像
};

// ── アセットのファイル名生成 ────────────────────────────────
// 使用済みのコピー先(記事ディレクトリ単位)。同名衝突検知に使う。
// key: `${slug}/images/${filename}` → asset.url(初回に割り当てたURL)
const assignedNames = new Map();

// マニフェストのファイル名を NFC 正規化し、空白を "-" に置換する。
function normalizeFilename(rawName) {
  const nfc = rawName.normalize("NFC");
  return nfc.replace(/\s+/g, "-");
}

// microCMSの画像URL(HTMLエンティティ・クエリ付きの可能性あり)をマニフェストのアセットへ解決する。
// 解決できない場合は null を返す。
function resolveAsset(rawSrc) {
  // HTMLエンティティ(&amp;)を戻し、クエリ文字列を除去してベースURLを得る。
  const decoded = rawSrc.replace(/&amp;/g, "&");
  const baseUrl = decoded.split("?")[0];
  return assetByUrl.get(baseUrl) || null;
}

// アセットを記事ディレクトリの images/ へコピーし、参照用の相対パス(./images/ファイル名)を返す。
// slug: 記事slug / asset: マニフェストのアセット / kind: "thumbnail" | "body"(ログ用)
function copyAssetToPost(slug, asset) {
  const rawName = asset.path.split("/").pop();
  let filename = normalizeFilename(rawName);
  const key = `${slug}::${filename}`;

  // 同一記事内で同名ファイルが別アセットとして衝突した場合は assetId 先頭8文字をプレフィックスする。
  if (assignedNames.has(key) && assignedNames.get(key) !== asset.url) {
    const assetId = asset.path.split("/")[1] || "";
    filename = `${assetId.slice(0, 8)}-${filename}`;
  }
  const finalKey = `${slug}::${filename}`;
  assignedNames.set(finalKey, asset.url);

  const destDir = path.join(BLOGS_DIR, slug, "images");
  const destPath = path.join(destDir, filename);
  if (!existsSync(destPath)) {
    mkdirSync(destDir, { recursive: true });
    copyFileSync(path.join(BACKUP_DIR, asset.path), destPath);
  }
  report.images.add(path.relative(ROOT, destPath));
  return `./images/${filename}`;
}

// ── リンク正規化 ────────────────────────────────────────────
// a[href] の href を、記事のlocale・記事slug文脈に応じて相対パス/正規URLへ書き換える。
function normalizeHref(href, slug, locale) {
  if (typeof href !== "string" || href.length === 0) return href;

  // 既知の壊れリンク修正: href="/example.com" → https://example.com
  if (href === "/example.com" || href.startsWith("/example.com/")) {
    return "https://" + href.slice(1);
  }

  // ryotablog.jp(www有無)プレフィックスを除去して相対パス化する。
  let normalized = href.replace(/^https?:\/\/(www\.)?ryotablog\.jp/, "");
  if (normalized === "") normalized = "/";

  // フラグメントのみ(#h...)はそのまま維持する。
  if (normalized.startsWith("#")) return normalized;

  // 旧形式 /blogs/{slug}(locale・カテゴリ無し)を新形式へ書き換える。
  const oldBlogMatch = normalized.match(/^\/blogs\/([^/?#]+)(\/)?([?#].*)?$/);
  if (oldBlogMatch) {
    const targetSlug = oldBlogMatch[1];
    const suffix = oldBlogMatch[3] || "";
    // /blogs 単体(slug無し)は一覧ページなので相対のまま返す。
    if (targetSlug === "blogs" || normalized === "/blogs" || normalized === "/blogs/") {
      return normalized;
    }
    const cat = primaryCategoryBySlug.get(targetSlug);
    if (cat) {
      return `/${locale}/blogs/${cat}/${targetSlug}${suffix}`;
    }
    // 解決できないslugはレポートに記録して元のまま返す。
    report.unresolvedBlogLinks.push({ slug, locale, href });
    return normalized;
  }

  // /{locale}/blogs/{cat}/{slug} などその他の内部パスは相対化のみで返す。
  return normalized;
}

// ── Twitter URL整形 ─────────────────────────────────────────
// blockquote.twitter-tweet 内の a[href*="/status/"] からステータスIDとクリーンURLを抽出する。
function extractTweet(node) {
  let statusUrl = null;
  visit(node, "element", (el) => {
    if (el.tagName === "a" && el.properties && typeof el.properties.href === "string") {
      const m = el.properties.href.match(/https?:\/\/(?:twitter\.com|x\.com)\/([^/]+)\/status\/(\d+)/);
      if (m) {
        // ?ref_src= 等のクエリを除去したクリーンなツイートURL。
        statusUrl = `https://twitter.com/${m[1]}/status/${m[2]}`;
      }
    }
  });
  if (!statusUrl) return null;
  const id = statusUrl.match(/status\/(\d+)/)[1];
  return { id, url: statusUrl };
}

// ── hast前処理 ──────────────────────────────────────────────
// script除去・見出しidの収集を行う。収集したidは headingIds へ push する。
function preprocessHast(tree, headingIds, slug) {
  // 除去対象ノードを親から取り除くため、親参照付きで走査する。
  visit(tree, "element", (node, index, parent) => {
    if (node.tagName === "script") {
      const src = (node.properties && node.properties.src) || "";
      const isEmbedScript = /iframe\.ly|iframely\.net|platform\.twitter\.com/.test(String(src));
      if (!isEmbedScript) {
        // 想定外のscriptはレポートに記録してから削除する。
        report.removedScripts.push({ slug, src: String(src) });
      }
      if (parent && Array.isArray(parent.children) && typeof index === "number") {
        parent.children.splice(index, 1);
        return index; // 同じindexを再訪(削除により後続が繰り上がるため)
      }
    }
  });

  // 見出しidの収集(文書順)。id属性はこの後のmdast変換で使わないため、ここでは収集のみ行う。
  visit(tree, "element", (node) => {
    if (/^h[1-6]$/.test(node.tagName)) {
      const id = node.properties && node.properties.id;
      if (typeof id === "string" && id.length > 0) {
        headingIds.push(id);
      }
    }
  });
}

// クラス名配列を取得するヘルパ(rehype-parseはclassNameを配列で持つ)。
function classList(node) {
  const cn = node.properties && node.properties.className;
  if (Array.isArray(cn)) return cn;
  if (typeof cn === "string") return cn.split(/\s+/);
  return [];
}

// ── richEditor HTML → mdast ノード配列 ──────────────────────
function richEditorToMdast(html, ctx) {
  const { slug, locale } = ctx;
  const hast = unified().use(rehypeParse, { fragment: true }).parse(html);

  const headingIds = [];
  preprocessHast(hast, headingIds, slug);
  // 収集した見出しidを記事全体の配列へ引き継ぐ。
  ctx.headingIds.push(...headingIds);

  const mdast = toMdast(hast, {
    handlers: {
      // <u> はデフォルトでemphasis化されるため、mdxJsxTextElementとして維持する。
      u(state, node) {
        return {
          type: "mdxJsxTextElement",
          name: "u",
          attributes: [],
          children: state.all(node),
        };
      },

      // <span class="copy"> → <Copyable>テキスト</Copyable>
      span(state, node) {
        if (classList(node).includes("copy")) {
          report.embeds.copyable += 1;
          return {
            type: "mdxJsxTextElement",
            name: "Copyable",
            attributes: [],
            children: state.all(node),
          };
        }
        // それ以外のspanは子要素をそのまま展開する(デフォルト相当)。
        return state.all(node);
      },

      // 空段落(<p></p> / <p><br></p>)を <br /> に変換する。
      // 現行レンダリングが空pを<br>として表示しており、記事のスペーシングを維持するため。
      p(state, node) {
        if (isEmptyParagraph(node)) {
          report.brCount += 1;
          return { type: "mdxJsxFlowElement", name: "br", attributes: [], children: [] };
        }
        // 通常の段落はデフォルト処理(paragraphノード)。
        const result = { type: "paragraph", children: state.all(node) };
        state.patch(node, result);
        return result;
      },

      // <blockquote class="twitter-tweet"> → <Tweet id url />
      blockquote(state, node) {
        if (classList(node).includes("twitter-tweet")) {
          const tweet = extractTweet(node);
          if (tweet) {
            report.embeds.tweet += 1;
            return {
              type: "mdxJsxFlowElement",
              name: "Tweet",
              attributes: [
                { type: "mdxJsxAttribute", name: "id", value: tweet.id },
                { type: "mdxJsxAttribute", name: "url", value: tweet.url },
              ],
              children: [],
            };
          }
        }
        // 通常のblockquoteはデフォルト処理。
        return defaultBlockquote(state, node);
      },

      // div: iframelyリンクカード / コードブロックラッパー(data-filename)を判定する。
      div(state, node) {
        // iframelyリンクカード → <LinkCard url />
        if (classList(node).includes("iframely-embed")) {
          const url = extractLinkCardUrl(node);
          if (url) {
            report.embeds.linkCard += 1;
            return {
              type: "mdxJsxFlowElement",
              name: "LinkCard",
              attributes: [{ type: "mdxJsxAttribute", name: "url", value: url }],
              children: [],
            };
          }
        }
        // data-filename ラッパー(<div data-filename><pre><code class="language-xxx">)→ codeノード
        if (node.properties && typeof node.properties.dataFilename === "string") {
          const code = extractCodeNode(node, node.properties.dataFilename);
          if (code) return code;
        }
        // それ以外のdivは子要素を展開する(mdastにdiv概念は無いため)。
        return state.all(node);
      },

      // <pre> 直下の code(ラッパー無し)→ codeノード
      pre(state, node) {
        const code = extractCodeNode(node, null);
        if (code) return code;
        return defaultPre(state, node);
      },

      // <figure> は子のimgを取り出して段落にする(mdastのfigure概念は無い)。
      figure(state, node) {
        return state.all(node);
      },

      // <img> → mdast image(microCMS画像はローカルコピー、外部はそのまま)
      img(state, node) {
        return imgToMdast(node, ctx);
      },

      // <a> → リンク正規化を適用しつつ通常のlinkノードへ。
      a(state, node) {
        const href = node.properties && node.properties.href;
        const result = {
          type: "link",
          url: normalizeHref(href, slug, locale),
          title: node.properties && node.properties.title ? node.properties.title : null,
          children: state.all(node),
        };
        state.patch(node, result);
        return result;
      },

      // テーブル: colspan/rowspan >= 2 を含む場合のみレポートにフラグ。変換自体はデフォルト(GFM)。
      table(state, node) {
        flagTableSpans(node, slug, locale);
        return defaultTable(state, node);
      },
    },
  });

  return mdast.children;
}

// ── ハンドラ補助関数 ────────────────────────────────────────

// 段落が空(子なし/空白のみ、または<br>のみ)かどうかを判定する。
function isEmptyParagraph(node) {
  const children = node.children || [];
  const meaningful = children.filter((c) => {
    if (c.type === "text") return c.value.trim().length > 0;
    if (c.type === "element" && c.tagName === "br") return false;
    return true;
  });
  return meaningful.length === 0;
}

// iframely-embed から埋め込みURL(内部の a[href])を抽出する。
function extractLinkCardUrl(node) {
  let url = null;
  visit(node, "element", (el) => {
    if (el.tagName === "a" && el.properties && typeof el.properties.href === "string" && !url) {
      url = el.properties.href;
    }
  });
  return url;
}

// pre または div[data-filename] から言語・ファイル名付きの mdast code ノードを生成する。
// filename が null の場合は data-filename 由来のタイトル無し。
function extractCodeNode(node, filename) {
  // 内部の <pre><code> を探す。
  let codeEl = null;
  visit(node, "element", (el) => {
    if (el.tagName === "code" && !codeEl) codeEl = el;
  });
  if (!codeEl) return null;

  // language-xxx クラスから言語を取得する。
  let lang = null;
  for (const cls of classList(codeEl)) {
    const m = cls.match(/^language-(.+)$/);
    if (m) {
      lang = m[1];
      break;
    }
  }

  // コード本文を取得する(hastのテキストノードを結合)。rehype-parseは実体参照を復号済み。
  const value = hastTextContent(codeEl).replace(/\n$/, "");

  const code = { type: "code", lang: lang || null, meta: null, value };
  if (filename) {
    // meta に title="ファイル名" を付与する(MultiCodeBlock がタイトル表示に使用する想定)。
    code.meta = `title="${filename}"`;
  }
  return code;
}

// hast要素配下のテキストを結合して返す。
function hastTextContent(node) {
  let out = "";
  visit(node, "text", (t) => {
    out += t.value;
  });
  return out;
}

// img要素をmdast imageノードへ変換する。microCMS画像はローカルコピーする。
function imgToMdast(node, ctx) {
  const props = node.properties || {};
  const src = typeof props.src === "string" ? props.src : "";
  const alt = typeof props.alt === "string" ? props.alt : "";

  if (/images\.microcms-assets\.io/.test(src)) {
    const asset = resolveAsset(src);
    if (asset) {
      const relPath = copyAssetToPost(ctx.slug, asset);
      return { type: "image", url: relPath, alt, title: null };
    }
    // マニフェスト解決不能: レポートに記録し、元URLのままimageノードにする。
    report.lossy.push({ slug: ctx.slug, locale: ctx.locale, kind: "image-unresolved", detail: src });
    return { type: "image", url: src, alt, title: null };
  }

  // microCMS以外の外部画像はそのままimageノードに(レポートに記録)。
  report.externalImages.push({ slug: ctx.slug, locale: ctx.locale, src });
  return { type: "image", url: src, alt, title: null };
}

// テーブル内に colspan/rowspan >= 2 のセルがあればレポートにフラグする。
function flagTableSpans(node, slug, locale) {
  let flagged = false;
  visit(node, "element", (el) => {
    if ((el.tagName === "td" || el.tagName === "th") && el.properties) {
      const cs = parseInt(el.properties.colSpan, 10);
      const rs = parseInt(el.properties.rowSpan, 10);
      if ((cs && cs >= 2) || (rs && rs >= 2)) flagged = true;
    }
  });
  if (flagged) report.tableSpanFlags.push({ slug, locale });
}

// hast-util-to-mdast のデフォルトハンドラを間接的に呼ぶためのフォールバック実装。
// (ライブラリのデフォルトハンドラを直接importせず、標準的な変換相当を自前で組む。)
function defaultBlockquote(state, node) {
  const result = { type: "blockquote", children: state.toFlow(state.all(node)) };
  state.patch(node, result);
  return result;
}
function defaultPre(state, node) {
  // <pre> 単体(code無し)はテキストをそのままcodeノード化する。
  const value = hastTextContent(node).replace(/\n$/, "");
  return { type: "code", lang: null, meta: null, value };
}
function defaultTable(state, node) {
  // GFMテーブルへの変換はライブラリのデフォルトに委ねたいが、handlersでtableを上書きすると
  // デフォルトが失われるため、ここでhast構造から直接mdast tableを構築する。
  return buildMdastTable(state, node);
}

// hastのtableからmdast tableを構築する(colspan/rowspanは1前提=実データで確認済み)。
function buildMdastTable(state, node) {
  const rows = [];
  visit(node, "element", (el) => {
    if (el.tagName === "tr") {
      const cells = [];
      for (const child of el.children || []) {
        if (child.type === "element" && (child.tagName === "td" || child.tagName === "th")) {
          cells.push({ type: "tableCell", children: state.all(child) });
        }
      }
      rows.push({ type: "tableRow", children: cells });
    }
  });
  return { type: "table", align: [], children: rows };
}

// ── HTMLブロック(AMAZON / Moshimo)の変換 ───────────────────

// AMAZON html を <AmazonLink ... /> のmdxJsxFlowElementへ変換する。
function convertAmazonBlock(html, ctx) {
  // "AMAZON" プレフィックスを除去してからパースする。
  const body = html.replace(/^AMAZON\s*/, "");
  const hast = unified().use(rehypeParse, { fragment: true }).parse(body);

  let href = null;
  let image = null;
  let title = "";
  let trackingImage = null;

  // 構造: <a href="クリックURL"><img src="商品画像"><br>タイトル</a><img src="トラッキング1x1">
  // アンカーとトラッキングimgはフラグメント直下の兄弟なので、トップレベルの子を走査する。
  // (recursive visitだとアンカー内の商品imgを誤ってトラッキングimgとして拾うため使わない)
  for (const el of hast.children || []) {
    if (el.type !== "element") continue;
    if (el.tagName === "a" && el.properties && href === null) {
      href = String(el.properties.href || "");
      // アンカー内のimg(商品画像)とタイトルテキストを取り出す。
      visit(el, "element", (inner) => {
        if (inner.tagName === "img" && inner.properties && !image) {
          image = String(inner.properties.src || "");
        }
      });
      title = hastTextContent(el).trim();
    } else if (el.tagName === "img" && el.properties && !trackingImage) {
      // アンカーの外(トップレベル)に出現するimg = トラッキングピクセル。
      trackingImage = String(el.properties.src || "");
    }
  }

  report.embeds.amazonLink += 1;

  const attributes = [
    { type: "mdxJsxAttribute", name: "href", value: href || "" },
    { type: "mdxJsxAttribute", name: "image", value: image || "" },
    { type: "mdxJsxAttribute", name: "title", value: title },
  ];
  if (trackingImage) {
    attributes.push({ type: "mdxJsxAttribute", name: "trackingImage", value: trackingImage });
  }
  return { type: "mdxJsxFlowElement", name: "AmazonLink", attributes, children: [] };
}

// Moshimo html から msmaflink({...}) の引数JSONを抽出してパースする。
function parseMoshimoJson(html) {
  // msmaflink( の直後から、対応する ) までを括弧の対応で切り出す。
  const startToken = "msmaflink(";
  const startIdx = html.indexOf(startToken);
  if (startIdx === -1) return null;
  let i = startIdx + startToken.length;
  // 最初の { まで進む。
  while (i < html.length && html[i] !== "{") i++;
  const objStart = i;
  let depth = 0;
  let inStr = false;
  let strCh = "";
  for (; i < html.length; i++) {
    const ch = html[i];
    if (inStr) {
      if (ch === "\\") {
        i++; // エスケープ次文字をスキップ
        continue;
      }
      if (ch === strCh) inStr = false;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inStr = true;
      strCh = ch;
      continue;
    }
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        const jsonStr = html.slice(objStart, i + 1);
        return JSON.parse(jsonStr);
      }
    }
  }
  return null;
}

// ── 記事1件の変換 ───────────────────────────────────────────
function convertPost(post, locale) {
  const slug = post.id;
  const ctx = { slug, locale, headingIds: [] };

  const blockOutputs = []; // 各ブロックのMDX文字列
  const moshimoWidgets = []; // frontmatterに載せるMoshimoオブジェクト配列
  let blockCount = 0;
  let bodyImageCount = 0;
  let bodyEmbedCount = 0;

  for (const block of post.body || []) {
    blockCount += 1;

    if (block.fieldId === "richEditor") {
      const nodes = richEditorToMdast(block.richEditor || "", ctx);
      // ブロックをrootにまとめてシリアライズする。
      const md = serializeMdast(nodes);
      if (md.trim().length > 0) blockOutputs.push(md);
      // 埋め込み・画像数をこのブロックからカウントする。
      countBlockStats(nodes, (imgs, embeds) => {
        bodyImageCount += imgs;
        bodyEmbedCount += embeds;
      });
      continue;
    }

    if (block.fieldId === "html") {
      const html = block.html || "";
      if (html.startsWith("AMAZON")) {
        const node = convertAmazonBlock(html, ctx);
        blockOutputs.push(serializeMdast([node]));
        bodyEmbedCount += 1;
        continue;
      }
      if (html.includes("MoshimoAffiliateEasyLink") || html.includes("msmaflink(")) {
        const json = parseMoshimoJson(html);
        if (json) {
          const idx = moshimoWidgets.length;
          moshimoWidgets.push(json);
          report.embeds.moshimo += 1;
          bodyEmbedCount += 1;
          const node = {
            type: "mdxJsxFlowElement",
            name: "MoshimoAffiliate",
            attributes: [{ type: "mdxJsxAttribute", name: "id", value: String(idx) }],
            children: [],
          };
          blockOutputs.push(serializeMdast([node]));
          continue;
        }
        // パース不能: 想定外として記録する。
        report.unknownHtmlBlocks.push({ slug, locale, reason: "moshimo-parse-failed", head: html.slice(0, 60) });
        continue;
      }
      // それ以外のhtmlブロックは想定外。レポートに記録し、そのままJSXとして出力を試みる。
      report.unknownHtmlBlocks.push({ slug, locale, reason: "unknown-html", head: html.slice(0, 80) });
      blockOutputs.push(html);
      continue;
    }

    // 未知のfieldId。
    report.unknownHtmlBlocks.push({ slug, locale, reason: "unknown-fieldId:" + block.fieldId, head: "" });
  }

  // frontmatterを構築する。
  const frontmatter = buildFrontmatter(post, ctx, moshimoWidgets);

  // ブロック出力を空行で連結する。
  const bodyMd = blockOutputs.join("\n\n").trim();
  const fileContent = `---\n${frontmatter}---\n\n${bodyMd}\n`;

  // 記事統計をレポートに記録する。
  report.headingIdsTotal += ctx.headingIds.length;
  report.posts.push({
    slug,
    locale,
    blockCount,
    imageCount: bodyImageCount,
    embedCount: bodyEmbedCount,
    headingIds: ctx.headingIds.length,
  });

  // ファイル書き出し。
  const destDir = path.join(BLOGS_DIR, slug);
  mkdirSync(destDir, { recursive: true });
  writeFileSync(path.join(destDir, `index.${locale}.mdx`), fileContent);

  return { bodyMd, frontmatter };
}

// mdastノード配列をrootに包んでMDX文字列へシリアライズする。
function serializeMdast(nodes) {
  const tree = { type: "root", children: nodes };
  return toMarkdown(tree, {
    extensions: [gfmToMarkdown(), mdxToMarkdown()],
    bullet: "-",
    fences: true,
    rule: "-",
  }).trim();
}

// mdastノード配列から画像数・埋め込み数を数える(記事表用)。
function countBlockStats(nodes, cb) {
  let imgs = 0;
  let embeds = 0;
  const jsxNames = new Set(["Tweet", "LinkCard", "AmazonLink", "MoshimoAffiliate"]);
  const walk = (node) => {
    if (node.type === "image") imgs += 1;
    if ((node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") && jsxNames.has(node.name)) {
      embeds += 1;
    }
    for (const child of node.children || []) walk(child);
  };
  for (const n of nodes) walk(n);
  cb(imgs, embeds);
}

// ── frontmatter構築 ─────────────────────────────────────────
function buildFrontmatter(post, ctx, moshimoWidgets) {
  const fm = {};
  fm.title = post.title;
  fm.description = post.description;
  fm.publishedAt = post.publishedAt;
  fm.updatedAt = post.updatedAt;

  // categories: category配列のid順序を維持し、オーバーライドを適用する。
  fm.categories = (post.category || []).map((c) => categorySlug(c.id));

  // thumbnail: サムネイル画像をimages/へコピーして相対パスにする。無い記事は省略。
  if (post.thumbnail && post.thumbnail.url) {
    const asset = resolveAsset(post.thumbnail.url);
    if (asset) {
      fm.thumbnail = copyAssetToPost(ctx.slug, asset);
    } else {
      report.lossy.push({ slug: ctx.slug, locale: ctx.locale, kind: "thumbnail-unresolved", detail: post.thumbnail.url });
    }
  }

  // noIndex / isAdvertisement: true の場合のみ出力する。
  if (post.noIndex === true) fm.noIndex = true;
  if (post.isAdvertisement === true) fm.isAdvertisement = true;

  // related: relatedContentのid配列。空なら省略。
  const related = (post.relatedContent || []).map((r) => r.id).filter(Boolean);
  if (related.length > 0) fm.related = related;

  // headingIds: 本文全体の見出しid(文書順)。空なら省略。
  if (ctx.headingIds.length > 0) fm.headingIds = ctx.headingIds;

  // moshimoWidgets: もしもウィジェットのJSONオブジェクト配列(出現順)。無ければ省略。
  if (moshimoWidgets.length > 0) fm.moshimoWidgets = moshimoWidgets;

  // キー順を固定してdumpする(js-yamlはオブジェクト挿入順を維持する)。
  const ordered = {};
  for (const key of [
    "title",
    "description",
    "publishedAt",
    "updatedAt",
    "categories",
    "thumbnail",
    "noIndex",
    "isAdvertisement",
    "related",
    "headingIds",
    "moshimoWidgets",
  ]) {
    if (key in fm) ordered[key] = fm[key];
  }
  return yaml.dump(ordered, { lineWidth: -1, noRefs: true, quotingType: '"' });
}

// ── カテゴリマスタの出力 ────────────────────────────────────
function convertCategories() {
  const out = [];
  for (const cat of categoriesJson) {
    let iconRel = null;
    if (cat.icon && cat.icon.url) {
      const asset = resolveAsset(cat.icon.url);
      if (asset) {
        const rawName = asset.path.split("/").pop();
        const filename = normalizeFilename(rawName);
        const destPath = path.join(CATEGORY_IMAGES_DIR, filename);
        if (!existsSync(destPath)) {
          mkdirSync(CATEGORY_IMAGES_DIR, { recursive: true });
          copyFileSync(path.join(BACKUP_DIR, asset.path), destPath);
        }
        iconRel = `./images/categories/${filename}`;
      } else {
        report.lossy.push({ slug: "(category)" + cat.id, locale: "-", kind: "category-icon-unresolved", detail: cat.icon.url });
      }
    }
    out.push({
      id: categorySlug(cat.id),
      name: cat.name,
      name_en: cat.name_en || cat.name,
      icon: iconRel,
      bg_color: cat.bg_color || null,
    });
  }
  mkdirSync(CONTENT_DIR, { recursive: true });
  writeFileSync(path.join(CONTENT_DIR, "categories.json"), JSON.stringify(out, null, 2) + "\n");
  return out;
}

// ── レポート生成 ────────────────────────────────────────────
function writeReport(categories) {
  const jaPosts = report.posts.filter((p) => p.locale === "ja");
  const totalImages = report.images.size;

  const lines = [];
  lines.push("# microCMS → MDX 変換レポート");
  lines.push("");
  lines.push(`生成日時(スクリプト実行時): このレポートは \`node scripts/migration/convert-to-mdx.mjs\` により自動生成されます。`);
  lines.push("");

  // グローバルサマリ
  lines.push("## グローバルサマリ");
  lines.push("");
  lines.push(`- 記事数: ${report.posts.length} ファイル(${jaPosts.length} slug × 2 locale)`);
  lines.push(`- カテゴリ数: ${categories.length} 件`);
  lines.push(`- 画像コピー数(記事コロケーション, 重複排除): ${totalImages} ファイル`);
  lines.push(`- 見出しid合計(全ファイル, h1〜h6): ${report.headingIdsTotal}`);
  lines.push("");
  lines.push("### 埋め込み変換件数(全ファイル実測)");
  lines.push("");
  lines.push(`- Tweet: ${report.embeds.tweet}`);
  lines.push(`- LinkCard: ${report.embeds.linkCard}`);
  lines.push(`- AmazonLink: ${report.embeds.amazonLink}`);
  lines.push(`- MoshimoAffiliate: ${report.embeds.moshimo}`);
  lines.push(`- Copyable: ${report.embeds.copyable}`);
  lines.push(`- \`<br />\` 変換(空段落由来): ${report.brCount}`);
  lines.push("");

  // 記事ごとの表
  lines.push("## 記事ごとの変換内訳");
  lines.push("");
  lines.push("| slug | locale | ブロック数 | 画像数 | 埋め込み数 | 見出しid数 | フラグ |");
  lines.push("|---|---|---|---|---|---|---|");
  for (const p of report.posts) {
    const flags = collectPostFlags(p.slug, p.locale);
    lines.push(
      `| ${p.slug} | ${p.locale} | ${p.blockCount} | ${p.imageCount} | ${p.embedCount} | ${p.headingIds} | ${flags || "-"} |`,
    );
  }
  lines.push("");

  // 情報が落ちた/HTMLのまま残した箇所
  lines.push("## HTMLのまま残した・情報が落ちた箇所");
  lines.push("");
  const lossyItems = [];
  for (const u of report.unknownHtmlBlocks) {
    lossyItems.push(`- [${u.slug}/${u.locale}] 想定外htmlブロック(${u.reason}): \`${u.head}\``);
  }
  for (const s of report.removedScripts) {
    lossyItems.push(`- [${s.slug}] 想定外scriptを削除: src=\`${s.src}\``);
  }
  for (const l of report.lossy) {
    lossyItems.push(`- [${l.slug}/${l.locale}] ${l.kind}: \`${l.detail}\``);
  }
  for (const t of report.unknownTags) {
    lossyItems.push(`- [${t.slug}/${t.locale}] 未変換タグ: \`${t.tag}\``);
  }
  for (const link of report.unresolvedBlogLinks) {
    lossyItems.push(`- [${link.slug}/${link.locale}] 解決できなかった /blogs/ リンク: \`${link.href}\``);
  }
  for (const img of report.externalImages) {
    lossyItems.push(`- [${img.slug}/${img.locale}] microCMS以外の外部画像(URLのまま): \`${img.src}\``);
  }
  if (lossyItems.length === 0) {
    lines.push("なし");
  } else {
    lines.push(...lossyItems);
  }
  lines.push("");

  // テーブルspanフラグ
  lines.push("## テーブルの colspan/rowspan >= 2 フラグ");
  lines.push("");
  if (report.tableSpanFlags.length === 0) {
    lines.push("なし(全テーブルのセルは colspan=1 / rowspan=1)");
  } else {
    for (const t of report.tableSpanFlags) {
      lines.push(`- [${t.slug}/${t.locale}] colspan/rowspan >= 2 のセルを含むテーブルあり(要目視確認)`);
    }
  }
  lines.push("");

  // 代表3記事の元HTML↔MDX出力の対応抜粋(コード多め・埋め込み多め・テーブルあり)
  lines.push("## 代表記事の元HTML↔MDX出力 対応抜粋");
  lines.push("");
  lines.push(...buildExcerptSection());
  lines.push("");

  // 目視レビューチェックリスト
  lines.push("## 目視レビューチェックリスト(全60ファイル)");
  lines.push("");
  for (const p of jaPosts) {
    lines.push(`- [ ] ${p.slug} (ja/en)`);
  }
  lines.push("");

  writeFileSync(REPORT_PATH, lines.join("\n"));
}

// 代表3記事について、元microCMS HTMLと生成MDXの対応箇所を抜粋してレポートに載せる。
// 決定的に再現できるよう、バックアップJSONと生成済みMDXから実データを読んで組み立てる。
function buildExcerptSection() {
  const out = [];

  // richEditorブロックを結合したHTMLから、正規表現にマッチする最初の断片を返すヘルパ。
  const rawHtml = (slug) => {
    const post = blogsJa.find((p) => p.id === slug);
    if (!post) return "";
    return (post.body || []).map((b) => b.richEditor || (b.html ? b.html : "")).join("");
  };
  const firstMatch = (html, re) => {
    const m = html.match(re);
    return m ? m[0] : "(該当なし)";
  };
  // 生成MDXから、パターンを含む最初の行を返す。
  const mdxLine = (slug, needle) => {
    const src = readFileSync(path.join(BLOGS_DIR, slug, "index.ja.mdx"), "utf8");
    const line = src.split("\n").find((l) => l.includes(needle));
    return line ? line.trim() : "(該当なし)";
  };
  // 生成MDXから、開始パターン行から数行を返す。
  const mdxLinesFrom = (slug, needle, count) => {
    const src = readFileSync(path.join(BLOGS_DIR, slug, "index.ja.mdx"), "utf8");
    const arr = src.split("\n");
    const idx = arr.findIndex((l) => l.includes(needle));
    if (idx === -1) return "(該当なし)";
    return arr.slice(idx, idx + count).join("\n");
  };

  // (1) コード多め・テーブルあり: amplify-custom-ssl-acm-import
  {
    const slug = "amplify-custom-ssl-acm-import";
    out.push(`### 代表1: \`${slug}\`(コードブロック多数・テーブルあり)`);
    out.push("");
    out.push("元HTML(data-filenameラッパー付きコードブロック):");
    out.push("");
    out.push("~~~html");
    out.push(firstMatch(rawHtml(slug), /<div data-filename="[^"]*"><pre><code class="language-[a-z]*">[\s\S]{0,80}/));
    out.push("~~~");
    out.push("");
    out.push("MDX出力(言語+title付きフェンス):");
    out.push("");
    out.push("~~~text");
    out.push(mdxLine(slug, 'title="terminal"'));
    out.push("~~~");
    out.push("");
  }

  // (2) 埋め込み多め: best-buy-2026-first-half
  {
    const slug = "best-buy-2026-first-half";
    out.push(`### 代表2: \`${slug}\`(もしもウィジェット×9・画像多数)`);
    out.push("");
    out.push("元HTML(msmaflink JSON、eidを含む):");
    out.push("");
    out.push("~~~html");
    out.push(firstMatch(rawHtml(slug), /msmaflink\(\{"n":[\s\S]{0,120}/));
    out.push("~~~");
    out.push("");
    out.push("MDX出力(frontmatter moshimoWidgets[0] へ格納 + 本文はプレースホルダ):");
    out.push("");
    out.push("~~~text");
    out.push(mdxLine(slug, '<MoshimoAffiliate id="0"'));
    out.push("~~~");
    out.push("");
  }

  // (3) テーブルあり・コードあり: jstqb-foundation-study-method
  {
    const slug = "jstqb-foundation-study-method";
    out.push(`### 代表3: \`${slug}\`(GFMテーブル・コードフェンス)`);
    out.push("");
    out.push("元HTML(table/th/td、セル内はp):");
    out.push("");
    out.push("~~~html");
    out.push(firstMatch(rawHtml(slug), /<table><tbody><tr><th[\s\S]{0,140}/));
    out.push("~~~");
    out.push("");
    out.push("MDX出力(GFMテーブル):");
    out.push("");
    out.push("~~~text");
    out.push(mdxLinesFrom(slug, "| 項目", 3));
    out.push("~~~");
    out.push("");
  }

  return out;
}

// 記事1件に紐づくフラグを収集して文字列化する。
function collectPostFlags(slug, locale) {
  const flags = [];
  if (report.unknownHtmlBlocks.some((u) => u.slug === slug && u.locale === locale)) flags.push("想定外html");
  if (report.tableSpanFlags.some((t) => t.slug === slug && t.locale === locale)) flags.push("table-span");
  if (report.unresolvedBlogLinks.some((l) => l.slug === slug && l.locale === locale)) flags.push("未解決リンク");
  if (report.externalImages.some((i) => i.slug === slug && i.locale === locale)) flags.push("外部画像");
  if (report.lossy.some((l) => l.slug === slug && l.locale === locale)) flags.push("ロッシー");
  if (report.removedScripts.some((s) => s.slug === slug)) flags.push("script削除");
  return flags.join(", ");
}

// ── メイン ──────────────────────────────────────────────────
function main() {
  // 冪等性のため content/blogs と content/images/categories を作り直す。
  // (content/categories.json は下で上書きする)
  if (existsSync(BLOGS_DIR)) rmSync(BLOGS_DIR, { recursive: true, force: true });
  if (existsSync(CATEGORY_IMAGES_DIR)) rmSync(CATEGORY_IMAGES_DIR, { recursive: true, force: true });

  // カテゴリ変換(アイコンコピー含む)。
  const categories = convertCategories();

  // 日本語→英語の順で決定的に変換する(冪等性のため順序固定)。
  for (const post of blogsJa) convertPost(post, "ja");
  for (const post of blogsEn) convertPost(post, "en");

  // レポート出力。
  writeReport(categories);

  // コンソールサマリ。
  console.log("[convert-to-mdx] 変換完了");
  console.log(`  記事: ${report.posts.length} ファイル / カテゴリ: ${categories.length} 件`);
  console.log(`  画像コピー: ${report.images.size} / 見出しid合計: ${report.headingIdsTotal}`);
  console.log(
    `  埋め込み Tweet=${report.embeds.tweet} LinkCard=${report.embeds.linkCard} AmazonLink=${report.embeds.amazonLink} Moshimo=${report.embeds.moshimo} Copyable=${report.embeds.copyable} br=${report.brCount}`,
  );
  console.log(`  レポート: ${path.relative(ROOT, REPORT_PATH)}`);
}

main();
