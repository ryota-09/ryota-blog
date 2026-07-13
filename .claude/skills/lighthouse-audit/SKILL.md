---
name: lighthouse-audit
description: Lighthouseスコアの計測・調査・点数取得とパフォーマンスデバッグ。「Lighthouseスコア」「点数を計測/調査して」「LCP/CLS/Web Vitals改善」「パフォーマンスが遅い原因」のときに使用する。計測・判断はmobile基準(Slow 4G + 4x CPU)。付属のmeasure.mjsドライバーで計測し、原因の深掘りはchrome-devtools MCPのトレースで行う。
---

# lighthouse-audit — Lighthouse計測とパフォーマンスデバッグ

パスはすべてリポジトリルート基準。本文中のコマンドはすべて実行検証済み(2026-07-10, Lighthouse 13.4.0)。

## 大原則: mobile基準

計測・改善判断は**mobile設定(Slow 4G + 4x CPUスロットリング)が基準**。desktopは点数が良く出るため問題が埋もれる(実測: 同一記事でmobile 61 / desktopは大幅に高い)。レポート・Issueの根拠数値はmobile値を使い、desktopは比較参考のみ。

## スコア計測(エージェント主経路): measure.mjs

事前条件: `.next/standalone/` があること(無ければ `npm run build`)。ドライバーがstandaloneサーバー(port 3001・E2Eと同一方式)を自動起動し、計測後に停止する。port 3001で既にサーバーが動いていれば再利用する。

```bash
# ローカル計測(mobile・performanceカテゴリのみ・最速)
node .claude/skills/lighthouse-audit/measure.mjs /ja/blogs

# 記事ページ(リダイレクトは自動で最終URLに解決してから計測される)
node .claude/skills/lighthouse-audit/measure.mjs /blogs/customdomain-apprunner-with-terraform-route53

# 本番計測 / desktop比較 / 全カテゴリ / サーバーを残す(デバッグ用)
node .claude/skills/lighthouse-audit/measure.mjs /blogs/<slug> --prod
node .claude/skills/lighthouse-audit/measure.mjs /ja/blogs --desktop
node .claude/skills/lighthouse-audit/measure.mjs /ja/blogs --all-categories
node .claude/skills/lighthouse-audit/measure.mjs /ja/blogs --keep-server
```

標準出力: カテゴリスコア・FCP/LCP/CLS/TBT/SI・**LCP内訳**(TTFB/LoadDelay/LoadDuration/RenderDelayのうちそのページで発生した区分のみ。preload済み画像がLCPの場合は2区分などに減る)・LCP要素セレクタ・改善機会(推定削減ms降順)。JSON全文は `.lighthouseci/agent/`(gitignore済み、本番計測は `prod_` プレフィックス)。

**モデルルーティング**: 複数ページの計測実行・データ収集はSonnetサブエージェント(test-runner)に委譲してよい。結果の統合・ボトルネック特定・改善判断はFable 5(メインループ)で行う。

## 原因調査(デバッグ): chrome-devtools MCP

スコアとLCP内訳で「どのフェーズが遅いか」まで分かる。「なぜ遅いか」(リクエストの優先度・帯域競合・依存チェーン・レンダーブロック)はchrome-devtools MCPのトレースで調べる。ツールは1回のToolSearchでまとめてロードすること:

```
select:mcp__chrome-devtools__new_page,mcp__chrome-devtools__emulate,mcp__chrome-devtools__performance_start_trace,mcp__chrome-devtools__performance_analyze_insight,mcp__chrome-devtools__list_pages,mcp__chrome-devtools__close_page
```

検証済み手順:

1. ローカル対象なら `measure.mjs ... --keep-server` でサーバーを残しておく
2. `new_page` で対象URLを開く
3. `emulate` でmobile基準の条件を再現する: `cpuThrottlingRate: 4`・`networkConditions: "Slow 4G"`・`viewport: "412x823x2.625,mobile,touch"`
4. `performance_start_trace`(reload: true, autoStop: true)→ LCP/CLSの実測値・LCP内訳・利用可能なinsight一覧が返る
5. `performance_analyze_insight` で深掘りする(insightSetIdは手順4の結果に含まれる)。主要insight: **LCPBreakdown**(LCP資源のリクエストタイミング・優先度・ヘッダーまで出る)/ CLSCulprits / RenderBlocking / NetworkDependencyTree / DOMSize / ThirdParties
6. 終わったら `close_page`。必要なら read_network_requests(帯域競合の確認)・take_screenshot も併用する

## 定点記録(lhci)

`npm run update-lh:mobile` は本番URL(設定は `.mobile-lighthouserc.js`、対象は特定記事1本)をlhciで計測し `.lighthouseci/mobile_lhci_reports/` に保存後、webvitals更新スクリプトを呼ぶ。**Gotcha 2の未修正問題あり**。

## このプロジェクトのLCP設計(壊さないこと)

- フォント(Kosugi Maru)は `next/font` ではなくビルド時生成のサブセットCSS(`/fonts/kosugi-maru-subset.<hash>.css`、`scripts/generate-font-subset.mjs`が生成)を**loadイベント後にscript挿入**(render-blocking回避 + LCP画像との帯域競合回避)。preload(as=style) + script挿入 + noscript の3点セット。woff2自体のpreloadは追加しないこと(Lantern既知バグ lighthouse#11460 でシミュレーションLCPに算入され罰される)
- 記事サムネイルはVelite生成の `blurDataURL` + `placeholder="blur"`
- Next 16では `fetchPriority` は自動付与されない。LCP画像は `preload`(旧priority)の明示が必要

## Gotchas(すべて実測)

1. **リダイレクトを踏んだ計測はスコアが激減する**: 同一記事で、リダイレクトを踏むURL=Performance 64/LCP 6.9s、最終URL直接=92/LCP 3.4s(実測)。`/` → `/ja` → `/ja/blogs`、`/blogs/<slug>` → `/ja/blogs/<カテゴリ>/<slug>` のチェーンがある。measure.mjsは最終URLへ自動解決してから計測する
2. **Lighthouse 13にpwaカテゴリは存在しない**(実測カテゴリ: performance / accessibility / best-practices / seo / agentic-browsing)。`webvitals/update-mobile-vitals.js` は `categories.pwa.score` を参照しているため、現行バージョンで実行すると落ちるはず(未修正の既存問題)
3. **LH13のLCP内訳は `lcp-breakdown-insight` 監査に入っている**(旧 `largest-contentful-paint-element` はJSONに存在しない)。measure.mjsは対応済み
4. **本番ページにDevToolsでスタイルを当てて検証しない**: Tailwindのarbitrary class(`max-w-[83vw]`等)は未使用だと本番CSSに無い。スタイル検証は `npm run dev`(port 3006)の実コンパイルで行う
5. **主開発機(macOS/Chrome)は prefers-reduced-motion: reduce が有効**: View Transitionの疑似要素アニメは `document.getAnimations()` に現れないため、検証は `startViewTransition` フック + `finished` の所要時間で行う

## Troubleshooting

- `[server] .next/standalone/server.js が無い` → `npm run build` を実行してから再実行
- 計測対象が404 → ドライバーはその対象をスキップして続行する。ローカルの記事URLは `/ja/blogs/<カテゴリ>/<slug>` 形式(カテゴリセグメントが入る)。スラッグだけ分かっている場合は `/blogs/<slug>` を渡せばリダイレクト解決される
