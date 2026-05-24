import type { SkillGroup, StrengthArea } from "@/types/about";

// 技術スタック（3層に分けて表示）
export const SKILL_GROUPS: SkillGroup[] = [
  // メイン（業務でメイン）
  {
    level: "main",
    category: { ja: "Languages", en: "Languages" },
    items: ["TypeScript", "JavaScript"],
  },
  {
    level: "main",
    category: { ja: "Frontend", en: "Frontend" },
    items: ["React 19", "Next.js (App Router)", "Tailwind CSS", "shadcn/ui"],
  },
  {
    level: "main",
    category: { ja: "Backend", en: "Backend" },
    items: ["Hono", "Prisma ORM", "MySQL", "OpenAPI"],
  },
  {
    level: "main",
    category: { ja: "Infra", en: "Infra" },
    items: ["AWS Amplify", "AWS S3", "AWS SES", "AWS ACM", "AWS Lambda", "Terraform", "GitHub Actions"],
  },
  {
    level: "main",
    category: { ja: "Testing", en: "Testing" },
    items: ["Vitest", "Playwright", "Storybook", "TDD"],
  },
  // サブ（業務でサブ）
  {
    level: "sub",
    category: { ja: "Backend (sub)", en: "Backend (sub)" },
    items: ["Python", "FastAPI", "Azure OpenAI"],
  },
  {
    level: "sub",
    category: { ja: "DB / Auth", en: "DB / Auth" },
    items: ["Oracle DB", "Firebase Authentication"],
  },
  {
    level: "sub",
    category: { ja: "CMS", en: "CMS" },
    items: ["microCMS"],
  },
];

// 得意としている領域（差別化軸）
export const STRENGTHS: StrengthArea[] = [
  {
    title: {
      ja: "Next.js × SEO × Core Web Vitals",
      en: "Next.js × SEO × Core Web Vitals",
    },
    description: {
      ja:
        "ISR / SSR の使い分け、画像最適化、View Transitions API を組み合わせて、SEO とパフォーマンスを同時に最適化する設計が得意です。",
      en:
        "Tuning the trio together — ISR/SSR split, image optimization, and View Transitions — so SEO and performance move in the same direction.",
    },
  },
  {
    title: {
      ja: "AWS を Terraform で IaC 化",
      en: "AWS as Terraform-managed IaC",
    },
    description: {
      ja:
        "フロントエンド出身者でも読みやすい構成で、AWS インフラ全体を IaC 化します。Amplify / SES / ACM など実運用ノウハウ込み。",
      en:
        "I write Terraform that frontend devs can read. Production-grade Amplify, SES, ACM, and ACME knowledge included.",
    },
  },
  {
    title: {
      ja: "フロント起点で API〜インフラまで一貫",
      en: "Frontend-out, all the way to infra",
    },
    description: {
      ja:
        "UI の要件から API スキーマ・インフラ設計を一気通貫で組める動き方。ハンドオフが減って、開発全体が速くなります。",
      en:
        "Designing UI, API, and infrastructure as one continuous concern — fewer handoffs, faster delivery.",
    },
  },
  {
    title: {
      ja: "「伝える」設計",
      en: "Design for clarity",
    },
    description: {
      ja:
        "ドキュメント整備、オンボーディング、コードレビューでの言語化。教員時代から積み上げた『伝わる順序』の感覚を活かしています。",
      en:
        "Documentation, onboarding, code reviews — every place I can make information land. A habit carried over from teaching.",
    },
  },
];
