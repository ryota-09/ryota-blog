-- AIアクセス集計テーブル: 日付 x 記事 x ボット で1行に集約する
CREATE TABLE IF NOT EXISTS ai_access_daily (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  access_date TEXT NOT NULL,   -- YYYY-MM-DD (UTC)
  locale TEXT NOT NULL,
  category_id TEXT NOT NULL,
  blog_id TEXT NOT NULL,       -- microCMSコンテンツID（'_llms_txt_' 等の特別値も許容）
  bot_id TEXT NOT NULL,
  vendor TEXT NOT NULL,
  purpose TEXT NOT NULL,       -- 'training' | 'search_index' | 'user_fetch' | 'unknown'
  hit_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(access_date, blog_id, bot_id)
);

CREATE INDEX IF NOT EXISTS idx_ai_access_daily_blog ON ai_access_daily(blog_id, access_date);
CREATE INDEX IF NOT EXISTS idx_ai_access_daily_bot  ON ai_access_daily(bot_id, access_date);
