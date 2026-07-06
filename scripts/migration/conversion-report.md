# microCMS → MDX 変換レポート

生成日時(スクリプト実行時): このレポートは `node scripts/migration/convert-to-mdx.mjs` により自動生成されます。

## グローバルサマリ

- 記事数: 60 ファイル(30 slug × 2 locale)
- カテゴリ数: 19 件
- 画像コピー数(記事コロケーション, 重複排除): 69 ファイル
- 見出しid合計(全ファイル, h1〜h6): 662

### 埋め込み変換件数(全ファイル実測)

- Tweet: 7
- LinkCard: 9
- AmazonLink: 15
- MoshimoAffiliate: 18
- Copyable: 18
- `<br />` 変換(空段落由来): 834

## 記事ごとの変換内訳

| slug | locale | ブロック数 | 画像数 | 埋め込み数 | 見出しid数 | フラグ |
|---|---|---|---|---|---|---|
| best-buy-2026-first-half | ja | 19 | 9 | 9 | 11 | - |
| jstqb-foundation-study-method | ja | 1 | 1 | 0 | 20 | - |
| hitooshi-members | ja | 1 | 0 | 1 | 36 | - |
| saikyo-kakei-system | ja | 1 | 4 | 0 | 6 | - |
| hitooshi-konkatsu | ja | 1 | 0 | 1 | 22 | - |
| hitooshi-interview | ja | 1 | 0 | 0 | 19 | - |
| hitooshi-price | ja | 1 | 1 | 1 | 17 | - |
| amplify-custom-ssl-acm-import | ja | 1 | 0 | 0 | 55 | - |
| apprunner-and-cloudfront-image-bugfix | ja | 1 | 1 | 0 | 20 | - |
| release-notes-202505 | ja | 1 | 2 | 0 | 16 | - |
| aiembic-materialized-view | ja | 1 | 0 | 1 | 3 | - |
| hitooshi-review | ja | 1 | 0 | 1 | 8 | - |
| route-handler-cors | ja | 1 | 2 | 1 | 5 | - |
| release-notes-202407 | ja | 1 | 4 | 2 | 9 | - |
| paycareer-review | ja | 1 | 0 | 0 | 9 | - |
| giant-dinos-2024-review | ja | 1 | 1 | 0 | 3 | - |
| my-seo-todo-list | ja | 1 | 0 | 2 | 12 | - |
| tochijisen-vdr-2024 | ja | 1 | 0 | 0 | 4 | - |
| release-notes-202406 | ja | 1 | 2 | 2 | 20 | - |
| react-ellipsismenu-pagination | ja | 1 | 1 | 3 | 12 | - |
| customdomain-apprunner-with-terraform-route53 | ja | 1 | 1 | 1 | 2 | - |
| display-sports-wear | ja | 1 | 0 | 0 | 4 | - |
| readablecode-underproblem-solution | ja | 2 | 4 | 1 | 2 | - |
| what-object-ui | ja | 4 | 2 | 2 | 3 | - |
| nextjs-typescript-book-review1 | ja | 2 | 1 | 1 | 6 | - |
| nextjs-typescript-book-review2 | ja | 4 | 0 | 2 | 5 | - |
| modern-coding-review | ja | 4 | 0 | 2 | 5 | - |
| thailand-travel-alone | ja | 1 | 0 | 0 | 1 | - |
| nextjs-container-presenter | ja | 1 | 2 | 0 | 2 | - |
| saa-c03-failed | ja | 2 | 1 | 1 | 7 | - |
| best-buy-2026-first-half | en | 19 | 9 | 9 | 11 | - |
| jstqb-foundation-study-method | en | 1 | 1 | 0 | 20 | - |
| hitooshi-members | en | 1 | 0 | 0 | 38 | - |
| saikyo-kakei-system | en | 1 | 4 | 0 | 6 | - |
| hitooshi-konkatsu | en | 1 | 0 | 0 | 17 | - |
| hitooshi-interview | en | 1 | 0 | 0 | 16 | - |
| hitooshi-price | en | 1 | 1 | 0 | 13 | - |
| amplify-custom-ssl-acm-import | en | 1 | 0 | 0 | 55 | - |
| apprunner-and-cloudfront-image-bugfix | en | 1 | 1 | 0 | 20 | - |
| release-notes-202505 | en | 1 | 2 | 0 | 16 | - |
| modern-coding-review | en | 2 | 0 | 1 | 5 | - |
| what-object-ui | en | 2 | 2 | 1 | 3 | - |
| tochijisen-vdr-2024 | en | 1 | 0 | 0 | 4 | - |
| thailand-travel-alone | en | 1 | 0 | 0 | 1 | - |
| saa-c03-failed | en | 2 | 1 | 1 | 7 | - |
| route-handler-cors | en | 1 | 2 | 0 | 5 | - |
| release-notes-202407 | en | 1 | 4 | 0 | 9 | - |
| release-notes-202406 | en | 1 | 2 | 0 | 20 | - |
| readablecode-underproblem-solution | en | 2 | 4 | 1 | 2 | - |
| react-ellipsismenu-pagination | en | 1 | 1 | 0 | 2 | - |
| paycareer-review | en | 1 | 0 | 0 | 9 | - |
| nextjs-typescript-book-review2 | en | 2 | 0 | 1 | 4 | - |
| nextjs-typescript-book-review1 | en | 2 | 1 | 1 | 6 | - |
| nextjs-container-presenter | en | 1 | 2 | 0 | 3 | - |
| my-seo-todo-list | en | 1 | 0 | 0 | 6 | - |
| hitooshi-review | en | 1 | 0 | 0 | 8 | - |
| giant-dinos-2024-review | en | 1 | 1 | 0 | 3 | - |
| display-sports-wear | en | 1 | 0 | 0 | 4 | - |
| customdomain-apprunner-with-terraform-route53 | en | 1 | 1 | 0 | 2 | - |
| aiembic-materialized-view | en | 1 | 0 | 0 | 3 | - |

## HTMLのまま残した・情報が落ちた箇所

なし

## テーブルの colspan/rowspan >= 2 フラグ

なし(全テーブルのセルは colspan=1 / rowspan=1)

## 代表記事の元HTML↔MDX出力 対応抜粋

### 代表1: `amplify-custom-ssl-acm-import`(コードブロック多数・テーブルあり)

元HTML(data-filenameラッパー付きコードブロック):

~~~html
<div data-filename="terminal"><pre><code class="language-bash">openssl version
# 例: OpenSSL 3.x.x （1.1.1以降を推奨）

aws --version
# 例: aws-cli/2.x.
~~~

MDX出力(言語+title付きフェンス):

~~~text
```bash title="terminal"
~~~

### 代表2: `best-buy-2026-first-half`(もしもウィジェット×9・画像多数)

元HTML(msmaflink JSON、eidを含む):

~~~html
msmaflink({"n":"山崎実業 レンジフード調味料ラック プレート ホワイト 3128","b":"Yamazaki(山崎実業)","t":"3128","d":"https:\/\/m.media-amazon.com","c_p":"\/images\/I
~~~

MDX出力(frontmatter moshimoWidgets[0] へ格納 + 本文はプレースホルダ):

~~~text
<MoshimoAffiliate id="0" />
~~~

### 代表3: `jstqb-foundation-study-method`(GFMテーブル・コードフェンス)

元HTML(table/th/td、セル内はp):

~~~html
<table><tbody><tr><th colspan="1" rowspan="1"><p>項目</p></th><th colspan="1" rowspan="1"><p>内容</p></th></tr><tr><td colspan="1" rowspan="1"><p>試験方式</p></td><td co
~~~

MDX出力(GFMテーブル):

~~~text
| 項目    | 内容                            |
| ----- | ----------------------------- |
| 試験方式  | CBT方式（Pearson VUEのテストセンターで受験） |
~~~


## 目視レビューチェックリスト(全60ファイル)

- [ ] best-buy-2026-first-half (ja/en)
- [ ] jstqb-foundation-study-method (ja/en)
- [ ] hitooshi-members (ja/en)
- [ ] saikyo-kakei-system (ja/en)
- [ ] hitooshi-konkatsu (ja/en)
- [ ] hitooshi-interview (ja/en)
- [ ] hitooshi-price (ja/en)
- [ ] amplify-custom-ssl-acm-import (ja/en)
- [ ] apprunner-and-cloudfront-image-bugfix (ja/en)
- [ ] release-notes-202505 (ja/en)
- [ ] aiembic-materialized-view (ja/en)
- [ ] hitooshi-review (ja/en)
- [ ] route-handler-cors (ja/en)
- [ ] release-notes-202407 (ja/en)
- [ ] paycareer-review (ja/en)
- [ ] giant-dinos-2024-review (ja/en)
- [ ] my-seo-todo-list (ja/en)
- [ ] tochijisen-vdr-2024 (ja/en)
- [ ] release-notes-202406 (ja/en)
- [ ] react-ellipsismenu-pagination (ja/en)
- [ ] customdomain-apprunner-with-terraform-route53 (ja/en)
- [ ] display-sports-wear (ja/en)
- [ ] readablecode-underproblem-solution (ja/en)
- [ ] what-object-ui (ja/en)
- [ ] nextjs-typescript-book-review1 (ja/en)
- [ ] nextjs-typescript-book-review2 (ja/en)
- [ ] modern-coding-review (ja/en)
- [ ] thailand-travel-alone (ja/en)
- [ ] nextjs-container-presenter (ja/en)
- [ ] saa-c03-failed (ja/en)
