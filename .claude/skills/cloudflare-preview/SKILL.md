---
name: cloudflare-preview
description: OpenNext + Cloudflare(workerd)での実機挙動検証。next.config.mjsのredirects/rewrites/headers・middleware・ルーティングの変更時は必須。`next start`では再現しないOpenNext固有の挙動差を検出する。「実機で確認」「デプロイ前検証」のときに使用する。
---

# cloudflare-preview — OpenNext実機検証

このプロジェクトのデプロイ先はCloudflare Workers(OpenNext経由)。**`next dev` / `next start` とルーティング挙動が異なる**ため、以下の変更は必ずwranglerローカル実行で検証する:

- `next.config.mjs` の redirects / rewrites / headers
- middleware / proxy
- `open-next.config.ts` / `wrangler.*.jsonc`

## 手順

```bash
npm run preview:stg   # opennextjs-cloudflare build + preview(wranglerローカル、workerdで実行)
```

起動後、変更したルーティングを curl で検証する(ポートはデフォルト8787。wrangler.stg.jsonc に dev 設定は無いが、必ず起動ログに表示されるURLで確認すること):

```bash
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' http://localhost:8787/<対象パス>
```

- 変更対象のパスだけでなく、**マッチしてはいけない代表パス**も確認する(過剰マッチの検出)。
- 該当する場合は ja / en 両ロケールのパスを確認する。

## 既知の落とし穴(実害事例: Issue #225)

OpenNextのルーティング層(`@opennextjs/aws` の `routeHasMatcher`)は、redirectsの `has` 条件で `value` を省略すると `new RegExp("")` で評価するため**クエリが無くても常時マッチ**する。`next start` では正常に動くのでローカルでは気づけない。

- `has` 条件には必ず `value` を明示する(存在チェックは `value: '.+'`)
- 疑わしい挙動は `node_modules/@opennextjs/` の実装を直接grepして確認する

## デプロイ

```bash
npm run deploy:stg   # ステージング
npm run deploy:prd   # 本番 — ユーザーの明示的な承認なしに実行しない
```

デプロイはpreview検証が通ってから。本番デプロイは必ずユーザーに確認する。
