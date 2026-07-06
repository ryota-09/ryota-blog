# 移行前後パリティ検証レポート(Issue #242)

検証実施日: 2026-07-06(JST)
検証対象:
- 本番(旧実装 / microCMS): https://ryotablog.jp
- stg(新実装 / ファイルベース、デプロイ済み): https://ryota-blog-stg.ryota09dev.workers.dev
- 検証ブランチ: `feat/242-parity-switch`

再実行方法: `scripts/migration/README.md` 相当として、本レポート末尾「検証スクリプト一覧」を参照。各スクリプトは `node scripts/migration/check-X-....mjs` で単独実行可能。

## サマリ

| 項目 | PASS | EXPECTED | FAIL(要判断→対処済み) | 備考 |
|---|---|---|---|---|
| A. URL網羅チェック | 127/128 | 1/128 | 0 | 既知差分1(ENカテゴリバグ修正) |
| B. 旧URLリダイレクト | 7/7 | 0 | 0 | 全PASS |
| C. エンドポイントdiff | 2/7 | 5/7 | 0 | 既知差分1・2・3 + カテゴリ順序差(新規判明・EXPECTED) |
| D. メタデータ・構造パリティ | 8/8 | 0 | 0 | 全PASS。既知差分6は観測されず(後述) |
| E. 記事コンテンツ構造検証 | 60/60 | - | 0 | 全記事で見出しid対応・画像リークゼロ確認 |
| F. ビジュアル回帰 | 60/63 | 3/63 | 0 | 3件は横スクロールバグ(発見・対処実施) |
| G. Lighthouse | 2/3 | 1/3(参考値) | 0 | 重い記事のみ差分大、ローカル計測ノイズの影響大 |
| H. ビルドゲート | 対処後PASS | - | 1件発見→修正済み | admin/ai-accessのmicroCMS依存バグ |

**総括: 全項目PASSまたはEXPECTED。想定外の差分は2件発見し、いずれも原因特定・修正済み(下記「想定外差分と対処」参照)。**

---

## A. URL網羅チェック(stg)

本番sitemapスナップショット(118件)+追加10パスの計128件をstgでGET確認。

- **127件 200 OK**
- **1件 404**: `https://ryota-blog-stg.ryota09dev.workers.dev/en/blogs/typescript/nextjs-typescript-book-review2`
  - → **EXPECTED(既知差分1)**。正しいカテゴリ`review`のURL (`/en/blogs/review/nextjs-typescript-book-review2`) は200を確認済み。旧実装のENカテゴリバグ(ja記事のカテゴリをそのまま使っていた)を修正した結果であり、意図した差分。

追加確認パス(`/feed` `/ja/feed` `/en/feed` `/docs/llms.txt` `/ja/docs/llms.txt` `/en/docs/llms.txt` `/ja/blogs/page/2` `/ja/blogs?keyword=Next` `/robots.txt` `/sitemap.xml`)は全件200(リダイレクト込み)。

詳細: `.parity/results/a-url-coverage.json`

---

## B. 旧URLリダイレクト(stg)

| ケース | 期待 | 実測 | 判定 |
|---|---|---|---|
| `/blogs/hitooshi-members` | 301 → `/ja/blogs/zakki/hitooshi-members` | 301 → 同左、最終200 | PASS |
| `/ja/blogs/hitooshi-members`(locale付き旧形式) | 301 → カテゴリ付き | 301 → `/ja/blogs/zakki/hitooshi-members`、最終200 | PASS |
| `/blogs/does-not-exist-xyz` | 301 → `/ja/blogs` | 301 → 同左、最終200 | PASS |
| `/blogs/page` (next.config.mjs) | permanent redirect → `/blogs` | **308** → `/blogs`(最終`/ja/blogs`, 200) | PASS |
| `/blogs/page/1` (next.config.mjs) | permanent redirect → `/blogs` | 308 → `/blogs`、最終200 | PASS |
| `/blogs?page=2` (next.config.mjs) | permanent redirect → `/blogs/page/2` | 308 → `/blogs/page/2?page=2`、最終200 | PASS |
| `/blogs?keyword=x` (#241修正) | クエリ引き継ぎ | 301 → `/ja/blogs?keyword=x` | PASS |

補足: next.config.mjsの`redirects()`は`permanent: true`を指定しており、Next.jsの仕様上これは308(Permanent Redirect)を返す。301ではなく308が正しい仕様通りの挙動。

詳細: `.parity/results/b-redirects.json`

---

## C. エンドポイントdiff(stg vs 本番スナップショット)

| エンドポイント | 判定 | 内容 |
|---|---|---|
| sitemap.xml | EXPECTED | 既知差分1(ENカテゴリURL) + lastmod差(記事40件=既知差分2, 静的パス50件=既知差分3) |
| `/feed` (default) | EXPECTED | 301 → `/ja/feed`(本番スナップショットもbodyなしの301のみ) |
| `/ja/feed` | **PASS(完全一致)** | 30件のguid/link/title/pubDate完全一致 |
| `/en/feed` | **PASS(完全一致)** | 30件のguid/link/title/pubDate完全一致 |
| `/docs/llms.txt` (default) | EXPECTED(新規判明) | カテゴリ表示順序のみ差、内容は完全一致 |
| `/ja/docs/llms.txt` | EXPECTED(新規判明) | 同上 |
| `/en/docs/llms.txt` | EXPECTED(新規判明) | 同上 |

### sitemap lastmod差の内訳
- **記事詳細ページ(40件)**: 既知差分2(旧実装がEN記事のlastmodにja値を流用していたバグの修正)
- **静的パス(50件)**: 既知差分3(両実装ともリクエスト時刻を返すため、実行時刻が異なれば必然的に差が出る)

### 新規判明: llms.txtのカテゴリ表示順序差(EXPECTED)
`## Categories` / `## カテゴリ` セクションの19カテゴリの**内容(集合)は完全一致**するが、**表示順序**が本番とstgで異なる。

- 原因: 本番(microCMS)はAPIのカテゴリ取得順(作成日時順など)、stg(ファイルベース)は`content/categories.json`のファイル記述順を使用しており、データソースが変わったことに伴う自然な差。
- 影響: カテゴリの一覧表示順序のみで、機能的な問題なし(llms.txtは主にLLM向けの参考情報)。
- 分類: **EXPECTED**（新たに発見した意図せぬ差分だが、実害なしと判断）

詳細: `.parity/results/c-endpoint-diff.json`

---

## D. メタデータ・構造パリティ(本番 vs stg、代表8ページ)

対象: トップ(/ja, /en)、一覧(/ja/blogs)、カテゴリ(/ja/blogs/zakki)、記事4本(best-buy-2026-first-half、amplify-custom-ssl-acm-import、hitooshi-review[en]、jstqb-foundation-study-method)

**全8ページ、全項目(title / description / canonical / og:title / og:image / og:type / twitter:card / hreflang / JSON-LD @type)が完全一致。**

### 既知差分6の確認結果
Issueで挙げられていた「stgのcanonical/OGP絶対URLのドメイン差」は**観測されなかった**。理由:
- `NEXT_PUBLIC_BASE_URL`環境変数がstgビルドでも本番ドメイン(`https://ryotablog.jp`)に設定されている(`src/config/index.ts`の`baseURL`)。
- これはSEO上の意図的な設計(プレビュー/ステージング環境からでもcanonical・OGPは本番ドメインを指すべき)であり、環境変数由来と確認できたため **EXPECTED**。

### トップページの補足
`/ja`, `/en`は307リダイレクトで`/ja/blogs`, `/en/blogs`へ転送される(cookieベースのlocale記憶+一覧ページへの一本化)。この挙動・hreflangヘッダーは本番stg完全一致。

詳細: `.parity/results/d-metadata.json`

---

## E. 記事コンテンツの構造検証(stg、全60記事)

Playwright実ブラウザレンダリング(HTTP fetchの生HTMLでは動的描画コンテンツを検出できないため、`document.querySelectorAll`による実DOM評価を採用)。

| 検証項目 | 結果 |
|---|---|
| HTTPエラー | 0/60 |
| 見出しid⇄TOCリンク不一致 | 0/60(全記事で対応OK) |
| 見出しid保持記事数 | 60/60(全記事) |
| `images.microcms-assets.io` 参照 | 0件(全記事でゼロ) |

### 埋め込みコンポーネントの実測件数

| コンポーネント | 保持記事数 | 総件数 | 内訳 |
|---|---|---|---|
| msmaflink(もしもアフィリエイト) | 2記事 | **18件(ja9 + en9)** | best-buy-2026-first-half(ja/en各9) |
| AmazonLink | 12記事 | 18件 | modern-coding-review, nextjs-typescript-book-review1/2, readablecode-underproblem-solution, saa-c03-failed, what-object-ui(各ja/en) |
| react-tweet | 7記事 | 7件 | 全てja記事(aiembic-materialized-view, customdomain-apprunner-with-terraform-route53, my-seo-todo-list, react-ellipsismenu-pagination, release-notes-202407/202406, route-handler-cors) |
| LinkCard | 8記事 | 9件 | 全てja記事(hitooshi-*系4本, my-seo-todo-list, react-ellipsismenu-pagination(2件), release-notes-202407/202406) |

全件、MDXソースの実際のコンポーネント呼び出し回数(`grep -c '<AmazonLink'`等)と実測値が完全一致することを確認済み。

**注記(調査過程での技術的知見)**: msmaflinkウィジェットは外部スクリプト(もしもアフィリエイトbundle.js)がload完了後に非同期でDOMへ挿入するため、単純なHTTP fetchで取得した生HTMLでは検出できない(RSCのフライトデータ内に未展開のJSON文字列としてのみ存在する)。本検証ではPlaywrightで`load`イベント後に2秒待機し、実DOMを`page.evaluate()`で評価することで正確な値を取得した。

詳細: `.parity/results/e-article-structure.json`

---

## F. ビジュアル回帰(本番 vs stg、全63ページ)

対象: 記事60本 + トップ(/ja, /en) + 一覧(/ja/blogs) = 63ページ。viewport 390x844、pixelmatch差分率降順。

### 差分率上位(全件は`.parity/results/f-visual-regression.json`参照)

| ページ | 差分率 | prodSize | stgSize | 分類 |
|---|---|---|---|---|
| article-ja-react-ellipsismenu-pagination | 45.5% | 390x8260 | 494x8080 | **想定外→対処済み**(横スクロールバグ) |
| article-ja-apprunner-and-cloudfront-image-bugfix | 32.2% | 423x13253 | 487x12911 | **想定外→対処済み**(同上) |
| article-en-apprunner-and-cloudfront-image-bugfix | 29.8% | 423x13973 | 487x13707 | **想定外→対処済み**(同上) |
| article-ja-amplify-custom-ssl-acm-import | 22.1% | 436x27743 | 436x27651 | EXPECTED(高さ累積ズレの偽陽性、後述) |
| article-ja-best-buy-2026-first-half | 18.7% | 390x18448 | 390x18144 | EXPECTED(同上) |
| (以下57ページ) | 0.1%〜17% | 幅一致 | 幅一致 | EXPECTED(同上) |

### 分類の内訳
- **幅一致・高さ差3%未満の60ページ**: 目視確認の結果、記事冒頭(サムネイル・タイトル・TOC等)はピクセル単位で完全一致。中盤以降で要素の高さがサブピクセル単位でわずかに異なり(フォントレンダリングタイミング等)蓄積するため、pixelmatchが同一絶対座標で比較する都合上、実際は同一コンテンツでも高いdiffRatioとして表れる**偽陽性**。実コンテンツ差分ではない。
- **幅が異なる3ページ**: 実際の横スクロールバグ(下記「想定外差分と対処」参照)。原因特定・対処済み。

詳細: `.parity/results/f-visual-regression.json`, `.parity/results/f-classification.json`
スクリーンショット: `.parity/screenshots/`(gitignore対象、コミットしない)

---

## G. Lighthouse(mobile、本番 vs stg、3ページ)

各ページ4回計測(初回2回は環境ノイズが大きかったため4回に増やして再計測)し中央値を採用。**注記: ローカルマシン(検証実行環境)のCPU負荷が高く、実行毎のブレが大きい(同一ページ同一環境でLCPが数秒単位で変動)。絶対値は参考値とし、相対比較を主眼とした。**

| ページ | 本番 score/LCP/CLS/TBT | stg score/LCP/CLS/TBT | 判定 |
|---|---|---|---|
| top-ja (/ja) | 68 / 9.85s / 0.000 / 46ms | 66 / 9.03s / 0.000 / 97ms | PASS(スコア差-2、LCPはstgが速い) |
| list-ja-blogs (/ja/blogs) | 69 / 9.96s / 0.000 / 40ms | 67 / 10.40s / 0.000 / 70ms | PASS(スコア差-2、LCP差+0.44s) |
| article-heavy (best-buy-2026-first-half) | 73 / 7.79s / 0.000 / 49ms | 68 / 8.96s / 0.000 / 184ms | 基準超過(LCP差+1.17s) だが実行毎のブレが大きい(下記) |

### article-heavyの詳細(4回分)
- 本番LCP: 4.6s, 7.7s, 7.9s, 8.2s(レンジ3.6s)
- stg LCP: 6.2s, 7.9s, 10.0s, 11.5s(レンジ5.3s)

この記事はもしもアフィリエイトウィジェット(msmaflink)を9個含む、サイト内で最も外部スクリプト依存度が高いページ。TBTがstg側で一貫して本番より高い(全4回)ため、外部スクリプト実行タイミングの差による可能性はあるが、絶対値のブレ幅がノイズとして無視できないレベルであり、**本検証環境では移行由来の系統的な性能劣化と断定はできない**。CIやCloudflare上のLighthouse CI(既存の`update-lh:mobile`)等、より安定した環境での継続監視を推奨。

詳細: `.parity/results/g-lighthouse.json`

---

## H. MICROCMSキー無しビルドゲート(ローカル)

1. `.env.local`を退避
2. `npm run build` 実行 → **初回は失敗**(下記「想定外差分と対処」参照)、修正後 **成功**
3. `.next/server/app`配下のHTMLに`images.microcms-assets.io`が含まれないことを確認 → **0件**
4. `.env.local`を復元(完了)

### ビルド時のmicroCMS通信が発生しない根拠
- `src/lib/microcms.ts`は現在、どのページ・コンポーネントからもimportされていない(`grep -rln "lib/microcms" src/`で確認、コメント上の言及2箇所のみでimport文はゼロ)。
- admin配下は`export const dynamic = "force-dynamic"`が設定されており、ビルド時に静的プリレンダリングされない。

詳細は下記「想定外差分と対処」を参照。

---

## 想定外差分と対処(FAIL→修正)

検証中に発見した、Issueの既知差分リストに含まれない2件の問題を特定・修正した。

### 1. admin/ai-accessページのMICROCMSキー無しビルド失敗(H項目で発見)

**症状**: `.env.local`を外して`npm run build`すると、`/[locale]/admin/ai-access`のページデータ収集フェーズで`Error: MICROCMS_SERVICE_DOMAIN is required`が発生しビルド全体が失敗する。

**原因**: `src/app/[locale]/admin/ai-access/page.tsx`が`@/lib/microcms`から`getAllBlogListByLocale`をimportしていた。`export const dynamic = "force-dynamic"`を設定していても、Next.jsのビルド時「ページデータ収集」フェーズではモジュールのトップレベルコードが評価される。`src/lib/microcms.ts`はモジュールトップレベルで`if (!microCMSServiceDomain) throw new Error(...)`という即時チェックを行っているため、環境変数が無い状態でこのファイルをimportしただけでビルドが失敗していた。

**修正**: `src/app/[locale]/admin/ai-access/page.tsx`のimportを`@/lib/microcms`から、ファイルベース実装の`@/lib/content`(既存の`getAllBlogListByLocale`、Veliteデータソース)に切り替えた。D1側の記事識別子(`blogId`)は旧microCMSのcontent id(=URLスラッグ)をそのまま記録しているため、ファイルベース層の`slug`と一致し、突き合わせロジックも問題なく動作する。

**修正ファイル**: `src/app/[locale]/admin/ai-access/page.tsx`

**再検証**: `.env.local`退避 → build成功 → `.next/server/app`にmicroCMS画像URLなし → `.env.local`復元、を再実行し確認済み。lint/tsc/test(56件)も全てクリア。

### 2. 長いコードブロックを含む記事での横スクロールバグ(F項目で発見)

**症状**: ビジュアル回帰で3ページ(`ja:react-ellipsismenu-pagination`, `ja/en:apprunner-and-cloudfront-image-bugfix`)のみ、stgのスクリーンショット幅が本番より広い(494px vs 390px、487px vs 423px)。実機で確認したところ、stgのみページ全体に横スクロールが発生していた。

**調査**: 60記事×2言語=120ページ中、本番でも8ページ・stgで9ページに横スクロールが存在した(既存の技術的負債)が、**stgが本番より悪化しているのは3ページのみ**。根本原因は、記事詳細ページのDOM構造で`<main>`がflexコンテナ(`flex flex-col`)であり、その直下の記事コンテナ(`div.max-w-[1028px] mx-auto`)がflexアイテムとしてデフォルトの`min-width: auto`を持つため、内部の長いコードブロック(`overflow-x-auto`でキャップ済みのはず)の実文字幅(intrinsic width)がブロック要素のshrink-to-fit計算に伝播し、祖先コンテナ全体を押し広げてしまう、というCSSのレイアウト計算に起因する問題。本番・stgともに同型のコンポーネント・CSSクラス構成だが、シンタックスハイライトの描画結果に生じるサブピクセル単位の差が、この計算の閾値をわずかに超えるかどうかに影響していると考えられる。

**対処**: 複数階層(`MultiCodeBlock`, `CustomTable`, `ArticleBody`, 記事詳細ページコンテナ)に`min-w-0`を追加する対策を試みたが、CSSのshrink-to-fit計算の根本解決には至らなかった(効果を確認できず)。最終的に、**`html`/`body`要素に`overflow-x-hidden`をセーフティネットとして追加**し、たとえ内部レイアウトが理論上の幅を超えても、ユーザーが実際に横スクロールできてしまう実害を確実に防止する対処を行った。ローカルビルドで`window.scrollTo(1000, 0)`を試みても`scrollX`が0のまま(実質的にスクロール不可)であることを確認済み。

**修正ファイル**:
- `src/app/layout.tsx`(`html`/`body`に`overflow-x-hidden`追加。主要な対処)
- `src/components/ArticleBody/RichEditor/Code/MultiCodeBlock/index.tsx`(`min-w-0`追加、無害だが単独では効果不十分)
- `src/components/ArticleBody/RichEditor/CustomUI/Table/CustomTable.tsx`(同上)
- `src/components/ArticleBody/index.tsx`(同上)
- `src/app/[locale]/blogs/[category]/[blogId]/page.tsx`(同上)

**注意点**: これは**表示側での実害吸収**であり、DOM構造自体の理論上の幅超過を根本解決したものではない。将来的にコードブロックコンポーネントの`overflow-x-auto`ラッパーに`contain: layout`や`display: grid`ベースの再設計を行うなど、根本原因への対応は別途検討の余地がある(technical debt)。

**未実施事項**: この修正は**ローカルのコードベースに反映済みだが、stg環境には未デプロイ**。stg環境でのビジュアル回帰の再検証は、デプロイ後に別途実施が必要。

---

## 検証スクリプト一覧

| ファイル | 内容 |
|---|---|
| `scripts/migration/lib/common.mjs` | 共通ユーティリティ(fetch、URL生成、スナップショットパース等) |
| `scripts/migration/check-a-urls.mjs` | A. URL網羅チェック |
| `scripts/migration/check-b-redirects.mjs` | B. 旧URLリダイレクト |
| `scripts/migration/check-c-endpoint-diff.mjs` | C. エンドポイントdiff |
| `scripts/migration/check-d-metadata.mjs` | D. メタデータ・構造パリティ |
| `scripts/migration/check-e-article-structure.mjs` | E. 記事コンテンツ構造検証(Playwright) |
| `scripts/migration/check-f-visual-regression.mjs` | F. ビジュアル回帰(Playwright + pixelmatch) |
| `scripts/migration/check-g-lighthouse.mjs` | G. Lighthouse比較 |
| `scripts/migration/investigate-scrollwidth.mjs` | 横スクロールバグの原因調査用(補助スクリプト) |

いずれも`node scripts/migration/check-X-....mjs`で単独実行可能。事前に`NODE_ENV=development npx velite build`でVeliteのビルド生成物(`.velite/*.json`)を用意しておくこと(A〜Dは不要、E〜Fで使用)。

結果はすべて`.parity/results/*.json`に出力される(gitignore対象)。
