# ADR 0001: 脱microCMS — コンテンツレイヤー技術選定とスキーマ設計

- ステータス: 承認済み
- 日付: 2026-07-06
- 関連Issue: #233(本ADR)、#234〜#244(実装フェーズ)、トラッキング #244

## 背景

microCMSを廃止し、記事・画像をすべてリポジトリ内で管理する(記事=MDX、画像=コロケーション)。
本ADRでは移行の土台となる以下を確定する。

1. コンテンツレイヤー(リポジトリ内のMarkdown/MDXを型安全に読み込む仕組み)
2. コンテンツフォーマット
3. ディレクトリ構造
4. frontmatterスキーマ
5. シンタックスハイライト方針
6. 見出しアンカー(id)の後方互換方式

### 前提条件(本リポジトリ固有)

- デプロイ先は Cloudflare Workers(@opennextjs/cloudflare)。Workersランタイムに `fs` は無いため、**コンテンツ処理はすべてビルド時に完結**させる必要がある
- `next dev` はTurbopackで動作するため、WebpackプラグインによるVelite統合は使えない
- コンテンツ実態: 日英各30記事(IDが完全一致するペア)、カテゴリ19件、画像85点(約58MB)
- URL完全維持が最優先原則(slug = 現行microCMSコンテンツID、カテゴリslugも維持)

## 決定 1: コンテンツレイヤー = Velite

2026年7月時点の候補比較:

| 候補 | 状況 | 評価 |
|---|---|---|
| **Velite** | 活発に開発中。Zodスキーマでfrontmatter検証+型自動生成。画像アセット処理(`s.image()`でwidth/height/blurDataURL生成)内蔵 | ✅ **採用** |
| 自前unified(remark/rehype)+ zod-matter | エコシステム自体は最活発。依存最小だが実装コスト大 | 代替案(Veliteが破綻した場合の退避先) |
| Content Collections | Zodベース、App Router/RSC対応明言 | 第三候補 |
| Fumadocs (fumadocs-mdx) | 活発だがドキュメントサイト向けフレームワーク。ブログには過剰 | 見送り |
| Contentlayer / contentlayer2 | 本家は放置状態、フォークも実質1人メンテでリリース停滞 | ❌ 除外 |
| next-mdx-remote | 2026年4月に本家リポジトリがアーカイブ済み | ❌ 除外 |

### 採用理由

- Zodスキーマによるfrontmatter検証と型自動生成が、現行の `src/types/microcms.ts` の型安全性を置き換えられる
- `s.image()` がwidth/height/blurDataURLのメタデータを生成し、現行のmicroCMS由来blurプレースホルダー運用をそのまま置き換えられる
- `s.mdx()` + `copyLinkedFiles` で記事コロケーション画像を `public/static` へ自動コピーできる
- ビルド時に `.velite/` へJSON+型を出力する設計のため、Workersランタイム制約(`fs`無し)と整合する

### 制約(実機検証済み・実装時に必須の知識)

- `s.mdx()` の出力は**function-body文字列**。レンダリングには `new Function(code)` 評価でMDXContentコンポーネントを自作する必要がある(#236)
- `.velite/` と `public/static/` はビルド生成物なので `.gitignore` に追加する(#235)

### Turbopack(`next dev`)との共存方法

VeliteのWebpackプラグインは使わず、**Velite CLIを別プロセスで並走**させる:

```jsonc
// package.json (実装は #235)
{
  "scripts": {
    // dev: velite dev --watch と next dev を並走(concurrently等を利用)
    "dev": "velite dev --watch & next dev -p 3006",
    // build: 既存のprebuildフック(generate-categories.jsと同じ考え方)でveliteを先行実行
    "prebuild": "velite build",
    "build": "next build"
  }
}
```

これは既存の `prebuild`(`scripts/generate-categories.js`)と同じ「ビルド前にデータを生成する」パターンであり、開発者の認知負荷を増やさない。

## 決定 2: フォーマット = MDX

現行の `RichEditor`(`src/components/ArticleBody/RichEditor/ReplaceUiParts.lib.tsx`)はHTMLをReactコンポーネントへマッピングする設計。MDXの `components` マップは同じ思想であり、埋め込み要素をコンポーネントとして自然に表現できる。

| 現行(microCMS HTML) | 移行後(MDXコンポーネント) |
|---|---|
| Twitter埋め込み(blockquote) | `<Tweet id="..." />`(react-tweet、#236) |
| iframelyリンクカード | `<LinkCard url="..." />`(ビルド時OGP静的化、#236) |
| AMAZONリンクHTML | `<AmazonLink ... />`(#236) |
| もしもアフィリエイトHTML | `<MoshimoAffiliate ... />`(#236) |
| コードブロック(言語+data-filename) | ` ```lang:filename ` フェンス → `MultiCodeBlock`(#236) |

素のMarkdown(.md)ではなくMDXを選ぶ理由は、上記の埋め込み9〜18件/サイトが全記事の価値の中核であり、HTMLブロックのまま残すとパース・サニタイズ・ハイドレーションの複雑さが現行のまま残るため。

## 決定 3: ディレクトリ構造

```
content/
  blogs/
    {slug}/            # slug = 現行microCMSコンテンツID(URL維持のため変更不可)
      index.ja.mdx
      index.en.mdx     # 日英ペア(現行blogs/blogs_enはID完全一致)
      images/          # 記事画像をコロケーション
  categories.json      # カテゴリマスタ(microCMSのcategoriesを静的化、全19件)
```

- **記事ごとディレクトリ + 画像コロケーション**: 記事と画像のライフサイクルが一致し、記事削除=ディレクトリ削除で完結する
- **`index.{locale}.mdx` 方式**: 日英ペアがID完全一致という現行データ構造をそのまま表現できる。英語版が無い記事は `index.en.mdx` を置かない(現状は30記事全てペアが存在)
- **categories.json**: カテゴリは19件で増減頻度が低く、リレーション解決はビルド時にVeliteスキーマの `transform` で行う。`ui-parts → ui_parts` のslugオーバーライド(現行 `scripts/generate-categories.js` の `CATEGORY_SLUG_OVERRIDES`)は categories.json に焼き込んで解消する

## 決定 4: frontmatterスキーマ(Zod)

```ts
// velite.config.ts のスキーマドラフト(実装・確定は #235)
// 注意: このファイルはドラフト。実装時に velite の実バージョンのAPIに合わせて調整する
import { defineConfig, defineCollection, s } from "velite";

const blogs = defineCollection({
  name: "Blog",
  pattern: "blogs/**/index.*.mdx",
  schema: s
    .object({
      title: s.string().max(100),
      description: s.string(),
      publishedAt: s.isodate(),          // 現行 publishedAt を保持
      updatedAt: s.isodate(),            // 現行 updatedAt / revisedAt を保持
      categories: s.array(s.string()).min(1), // カテゴリslug配列。先頭がプライマリでURLに使用
      thumbnail: s.image().optional(),   // 30件中2件はサムネイル無しのため optional
      noIndex: s.boolean().default(false),
      isAdvertisement: s.boolean().default(false),
      related: s.array(s.string()).default([]), // 関連記事slug配列(現行 relatedContent の置換)
      draft: s.boolean().default(false), // 下書き。true はビルド対象から除外
      headingIds: s.array(s.string()).default([]), // microCMS由来の見出しid(出現順)。変換スクリプトが自動生成
      body: s.mdx(),
    })
    .transform(/* slug・locale をファイルパスから導出、カテゴリをcategories.jsonで解決 */),
});

const categories = defineCollection({
  name: "Category",
  pattern: "categories.json",
  schema: s.object({
    id: s.string(),      // URL用slug(ui_parts等のオーバーライド適用済みの値)
    name: s.string(),    // 表示名
  }),
});

export default defineConfig({
  collections: { blogs, categories },
  mdx: { /* remark/rehypeプラグインは #236 で確定 */ },
});
```

補足:

- `pageViews` は現行スキーマに存在するが未使用のため移行しない
- `slug` と `locale` はfrontmatterに書かせず、ファイルパス(`blogs/{slug}/index.{locale}.mdx`)から導出する。手書きの重複と不整合を防ぐため

## 決定 5: シンタックスハイライト = 既存MultiCodeBlockを維持(移行中は変更しない)

- 現行の `MultiCodeBlock`(react-syntax-highlighter・クライアントコンポーネント)を**そのまま維持**する
- ビルド時ハイライト(rehype-pretty-code / Shiki)はバンドル削減の観点で優位だが、移行の原則は「読者から見て何も変わらないこと」(パリティゲート #242)。ハイライターの変更は配色・行折返し・言語判定の差分を生み、ビジュアル回帰の判定を汚染する
- Shiki移行は**移行完了後の最適化Issueとして別途起票**する(Web事例調査の共通の落とし穴「試したい技術を詰め込みすぎて複雑化」を回避)

## 決定 6: 見出しアンカー = frontmatter `headingIds` + rehypeプラグイン注入

microCMS由来の `<h2 id="hba7e17d1c0">` 形式のidを変換時に保持する(既存共有リンク・TOCの後方互換)。

**採用方式**(実機検証済み): Markdown見出し(`## 見出し`)のまま書き、frontmatterの `headingIds`(出現順のid配列)をrehypeプラグインで順序ベースに注入する。

```ts
// 概念実証済みのrehypeプラグイン(実装は #236)
const rehypeRestoreIds = () => (tree) => {
  let i = 0;
  visit(tree, "element", (node) => {
    if (["h2", "h3"].includes(node.tagName)) {
      if (headingIds[i]) node.properties.id = headingIds[i];
      i++;
    }
  });
};
```

**不採用の代替案**(いずれも実機検証で不可を確認):

- ❌ `{#custom-id}` 記法(remark-heading-id等): MDXでは `{...}` がJSX式として解釈され**acornパースエラー**になる(MDX公式がwontfixを明言)
- ❌ `<h2 id="...">` のJSXリテラル直書き: MDXの `components` マップは**JSXリテラルには適用されない**ため、`CustomH2` 等のUIコンポーネントを素通りしてスタイルが失われる

新規記事(移行後に書く記事)は `headingIds` を書かず、rehype-slugで自動生成する。

## 影響

- #234: 変換スクリプトはこのディレクトリ構造・frontmatterスキーマ・headingIds方式に従って出力する
- #235: `velite.config.ts` を本ADRのドラフトから実装・確定する
- #236: MDXレンダリング(`new Function` 評価)・embedコンポーネント・rehypeRestoreIds を実装する
- 全フェーズ: URL完全維持・コンテンツフリーズ・パリティゲートの原則は #244(トラッキングIssue)を参照

## 参考

- 移行全体の設計・Issue分割: #244
- コンテンツ実態調査(2026-07-06): 日英各30記事、カテゴリ19、画像85点58MB、もしも×9 / AMAZON×9(EN 6) / iframely×9 / Twitter×7 / コード114
