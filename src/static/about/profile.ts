import type { AboutMeBody, HeroProfile, Mission } from "@/types/about";

// ヒーローセクション
export const HERO_PROFILE: HeroProfile = {
  name: "りょた",
  nameAlt: { ja: "りょた", en: "Ryota" },
  badges: ["Software Engineer"],
  catchphrase: {
    ja: "泥臭いことをバカにせず。",
    en: "Honor the grunt work.",
  },
  subText: {
    ja:
      "東京の物流スタートアップで、Next.js / TypeScript / AWS を扱うフルスタックエンジニア。フロントエンドが軸足、Terraform でインフラまで書きます。教育業界 → SES業界 → 物流業界と、3つの現場を渡ってきました。",
    en:
      "Software engineer at a Tokyo-based logistics startup, working across Next.js, TypeScript, and AWS. Frontend-centric, infrastructure-aware. I've worked across three industries — education, contract engineering, and logistics.",
  },
  location: "Tokyo, Japan",
};

// 自己紹介本文（.highlight クラスで強調可能）
export const ABOUT_ME: AboutMeBody = {
  paragraphs: {
    ja: [
      "はじめまして、<span class=\"highlight\">りょた</span>です。東京の物流スタートアップで、Web メディア、SaaS、官公庁向け情報ポータルの開発を担当しています。フロントエンドが軸足ですが、Terraform で AWS インフラを書き、Hono と Prisma で API を組み、CI/CD パイプラインまで一人で設計・構築するところまで含めて担当範囲です。",
      "もともとは、地方の公立中学校で <span class=\"highlight\">数学を教える教員</span>をしていました。3年間、毎日「どの順番で説明すれば一番伝わるか」を考えていた経験は、いまもコードレビュー、ドキュメント、API 設計、UI の情報設計と、職場のあらゆる場面で生きています。",
      "このブログは、その延長線上にあります。業務で詰まったポイントや、検証してわかった落とし穴を、「同じ場所で詰まった誰かが5分でも早く前に進めるように」と思って書いています。",
    ],
    en: [
      "Hi, I'm <span class=\"highlight\">Ryota</span>. I'm a fullstack software engineer at a logistics startup in Tokyo, building web media, internal SaaS, and government information portals end to end — from the frontend in Next.js, through APIs in Hono and Prisma, to AWS infrastructure provisioned with Terraform.",
      "Before becoming an engineer, I spent three years <span class=\"highlight\">teaching math</span> at a public middle school in a rural part of Japan. Thinking every day about how to explain something so it actually lands still shapes how I write code reviews, design APIs, and structure UI today.",
      "On this blog, I write about the kind of problems that don't fit cleanly in a tutorial — the half-day debugging detours, the production-only failures, the migration paths nobody documented. The goal is simple: shave five minutes off the next person who gets stuck where I got stuck.",
    ],
  },
  hobbies: {
    ja: "オフは麻辣湯巡り、散歩、お酒を楽しんでいます。",
    en: "Off the keyboard: hunting down mala tang shops, going for walks, and enjoying a good drink.",
  },
};

// ミッションセクション
export const MISSION: Mission = {
  headline: {
    ja: "同じ場所で詰まった人の時間を、5分でも短くする",
    en: "Save five minutes for the next person stuck where I got stuck.",
  },
  body: {
    ja: [
      "Web 開発は、ドキュメントを読んでも一発で動かないことが多い。私自身、CORS の謎エラーで何時間も止まったり、Amplify と Next.js の組み合わせで本番だけ 503 を吐かれたり、何度もコードを書き直したりしてきました。",
      "そのときに <span class=\"highlight\">「あ、ここで誰かの記事を読んでいたら助かったのに」</span>と思った瞬間を、自分の手で減らしたい。だからこのブログでは、抽象論や流行りの紹介ではなく、実際に手で動かして詰まった話と、その時どう抜けたかを中心に書いています。",
    ],
    en: [
      "Web development rarely works on the first try, even when you've read the docs. I've spent hours stuck on cryptic CORS errors, only to find Amplify + Next.js was returning 503s in production, and rewritten the same code over and over.",
      "In those moments, I always thought: <span class=\"highlight\">\"if only someone had written about this exact issue.\"</span> That's the gap I want to close. On this blog, you'll find hands-on lessons from real bugs — not trend reports or abstract advice.",
    ],
  },
  principles: {
    ja: [
      "コードより先に、伝え方を考える（教員時代の癖）",
      "「動いた」で終わらせず、「なぜ動いたか」まで残す",
      "誰かの記事に助けられた分を、自分の記事で返す",
    ],
    en: [
      "Think about how to explain it before writing the code (a habit from teaching).",
      "Don't stop at \"it works\" — capture why it works.",
      "Pay forward every article that ever helped me.",
    ],
  },
};
