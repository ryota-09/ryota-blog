---
name: quality-check
description: コード変更後の品質ゲート一括実行(lint → 型チェック → 単体テスト → ビルド)。開発作業の仕上げ・コミット前・「検証して」「ビルド確認して」と言われたときに使用する。
---

# quality-check — 品質ゲート一括実行

コード変更の検証は以下の順で実行する。前段が失敗したら修正してから次へ進む(全部流してまとめて報告でも可だが、最終的に全ゲートを通すこと)。

## 実行手順

```bash
npm run lint          # 1. ESLint
npx tsc --noEmit      # 2. 型チェック(CLAUDE.mdの必須ゲート)
npx vitest run        # 3. 単体テスト(npm run test はwatchになりうるため vitest run を使う)
npm run build         # 4. 本番ビルド(prebuildで velite build が走る)
```

- 実行はtest-runnerサブエージェント(Sonnet)に委譲してよい。失敗の修正判断は自分(メインループ)で行う。
- `.velite/` 未生成による型エラー・importエラーが出たら、先に `NODE_ENV=development npx velite build` を実行する。
- 依存の再インストールは `npm ci --legacy-peer-deps`(CIと同一)。

## ビルド後の追加チェック(クライアントバンドル変更時)

`'use client'` ファイルや props の変更を含む場合:

```bash
ls -S .next/static/chunks/*.js | head   # 500KB超の異常チャンクが無いか
```

500KB超のチャンクがあれば全記事JSON(`@/lib/content` のclient混入)を疑う。詳細は `.claude/agents/code-reviewer.md` のRSC境界チェック参照。

## CIとの対応

- CI(`.github/workflows/ci.yml`)は lint + build(NEXT_PUBLIC_BASE_URL=https://ryotablog.jp)を実行する。vitestはCI無効(#189)なのでローカル実行が唯一のゲート。
- E2E(`npm run e2e`)は通常の品質ゲートには含めない。ルーティング・SEO・アクセシビリティに影響する変更のときだけ実行する。事前に `npm run build` が必要(webServerはビルド済みstandalone成果物を起動する)。

## 注意

- redirects/rewrites/middleware等ルーティングの変更が含まれる場合、ビルド成功だけでは不十分。`/cloudflare-preview` で実機検証すること。
