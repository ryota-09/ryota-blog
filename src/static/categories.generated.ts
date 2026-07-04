// このファイルは `node scripts/generate-categories.js` によって自動生成されます。
// 手動で編集しないでください（次回の npm run dev / npm run build で上書きされます）。
// microCMSの「categories」コンテンツが唯一の情報源です。

export type CategoryEntry = {
  id: string;
  slug: string;
  name: string;
  name_en: string;
};

export const CATEGORIES: CategoryEntry[] = [
  { id: "typescript", slug: "typescript", name: "TypeScript", name_en: "TypeScript" },
  { id: "next_js", slug: "next_js", name: "Next.js", name_en: "Next.js" },
  { id: "life_hack", slug: "life_hack", name: "LifeHack", name_en: "LifeHack" },
  { id: "career", slug: "career", name: "Career", name_en: "Career" },
  { id: "programming", slug: "programming", name: "プログラミング", name_en: "Programming" },
  { id: "tailwindcss", slug: "tailwindcss", name: "TailwindCSS", name_en: "TailwindCSS" },
  { id: "aws", slug: "aws", name: "AWS", name_en: "AWS" },
  { id: "zakki", slug: "zakki", name: "雑記", name_en: "daily" },
  { id: "gadget", slug: "gadget", name: "ガジェット", name_en: "Gadget" },
  { id: "react", slug: "react", name: "React", name_en: "React" },
  { id: "openai_api", slug: "openai_api", name: "OpenAI API", name_en: "OpenAI API" },
  { id: "css", slug: "css", name: "CSS", name_en: "CSS" },
  { id: "review", slug: "review", name: "レビュー", name_en: "Review" },
  { id: "news", slug: "news", name: "時事", name_en: "News" },
  { id: "terraform", slug: "terraform", name: "Terraform", name_en: "Terraform" },
  { id: "ui-parts", slug: "ui_parts", name: "UI", name_en: "UI" },
  { id: "release_notes", slug: "release_notes", name: "Release Notes", name_en: "Release Notes" },
  { id: "python", slug: "python", name: "Python", name_en: "Python" },
  { id: "test", slug: "test", name: "テスト", name_en: "test" },
];
