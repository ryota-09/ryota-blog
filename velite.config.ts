// Velite設定ファイル。content/配下のMDX/JSONを型安全なJSONへビルドする。
// 設計の背景・制約は docs/adr/0001-content-layer.md を参照。
//
// - 出力は既定の `.velite/`（.gitignore対象、ビルド時生成物）
// - `next dev`はTurbopackのためVeliteのWebpackプラグインは使わず、CLIを別プロセスで並走させる(package.json参照)
import { writeFileSync } from "node:fs";
import path from "node:path";

import { context, defineCollection, defineConfig, s } from "velite";

import { extractPlainText, extractToc } from "./velite/mdast-utils";
import { rehypeCodeMeta } from "./velite/rehype-code-meta";
import { rehypeImageSize } from "./velite/rehype-image-size";
import { rehypeRestoreHeadingIds } from "./velite/rehype-restore-heading-ids";

// 現在パース中のファイルのパス(blogs/{slug}/index.{locale}.mdx)から slug と locale を抽出する
// (VeliteFile.pathはconfig.rootからの絶対パスのため、まずroot相対パスに正規化してから照合する)
const parseCurrentBlogPath = (): { slug: string; locale: "ja" | "en" } => {
  const { file, config } = context();
  const relativePath = path.relative(config.root, file.path).split(path.sep).join("/");
  const match = relativePath.match(/^blogs\/([^/]+)\/index\.(ja|en)\.mdx$/);
  if (!match) {
    throw new Error(`予期しないブログファイルパスです: ${relativePath}`);
  }
  return { slug: match[1], locale: match[2] as "ja" | "en" };
};

// もしもアフィリエイトウィジェットの構造。フィールド名はmicroCMSバックアップデータ由来の短縮キーをそのまま維持する
// (n=商品名, b=ブランド名, t=型番, d=画像ドメイン, c_p=画像共通パス, p=画像パス配列, u=リンク先,
//  v=バージョン, b_l=ボタンリスト, eid=もしも埋め込みid, s=もしもウィジェット種別)
const moshimoWidgetSchema = s.object({
  n: s.string(),
  b: s.string().optional(),
  t: s.string().optional(),
  d: s.string().optional(),
  c_p: s.string().optional(),
  p: s.array(s.string()).optional(),
  u: s
    .object({
      u: s.string(),
      t: s.string().optional(),
      r_v: s.string().optional(),
    })
    .optional(),
  v: s.string().optional(),
  b_l: s
    .array(
      s.object({
        id: s.number(),
        u_tx: s.string(),
        u_bc: s.string().optional(),
        u_url: s.string(),
        a_id: s.number().optional(),
        p_id: s.number().optional(),
        pl_id: s.number().optional(),
        pc_id: s.number().optional(),
        s_n: s.string().optional(),
        u_so: s.number().optional(),
      }),
    )
    .optional(),
  eid: s.string().optional(),
  s: s.string().optional(),
});

const blogs = defineCollection({
  name: "Blogs",
  pattern: "blogs/**/index.*.mdx",
  schema: s
    .object({
      // NOTE: ADRドラフトではmax(100)としていたが、実データ(EN記事)で最大123文字のタイトルが存在するため150に緩和
      title: s.string().max(150),
      description: s.string(),
      publishedAt: s.isodate(),
      updatedAt: s.isodate(),
      // カテゴリslug配列。先頭がプライマリカテゴリ(URLに使用)
      categories: s.array(s.string()).min(1),
      // 30記事中2記事はサムネイル無しのためoptional
      thumbnail: s.image().optional(),
      noIndex: s.boolean().default(false),
      isAdvertisement: s.boolean().default(false),
      // 関連記事slug配列
      related: s.array(s.string()).default([]),
      // microCMS由来の見出しid(出現順)。移行記事の後方互換用。
      // 空(=新規記事)の場合はTOC・HTMLとも見出しテキストのハッシュから
      // microCMS互換形式(h+16進10桁)のidを自動生成する
      // (velite/mdast-utils.ts の computeHeadingIds を参照)
      headingIds: s.array(s.string()).default([]),
      // 下書きフラグ。true の記事は本番ビルドの出力から除外される(prepareフック参照)。
      // 開発環境(NODE_ENV=development、package.jsonのpredev/dev/pretest参照)では除外しない
      draft: s.boolean().default(false),
      moshimoWidgets: s.array(moshimoWidgetSchema).default([]),
      body: s.mdx(),
      // 検索(plainText/toc計算)用の生MDX文字列
      raw: s.raw(),
    })
    .transform((data) => {
      const { slug, locale } = parseCurrentBlogPath();
      return {
        ...data,
        slug,
        locale,
        // frontmatterのheadingIdsと文書順の見出しを順序ベースでzipする
        toc: extractToc(data.raw, data.headingIds),
        // タイトル・説明とあわせて検索対象にする本文プレーンテキスト(コードブロック含む)
        plainText: extractPlainText(data.raw),
      };
    }),
});

const categories = defineCollection({
  name: "Categories",
  pattern: "categories.json",
  schema: s.object({
    // URL用スラッグ(microCMSのcontent idにオーバーライド適用済みの値。例: ui_parts)
    id: s.string(),
    name: s.string(),
    name_en: s.string(),
    // 現行UIでは未使用だが、JSONの情報を失わないため保持する(利用箇所ができた場合に備える)
    icon: s.string().optional(),
    bg_color: s.string().optional(),
  }),
});

export default defineConfig({
  collections: { blogs, categories },
  mdx: {
    // 見出しid復元・画像サイズ注入・codeメタ受け渡し(#236)。
    // 実行順序: rehypePluginsはremark段階(remarkCopyLinkedFiles含む)より後に実行されるため、
    // rehypeImageSizeは画像パスが/static/...へ書き換わった後の状態で実ファイルを解決する
    // (詳細はvelite/rehype-image-size.tsのコメント参照)。
    rehypePlugins: [rehypeRestoreHeadingIds, rehypeImageSize, rehypeCodeMeta],
  },
  // ビルド結果をファイル書き出し前に加工するフック(#240 draft運用)。
  // 本番ビルド(NODE_ENV=production。package.jsonのprebuildが明示的にセットする)でのみ、
  // draft: true の記事をコレクションから除外する。開発(NODE_ENV=development、predev/dev/pretest)では
  // 除外しないため、`npm run dev` 上ではdraft記事も通常どおりプレビューできる。
  // ここで data.blogs 自体を書き換えることで、.velite/ への出力(型付きJSON)と
  // 後続の complete フック(category-map.json生成)の両方に一箇所の変更で反映される。
  // (content.ts側にも将来のフィルタポイントのコメントがあったが、Veliteの出力自体から
  //  除外したほうが「データ層の起点」としてより上流であり、category-map.json含む全経路を
  //  一律にカバーできるためこちらを正とする)
  prepare: (data) => {
    if (process.env.NODE_ENV === "production") {
      data.blogs = data.blogs.filter((blog) => !blog.draft);
    }
  },
  complete: (data, { config }) => {
    // middleware.ts の旧URL(/blogs/{slug})リダイレクト用に、
    // 「slug×locale → プライマリカテゴリid」の軽量マップを別ファイルとして書き出す。
    // middlewareのバンドルに記事本文(body/raw/plainText等)が混入しないよう、
    // .velite/blogs.json (全フィールド込み・約2.3MB) は直接importさせない。
    const categoryMap: Record<string, Record<string, string>> = { ja: {}, en: {} };
    for (const blog of data.blogs) {
      categoryMap[blog.locale][blog.slug] = blog.categories[0];
    }
    const outputPath = path.join(config.root, "..", ".velite", "category-map.json");
    writeFileSync(outputPath, JSON.stringify(categoryMap));
  },
});
