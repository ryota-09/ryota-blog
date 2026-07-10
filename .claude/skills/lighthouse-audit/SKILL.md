---
name: lighthouse-audit
description: Lighthouseによるパフォーマンス計測と改善判断。「LCP改善」「パフォーマンス計測」「Lighthouseスコア」「Web Vitals」のときに使用する。計測・判断はmobile基準(Slow 4G + 4x CPU)で行う。
---

# lighthouse-audit — パフォーマンス計測(mobile基準)

## 大原則: mobile基準

このプロジェクトの計測・改善判断は**mobile設定(Slow 4G + 4x CPUスロットリング)が基準**。desktopは点数が良く出るため問題が埋もれる(実測: desktop 86〜97 に対し mobile 56〜79)。

- `npx lighthouse <url>` はデフォルト(mobile)で実行する
- レポート・Issueの根拠数値はmobile値を使い、desktopは比較参考としてのみ提示する
- サイト掲載用のvitals更新は `npm run update-lh:mobile`(lhci + webvitals更新)

## 計測時の注意

- **本番ページにDevToolsでスタイルを当てて検証しない**: Tailwindのarbitrary class(`max-w-[83vw]`等)は未使用だと本番CSSにコンパイルされておらず、効かない。スタイル検証は `npm run dev`(port 3006)の実コンパイルで行う
- **主開発機(macOS/Chrome)は prefers-reduced-motion: reduce が有効**: アニメーション起因の検証では影響を考慮する。View Transitionの疑似要素アニメは `document.getAnimations()` に現れないため、`startViewTransition` フック + `finished` の所要時間で計測する

## このプロジェクトのLCP設計(壊さないこと)

- フォント(Kosugi Maru)は `next/font` ではなく `/fonts/kosugi-maru-v17.css` を**loadイベント後にscript挿入**(render-blocking回避 + LCP画像との帯域競合回避)。preload(as=style) + script挿入 + noscript の3点セット
- 記事サムネイルはVelite生成の `blurDataURL` + `placeholder="blur"`
- Next 16では `fetchPriority` は自動付与されない。LCP画像は `preload`(旧priority)の明示が必要

## 改善提案の出し方

1. mobile計測値(スコアとLCP/FCP/CLS/TBTの内訳)を提示
2. ボトルネックをネットワークウォーターフォール/トレースで特定(推測でなく計測で)
3. 改善案は上記のLCP設計との整合を確認してから提案する
