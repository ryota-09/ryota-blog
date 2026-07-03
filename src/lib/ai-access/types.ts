// AIボットの提供事業者
export type AiVendor =
  | 'openai'
  | 'anthropic'
  | 'perplexity'
  | 'google'
  | 'meta'
  | 'apple'
  | 'amazon'
  | 'bytedance'
  | 'common_crawl'
  | 'mistral'
  | 'duckduckgo';

// AIボットの用途分類
// training: モデル学習用データ収集 / search_index: 検索インデックス作成 / user_fetch: ユーザーの質問に応じたその場取得
export type AiAccessPurpose = 'training' | 'search_index' | 'user_fetch';

// カタログに登録されたAIボットの定義
export type AiBotDefinition = {
  botId: string;
  vendor: AiVendor;
  purpose: AiAccessPurpose;
  // User-Agent文字列中の判定トークン（大文字小文字を区別しない部分一致に使う）
  uaToken: string;
};

// classifyAiAccessの判定結果
export type AiAccessClassification =
  | { isAiAccess: true; bot: AiBotDefinition }
  | { isAiAccess: false; bot: null };

// middlewareからrepositoryへ渡す1回のアクセスイベント
export type AiAccessEventInput = {
  accessDate: string; // YYYY-MM-DD (UTC)
  locale: string;
  categoryId: string;
  blogId: string;
  bot: AiBotDefinition;
};

// 記事単位の集計結果（ダッシュボード表示用）
export type AiAccessSummaryByBlog = {
  blogId: string;
  totalHitCount: number;
  byBot: Array<{ botId: string; vendor: string; purpose: string; hitCount: number }>;
};

// ベンダー単位の集計結果（ダッシュボード表示用）
export type AiAccessSummaryByVendor = {
  vendor: string;
  purpose: string;
  hitCount: number;
};

// 日別トレンドの集計結果（ダッシュボード表示用）
export type AiAccessDailyTrendRow = {
  accessDate: string;
  hitCount: number;
};
