import type { TimelineEntry } from "@/types/about";

// キャリアタイムライン（直近→過去の順）
export const TIMELINE: TimelineEntry[] = [
  {
    id: "current-logistics-startup",
    period: { start: "2024-07", end: null },
    role: {
      ja: "フルスタックエンジニア",
      en: "Fullstack Engineer",
    },
    org: {
      ja: "東京の物流スタートアップ",
      en: "A logistics startup in Tokyo",
    },
    summary: {
      ja: [
        "物流業界に特化したスタートアップで、自社プロダクトの SaaS、toC メディア、官公庁向け情報ポータルの開発を担当。",
        "フロントエンド・バックエンド・インフラ・CI/CD まで一貫して責任を持つスタイル。",
        "直近では官公庁ドメイン（go.jp）の本番構築・SES 認証メール基盤を主導。",
        "エンジニア採用、中途入社者の OJT、インターンや若手のマネジメントといった組織面も担当。",
      ],
      en: [
        "Building proprietary SaaS, consumer media, and a government information portal at a logistics-focused startup.",
        "End-to-end ownership across frontend, backend, infrastructure, and CI/CD.",
        "Recently led the production launch on a go.jp domain and the SES email authentication stack.",
        "Also responsible for engineering hiring, OJT for mid-career hires, and mentorship of interns and junior engineers.",
      ],
    },
    domains: ["Frontend", "Backend", "Infra (AWS)", "SEO", "Hiring", "Onboarding", "Mentorship"],
  },
  {
    id: "ses-frontend-engineer",
    period: { start: "2022-01", end: "2024-06" },
    role: {
      ja: "フロントエンドエンジニア",
      en: "Frontend Engineer",
    },
    org: {
      ja: "SES企業",
      en: "Contract engineering firm",
    },
    summary: {
      ja: [
        "大手企業常駐案件で、生成 AI チャットアプリケーション、業務系 Web アプリケーション、社内ツールのフロントエンド開発を担当。",
        "大規模データ（数万件規模）のパフォーマンス改善、ロール／ポリシー単位の RBAC 実装、E2E テスト整備を経験。",
        "AWS 認定資格を3冠取得（SAA / DVA / SOA）。社内 LT 大会の主催も担当。",
      ],
      en: [
        "Built frontends for enterprise-embedded projects: a generative-AI chat application, business web apps, and internal tools.",
        "Optimized rendering of tens of thousands of records, implemented role/policy-based RBAC, and established E2E testing.",
        "Earned three AWS Associate certifications (SAA / DVA / SOA); organized an internal lightning-talk meetup.",
      ],
    },
    domains: ["Frontend", "Testing"],
  },
  {
    id: "math-teacher",
    period: { start: "2018-04", end: "2021-10" },
    role: {
      ja: "数学科教員",
      en: "Math Teacher",
    },
    org: {
      ja: "地方の公立中学校",
      en: "Public middle school in a rural part of Japan",
    },
    summary: {
      ja: [
        "地方の公立中学校で数学を教える3年間。「どの順番で説明すれば伝わるか」を毎日設計。",
        "ここで身についたもの: 伝え方の設計、ドキュメント文化。",
      ],
      en: [
        "Taught math for three years at a public middle school in a rural part of Japan, designing daily how to land an explanation.",
        "Skills earned: explanation design, documentation culture.",
      ],
    },
    domains: ["Teaching", "Documentation"],
  },
];
