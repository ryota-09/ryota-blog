// aboutページで使う多言語対応データの型定義

// 多言語テキスト
export type LocalizedText = { ja: string; en: string };
export type LocalizedTextArray = { ja: string[]; en: string[] };

// ヒーローセクション
export type HeroProfile = {
  name: string;
  nameAlt: LocalizedText;
  badges: string[];
  catchphrase: LocalizedText;
  subText: LocalizedText;
  location: string;
};

// 自己紹介
export type AboutMeBody = {
  paragraphs: LocalizedTextArray;
  hobbies: LocalizedText;
};

// ミッション
export type Mission = {
  headline: LocalizedText;
  body: LocalizedTextArray;
  principles: LocalizedTextArray;
};

// キャリアタイムライン
export type TimelineEntry = {
  id: string;
  period: { start: string; end: string | null };
  role: LocalizedText;
  org: LocalizedText;
  summary: LocalizedTextArray;
  domains: string[];
};

// スキルスタック
export type SkillLevel = "main" | "sub" | "learning";

export type SkillGroup = {
  level: SkillLevel;
  category: LocalizedText;
  items: string[];
};

export type StrengthArea = {
  title: LocalizedText;
  description: LocalizedText;
};

// プロジェクト
export type Project = {
  id: string;
  title: LocalizedText;
  period: LocalizedText;
  role: LocalizedText;
  scale: LocalizedTextArray;
  rationale: LocalizedTextArray;
  result?: LocalizedText;
  stack: string[];
};

export type OtherProject = {
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
};

// 資格
export type Credential = {
  id: string;
  title: LocalizedText;
  acquiredAt: string;
  url?: string;
};

// アウトプット（登壇・執筆・選抜・主催）
export type OutputKind = "writing" | "speaking" | "selection" | "organize";

export type OutputEntry = {
  id: string;
  kind: OutputKind;
  title: LocalizedText;
  date: string;
  url?: string;
  summary?: LocalizedText;
};

// Nowセクション
export type NowItem = {
  category: LocalizedText;
  body: LocalizedText;
};

export type Now = {
  intro: LocalizedText;
  items: NowItem[];
  lastUpdated: string;
};

// コンタクト
export type ContactChannelKind = "form" | "email" | "social";

export type ContactChannel = {
  kind: ContactChannelKind;
  label: LocalizedText;
  href: string;
};

export type Contact = {
  intro: LocalizedTextArray;
  acceptedTopics: LocalizedTextArray;
  declinedTopics: LocalizedTextArray;
  channels: ContactChannel[];
  responseSla: LocalizedText;
};
