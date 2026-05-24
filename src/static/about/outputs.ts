import type { OutputEntry } from "@/types/about";

// 登壇・執筆・選抜・主催の実績
export const OUTPUTS: OutputEntry[] = [
  {
    id: "zenn-articles",
    kind: "writing",
    title: {
      ja: "Zenn でフロントエンド・クラウド関連記事を継続執筆中",
      en: "Continuous writing about frontend and cloud topics on Zenn",
    },
    date: "2022 〜",
    url: "https://zenn.dev/ryota_09",
  },
  {
    id: "ryota-blog-articles",
    kind: "writing",
    title: {
      ja: "このブログ（Ryota-Blog）で業務知見を発信中",
      en: "Sharing work knowledge on this blog (Ryota-Blog)",
    },
    date: "2024 〜",
  },
  {
    id: "devcan-2",
    kind: "selection",
    title: {
      ja: "DevCan#2 hosted by Classmethod に募集枠8名で選抜",
      en: "Selected to DevCan #2 (8-person cohort) hosted by Classmethod",
    },
    date: "2024",
    url: "https://zenn.dev/devcamp/articles/6584f40e67da80",
    summary: {
      ja: "AWS 環境の構築・構成図・提案書を一貫制作。",
      en: "Built AWS environments, diagrams, and proposals end-to-end.",
    },
  },
  {
    id: "internal-lt-2023",
    kind: "organize",
    title: {
      ja: "社内 LT 大会の主催（オフライン・参加者30〜40名）",
      en: "Organized an in-house lightning talk meetup (offline, 30–40 attendees)",
    },
    date: "2023-07",
    summary: {
      ja: "司会進行と登壇者募集（3名）を担当。",
      en: "Hosting and speaker recruitment (3 speakers).",
    },
  },
];
