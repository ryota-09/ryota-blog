import type { Credential, LocalizedText } from "@/types/about";

// 保有資格
export const CREDENTIALS: Credential[] = [
  {
    id: "aws-sysops-associate",
    title: {
      ja: "AWS Certified SysOps Administrator – Associate",
      en: "AWS Certified SysOps Administrator – Associate",
    },
    acquiredAt: "2023-06",
    url: "https://aws.amazon.com/jp/certification/certified-sysops-admin-associate/",
  },
  {
    id: "aws-developer-associate",
    title: {
      ja: "AWS Certified Developer – Associate",
      en: "AWS Certified Developer – Associate",
    },
    acquiredAt: "2023-02",
    url: "https://aws.amazon.com/jp/certification/certified-developer-associate/",
  },
  {
    id: "aws-saa-associate",
    title: {
      ja: "AWS Certified Solutions Architect – Associate",
      en: "AWS Certified Solutions Architect – Associate",
    },
    acquiredAt: "2023-02",
    url: "https://aws.amazon.com/jp/certification/certified-solutions-architect-associate/",
  },
  {
    id: "math-teacher-license",
    title: {
      ja: "高等学校教諭一種免許状（数学）",
      en: "High School Teacher Class-I License (Mathematics, Japan)",
    },
    acquiredAt: "2018-03",
  },
];

// 意味付けの一言（資格セクションの下部に小さく出す）
export const CREDENTIALS_NOTE: LocalizedText = {
  ja: "フロントエンド出身者で AWS 3資格を保有しているケースは多くなく、Terraform で IaC を書くベースになっています。",
  en: "Coming from a frontend background, holding the three AWS Associates is uncommon — it underpins how I write Terraform-managed infrastructure.",
};
