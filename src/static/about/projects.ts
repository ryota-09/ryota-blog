import type { OtherProject, Project } from "@/types/about";

// 主な実績（3カード）
export const PROJECTS: Project[] = [
  {
    id: "gov-portal",
    title: {
      ja: "官公庁向け情報ポータルの本番構築",
      en: "Government information portal — production launch",
    },
    period: {
      ja: "2025年12月 〜 2026年2月",
      en: "Dec 2025 — Feb 2026",
    },
    role: {
      ja: "フルスタックエンジニア（設計〜実装〜インフラ〜DNS まで一貫）",
      en: "Fullstack engineer (design through infrastructure and DNS)",
    },
    scale: {
      ja: [
        "go.jp ドメインの本番案件",
        "Terraform 6モジュールで AWS インフラ全体を IaC 化",
        "3層アーキテクチャ（Controller / Service / Repository）で13モデルのDB 設計",
        "3段階 RBAC + 事業者スコープのマルチテナント管理画面",
      ],
      en: [
        "Live behind a go.jp domain",
        "AWS infra fully IaC-managed via six Terraform modules",
        "13-model DB modeled with a three-layer Controller / Service / Repository architecture",
        "Multi-tenant admin with three-level RBAC and per-operator scoping",
      ],
    },
    rationale: {
      ja: [
        "Amplify を選んだ理由: 官公庁ドメイン接続の安全な切り替え経路と CDN を、最短で整備するため。",
        "Hono を選んだ理由: 軽量・型安全・OpenAPI 自動生成を1スタックで完結させるため。",
      ],
      en: [
        "Why Amplify: fastest safe path to switching a government domain over CDN.",
        "Why Hono: lightweight, type-safe, and OpenAPI generation all in one stack.",
      ],
    },
    stack: [
      "Next.js 16",
      "React 19",
      "Hono",
      "Prisma",
      "MySQL",
      "Terraform",
      "AWS Amplify",
      "AWS SES",
      "GitHub Actions",
      "Vitest",
      "Playwright",
    ],
  },
  {
    id: "logistics-saas-media",
    title: {
      ja: "物流企業向け SaaS ＋ toC メディア",
      en: "Logistics SaaS and consumer media",
    },
    period: {
      ja: "2024年7月 〜 現在",
      en: "Jul 2024 — Present",
    },
    role: {
      ja: "フロントエンドリード／SEO 設計",
      en: "Frontend lead and SEO architect",
    },
    scale: {
      ja: [
        "自社プロダクトの SaaS と toC 向けメディアサイトを並行運用",
        "狙ったキーワードで Google 検索上位を獲得",
        "ChatGPT Web 検索のソースとしてピックアップされる事例も確認",
      ],
      en: [
        "Run SaaS and consumer-facing media in parallel",
        "Hit top organic rankings for targeted keywords",
        "Confirmed picks as a source in ChatGPT web search results",
      ],
    },
    rationale: {
      ja: [
        "Next.js App Router を選んだ理由: ISR で SEO とパフォーマンスを両立しつつ、必要に応じて SSR に切り替えられる柔軟性のため。",
        "独自 CMS 機能の最小実装を選んだ理由: 編集者の操作フローが既存 SaaS と合わず、要件に合わせて作り込んだ方が運用負荷が下がるため。",
      ],
      en: [
        "Why Next.js App Router: ISR for SEO/perf balance, with SSR as a clean escape hatch.",
        "Why we built a minimal in-house CMS: editor workflows didn't fit off-the-shelf SaaS — custom paid off in ops.",
      ],
    },
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Core Web Vitals"],
  },
  {
    id: "ai-chat-app",
    title: {
      ja: "生成 AI チャットアプリケーションの開発",
      en: "Generative AI chat application",
    },
    period: {
      ja: "2023年12月",
      en: "Dec 2023",
    },
    role: {
      ja: "フロントエンドエンジニア",
      en: "Frontend engineer",
    },
    scale: {
      ja: [
        "数万件規模のデータを扱う SaaS",
        "大規模データ表示のパフォーマンスを仮想ウィンドウで改善",
        "ロール／ポリシー単位の RBAC をフロントから一貫実装",
      ],
      en: [
        "SaaS handling tens of thousands of records",
        "Virtualized rendering to keep large lists smooth",
        "Role and policy-based RBAC implemented end-to-end on the client",
      ],
    },
    rationale: {
      ja: [
        "仮想ウィンドウを採用した理由: ページネーションでは UX の連続性が失われるため、操作のスムーズさを優先。",
        "RBAC をフロントで実装した範囲: バックエンドの権限管理に加え、UI 表示制御を独立して持ち、編集ミス時の影響範囲を最小化。",
      ],
      en: [
        "Why virtualization, not pagination: continuity of interaction beats page jumps.",
        "Frontend RBAC scope: in addition to server-side checks, we kept UI gating independent to limit blast radius.",
      ],
    },
    stack: ["Next.js", "TypeScript", "Azure OpenAI"],
  },
];

// その他実績（accordion で出す）
export const OTHER_PROJECTS: OtherProject[] = [
  {
    id: "logistics-core-maintenance",
    title: {
      ja: "物流基幹システムの保守（1000社超利用）",
      en: "Maintenance of a logistics core system (1000+ companies)",
    },
    summary: {
      ja: "Oracle DB ストアドプロシージャ整備、5名チームでの安定運用と小規模改善。",
      en: "Oracle DB stored procedure work, stable operation and small improvements within a five-person team.",
    },
  },
  {
    id: "studypocket-qa",
    title: {
      ja: "スタディポケット（教育系 AI スタートアップ）の QA エンジニア業務委託",
      en: "QA engineer (contract) at StudyPocket, an EdTech AI startup",
    },
    summary: {
      ja: "テスト計画、テスト仕様書、E2E テスト実装、ドキュメント整備を担当。",
      en: "Test plans, test specs, E2E implementation, and documentation cleanup.",
    },
  },
  {
    id: "onboarding-design",
    title: {
      ja: "インターン1名・中途2名のオンボーディング設計",
      en: "Onboarding design for 1 intern and 2 mid-career hires",
    },
    summary: {
      ja: "受け入れ手順書・初週スケジュール・権限設定の標準化。",
      en: "Standardized intake docs, week-one schedule, and access provisioning.",
    },
  },
];
