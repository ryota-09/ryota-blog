import type { Now } from "@/types/about";

// /now ページ規範に沿った「いま取り組んでいること」
export const NOW: Now = {
  intro: {
    ja: "このセクションは私の \"now\" です。直近で意識的に時間を割いていることを書いています。",
    en: "This is my \"now.\" Things I'm actively spending time on right now.",
  },
  items: [
    {
      category: { ja: "業務", en: "Work" },
      body: {
        ja:
          "Next.js 16 の Cache Components を実プロダクトに導入するためのパフォーマンス検証。App Router の use cache ディレクティブと既存 ISR 構成の併存パターンを試行中。",
        en:
          "Validating Next.js 16 Cache Components for production use — figuring out how the `use cache` directive coexists with existing ISR setups.",
      },
    },
    {
      category: { ja: "学習", en: "Learning" },
      body: {
        ja:
          "Hono と Prisma を主軸にしたバックエンド設計を、社内のいろんなチームに刺さる粒度で言語化中。",
        en:
          "Putting into words how I design Hono + Prisma backends, at the granularity that lands with different internal teams.",
      },
    },
    {
      category: { ja: "このブログ", en: "This blog" },
      body: {
        ja:
          "SEO とパフォーマンスを改善する小さな実験を、不定期で走らせています（直近: View Transitions API のページ間遷移、画像配信の最適化）。",
        en:
          "Running small experiments on SEO and performance (recently: View Transitions for page changes, image delivery tuning).",
      },
    },
    {
      category: { ja: "AI", en: "AI" },
      body: {
        ja:
          "生成 AI を「コードを書く時間を短くする」のではなく「コードを書く前のリサーチ・設計を厚くする」方向で開発フローに組み込む試行。",
        en:
          "Folding generative AI into my workflow — not to speed up coding, but to deepen the research and design that happens before the coding.",
      },
    },
  ],
  lastUpdated: "2026-05-22",
};
