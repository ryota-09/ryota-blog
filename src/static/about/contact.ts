import { AUTHOR_E_MAIL } from "@/static/blogs";
import type { Contact } from "@/types/about";

// 連絡先と相談ジャンル
export const CONTACT: Contact = {
  intro: {
    ja: [
      "業務委託・スポット相談・技術アドバイザリのご相談を歓迎しています。フルタイム転職のオファーは、現職の比較対象として強くマッチする内容であれば検討します。",
    ],
    en: [
      "I'm open to contract work, spot consultations, and technical advisory. Full-time offers are evaluated against my current role.",
    ],
  },
  acceptedTopics: {
    ja: [
      "ソフトウェア開発、完全初期段階の MVP 受託",
      "AWS / Terraform を組み合わせた小〜中規模インフラの構築相談",
      "採用や育成（オンボーディング設計など）の相談",
    ],
    en: [
      "Software development, including early-stage MVP builds",
      "Small-to-mid AWS infrastructure work with Terraform",
      "Hiring and onboarding design",
    ],
  },
  declinedTopics: {
    ja: ["長期常駐案件"],
    en: ["Long-term on-site embedded engagements"],
  },
  channels: [
    {
      kind: "email",
      label: { ja: "Email", en: "Email" },
      href: `mailto:${AUTHOR_E_MAIL}`,
    },
    {
      kind: "form",
      label: { ja: "お問い合わせフォーム", en: "Contact form" },
      href: "https://docs.google.com/forms/d/1RP2EUWjYvEa2gwFd0bjFurmZxUFCfvxtwxqpm6ggO68/viewform",
    },
    {
      kind: "social",
      label: { ja: "X (Twitter) DM", en: "X (Twitter) DM" },
      href: "https://x.com/Ryo54388667",
    },
  ],
  responseSla: {
    ja: "3営業日以内に一次返信を目指しています。",
    en: "Aiming to send a first reply within three business days.",
  },
};
