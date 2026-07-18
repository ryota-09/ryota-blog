# 記事の書き方ガイド

このリポジトリの記事は `content/blogs/{slug}/index.{ja,en}.mdx` としてリポジトリ内で管理する(Velite + MDX)。
コンテンツレイヤーの技術的背景は [docs/adr/0001-content-layer.md](./adr/0001-content-layer.md) を参照。

## 1. 新規記事の作成

```bash
npm run new-post -- <slug>
```

- `content/blogs/{slug}/index.ja.mdx` と `index.en.mdx` をfrontmatterテンプレート付きで生成する
- `content/blogs/{slug}/images/`(画像コロケーション用)も同時に作成される
- `slug` は英小文字・数字・ハイフンのみ(URL `/{locale}/blogs/{category}/{slug}` にそのまま使われる)
- 既に同名の記事ディレクトリが存在する場合は中断する(誤って上書きしない)
- 生成直後は `draft: true` になっている(下記「2. draft運用」を参照)

生成後の流れ:

1. frontmatter(title/description/categories等)を編集する
2. 本文を執筆する(埋め込みコンポーネントの使い方は「4. 埋め込みコンポーネント」を参照)
3. `npm run dev` でプレビューする
4. 公開準備ができたら `draft: false` に変更してPRを作成する

## 2. draft運用

frontmatterの `draft` フィールドで下書き状態を管理する。

```yaml
draft: true # 下書き。省略時はfalse扱い
```

- **開発環境**(`npm run dev`): `draft: true` の記事も含めて表示される。執筆中のプレビューに使う
- **本番ビルド**(`npm run build`、CI/デプロイ時): `draft: true` の記事は除外される
  - 一覧・詳細ページ・検索・前後記事・sitemap・RSSフィード・llms.txt・カテゴリURLの解決(middleware)まで、
    すべての経路で除外される(データ層の起点である `velite.config.ts` の `prepare` フックで、
    ビルド結果からdraft記事を取り除く実装になっているため)
- 判定は `NODE_ENV` で行っている(`package.json` の `predev`/`dev`/`pretest` は `NODE_ENV=development`、
  `prebuild` は `NODE_ENV=production` を明示的に指定している)。素の `npx velite build` を
  ローカルで直接叩く場合、`NODE_ENV=production` を付けないとdraft記事も出力に含まれる点に注意する

公開する際は `draft: false` に変更し、PRをマージする。

## 3. frontmatter仕様

`velite.config.ts` の `blogs` コレクションスキーマで定義されている。全フィールド:

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| `title` | string (最大150文字) | ✅ | 記事タイトル |
| `description` | string | ✅ | 記事の説明文(OGP・一覧のリード文に使用) |
| `publishedAt` | ISO日時文字列 | ✅ | 公開日時。一覧の並び順(新しい順)に使用 |
| `updatedAt` | ISO日時文字列 | ✅ | 更新日時。sitemapの`lastModified`に使用 |
| `categories` | string配列(1件以上) | ✅ | カテゴリslug配列。**先頭がプライマリカテゴリ**(URL `/blogs/{category}/{slug}` に使用)。`content/categories.json` に実在するidを指定する |
| `thumbnail` | 相対画像パス | 任意 | サムネイル画像(`./images/xxx.jpg` 形式)。省略可 |
| `noIndex` | boolean(既定false) | 任意 | trueにするとsitemapから除外・検索エンジンにnoindexを伝える |
| `isAdvertisement` | boolean(既定false) | 任意 | 広告記事フラグ |
| `related` | slug配列(既定`[]`) | 任意 | 関連記事として表示するslugのリスト |
| `draft` | boolean(既定false) | 任意 | 下書きフラグ。詳細は「2. draft運用」を参照 |
| `headingIds` | string配列(既定`[]`) | 任意 | 見出しの固定id(旧microCMSからの移行記事のみ使用)。**新規記事では指定しない**(自動生成される) |
| `moshimoWidgets` | オブジェクト配列(既定`[]`) | 任意 | もしもアフィリエイトウィジェットのデータ。詳細は「4-4. MoshimoAffiliate」を参照 |

補足:

- `slug` と `locale` はfrontmatterに書かない。ファイルパス(`blogs/{slug}/index.{locale}.mdx`)から自動的に導出される
- 日英ペアは同じslugディレクトリの中に `index.ja.mdx` / `index.en.mdx` として置く(現状は全記事ペアが存在するが、英語版が無い記事は `index.en.mdx` を作らなくてもよい)
- frontmatterのバリデーションはVelite(Zodベース)がビルド時に行う(`npx velite build`)。型に合わない値があるとビルドが失敗する

## 4. 埋め込みコンポーネント

本文(MDX)内でそのままJSXタグとして使う。実装は `src/components/ArticleBody/Embeds/` 配下、
マッピングは `src/components/ArticleBody/MdxContent/makeMdxComponents.tsx`。

### 4-1. Tweet(Twitter/X埋め込み)

```mdx
<Tweet id="1921873332732825894" url="https://twitter.com/Ryo54388667/status/1921873332732825894" />
```

- `id`: ツイートのステータスID
- `url`: ツイートの元URL

### 4-2. LinkCard(OGPリンクカード)

```mdx
<LinkCard url="https://note.com/ryota_blog_0922/n/n4c8884e880fe" />
```

- `url`: リンク先URL
- OGP(タイトル・説明・画像・favicon)は `content/ogp-cache.json` から解決される。
  新しいURLを使う場合は事前に以下を実行してキャッシュに追加すること:

  ```bash
  node scripts/fetch-ogp-cache.mjs
  ```

  (content/blogs配下の全MDXから `<LinkCard url="..." />` を自動抽出し、OGPを取得してキャッシュに保存する)

### 4-3. AmazonLink(Amazonアフィリエイトリンクカード)

```mdx
<AmazonLink
  href="//af.moshimo.com/af/c/click?a_id=xxxx&p_id=xxx&pc_id=xxx&pl_id=xxxx&url=https%3A%2F%2Fwww.amazon.co.jp%2Fdp%2Fxxxxxxxxxx"
  image="https://images-fe.ssl-images-amazon.com/images/I/xxxxxxxxxx.jpg"
  title="商品名"
  trackingImage="//i.moshimo.com/af/i/impression?a_id=xxxx&p_id=xxx&pc_id=xxx&pl_id=xxxx"
/>
```

- `href`: アフィリエイトリンク(もしもアフィリエイト経由のクリックURL)
- `image`: 商品画像URL
- `title`: 商品名(リンクテキスト・alt属性に使用)
- `trackingImage`: 任意。計測用の1x1トラッキングピクセルURL

### 4-4. MoshimoAffiliate(もしもアフィリエイト かんたんリンク)

frontmatterの `moshimoWidgets` 配列にウィジェットデータを定義し、本文では配列インデックス(0始まり)を `id` として参照する。

```yaml
# frontmatter
moshimoWidgets:
  - n: "商品名"
    b: "ブランド名"
    t: "型番"
    d: https://m.media-amazon.com
    c_p: /images/I
    p:
      - /xxxxxxxxxx._SL160_.jpg
    u:
      u: https://www.amazon.co.jp/dp/xxxxxxxxxx
    eid: xxxxxxxxx
    s: "1"
```

```mdx
<MoshimoAffiliate id="0" />
```

- `id="0"` は `moshimoWidgets[0]` を指す
- フィールド名(`n`/`b`/`t`/`d`/`c_p`/`p`/`u`/`v`/`b_l`/`eid`/`s`)はもしもアフィリエイトの管理画面が発行する
  埋め込みタグ(旧HTMLブロック)由来の短縮キーで、意味は `velite.config.ts` の `moshimoWidgetSchema` の
  コメントを参照。新規に追加する場合は、もしもアフィリエイトの管理画面で発行されたコード片から
  該当する値を書き写す

### 4-5. Copyable(コピー可能なテキスト)

```mdx
紹介コード: <Copyable>A2R7FE3K</Copyable>
```

- クリックでクリップボードにコピーできるテキスト(紹介コード等の表示に使用)

### コードブロック

言語とファイル名(任意)をフェンスの後ろに指定する:

````mdx
```bash title="terminal"
npm run dev
```
````

- ` ```lang ` で言語、` title="filename" ` でファイル名タブを表示できる(`title`は省略可)

## 5. 画像の置き方

- 記事画像は `content/blogs/{slug}/images/` に置き、本文からは相対パスで参照する

  ```mdx
  ![画像の説明](./images/screenshot.png)
  ```

  ```yaml
  thumbnail: ./images/thumbnail.jpg
  ```

- Veliteのビルド時に `public/static/` へ自動コピーされ、width/height/blurDataURLも自動生成される
- **画像を追加・変更したら圧縮を実行する**:

  ```bash
  npm run optimize-images
  ```

  - 長辺1600px超は縮小、JPEG/PNG/WebPを品質80で再圧縮する(SVG/GIFは対象外)
  - 既に処理済みのファイルは再圧縮しない(内容ハッシュで冪等性を担保)ため、記事追加のたびに実行してよい
  - pre-commitフックには組み込んでいない(開発体験を優先する運用判断。CIでのサイズチェックも設けていない)。
    **画像を追加したら手元で実行してからコミットする**運用ルールとする

## 6. プレビュー

```bash
npm run dev
```

- `http://localhost:3006` でプレビューできる
- `draft: true` の記事も表示される
- Velite(`velite dev --watch`)とNext.js(`next dev`)が並走し、MDXファイルの変更を検知して再ビルドする
- サイトフォント(Kosugi Maru)はサイト全体の使用文字から生成したサブセットを配信している
  (`scripts/generate-font-subset.mjs`、`npm run dev` 起動時に自動生成)。dev中にこれまで
  どの記事でも使っていなかった漢字を書くと、その文字だけシステムフォント表示になることが
  あるが、devサーバーの再起動またはビルドで自動的に解消する(手動対応は不要)

## 7. 公開フロー

1. `npm run new-post -- <slug>` で記事を作成し、執筆する
2. `draft: false` に変更する
3. PRを作成する(`develop` ブランチ向け)
4. CIで以下が自動チェックされる
   - `quality` ジョブ: lint・ビルド
   - `content` ジョブ: `npm run lint:content`(下記「8. lint:content」参照)
5. レビュー後、`develop` にマージ
6. 本番公開するタイミングで `develop` → `main` のPRを作成してマージする
   (`deploy-cloudflare.yml` は **`main` へのpushで本番(ryota-blog-prd)**、**`staging` へのpushでstg(ryota-blog-stg)** にデプロイする。`develop` へのpushではデプロイされない)

補足: 公開前に本番相当の環境で共有プレビューしたい場合は、対象ブランチを `staging` へpushするとstg環境(`https://ryota-blog-stg.ryota09dev.workers.dev`)で確認できる

## 8. lint:content

記事ファイル向けの品質ゲートをまとめて実行する:

```bash
npm run lint:content
```

実行内容(すべて成功して初めて完了):

1. `scripts/check-internal-links.mjs`: 内部リンク(`/{locale}/blogs/{category}/{slug}`)の実在・
   カテゴリ整合性チェックと、相対画像パス(`./images/...`)の実在チェック
2. `scripts/check-garbled-text.mjs`: 文字化け(漢字の誤変換)チェック。異常コードポイント・
   既知の化けパターン(2026-07のhitooshi-members事案の実例)・kuromoji形態素解析による
   辞書に無い日本語トークンを検出する。誤検知は `scripts/garbled-text-allowlist.txt` に追記して除外する
   (検出ロジックを変更したら `node scripts/check-garbled-text.mjs --self-test` で確認)。
   なお実在語の組み合わせに化けたケース(「全員→全和」等)は機械検出できないため、
   意味レベルの検査は記事リポジトリ側のレビューゲート(`review-blog-article`)が担当する
3. `textlint`(`content/blogs/**/index.ja.mdx` が対象。日本語の技術文書向けルールセット。
   ただし個人ブログの文体を尊重するため、感嘆符・弱い表現・である/ですます混在などの多くのルールはoffにしている。
   詳細は `.textlintrc.json` のコメントを参照)
4. `markdownlint-cli2`(`content/blogs/**/index.*.mdx` が対象。MDX特有の記法での誤検知が多いルール
   ―― インラインHTML禁止、行長制限など ―― はoffにしている。詳細は `.markdownlint-cli2.jsonc` のコメントを参照)
5. `npx velite build`(frontmatterのZodスキーマ検証。型に合わない値があれば失敗する)

CIでは `content` ジョブがこのコマンドを実行する(`.github/workflows/ci.yml`)。
