import type {
  AiAccessDailyTrendRow,
  AiAccessEventInput,
  AiAccessSummaryByBlog,
  AiAccessSummaryByVendor,
} from './types';

// D1へAIアクセスの集計行をUPSERTする（1リクエスト=1呼び出し想定）
export async function recordAiAccessHit(db: D1Database, event: AiAccessEventInput): Promise<void> {
  await db
    .prepare(
      `INSERT INTO ai_access_daily (access_date, locale, category_id, blog_id, bot_id, vendor, purpose, hit_count)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 1)
       ON CONFLICT(access_date, blog_id, bot_id) DO UPDATE SET hit_count = hit_count + 1`
    )
    .bind(
      event.accessDate,
      event.locale,
      event.categoryId,
      event.blogId,
      event.bot.botId,
      event.bot.vendor,
      event.bot.purpose
    )
    .run();
}

type BlogBotRow = { blogId: string; botId: string; vendor: string; purpose: string; hitCount: number };

// 記事別の集計サマリーを取得する（指定localeかつsinceDate以降、記事×ボットの内訳付き）
export async function getAiAccessSummaryByBlog(
  db: D1Database,
  locale: string,
  sinceDate: string
): Promise<AiAccessSummaryByBlog[]> {
  const { results } = await db
    .prepare(
      `SELECT blog_id as blogId, bot_id as botId, vendor, purpose, SUM(hit_count) as hitCount
       FROM ai_access_daily
       WHERE locale = ?1 AND access_date >= ?2
       GROUP BY blog_id, bot_id, vendor, purpose`
    )
    .bind(locale, sinceDate)
    .all<BlogBotRow>();

  const byBlogId = new Map<string, AiAccessSummaryByBlog>();
  for (const row of results) {
    const existing = byBlogId.get(row.blogId) ?? { blogId: row.blogId, totalHitCount: 0, byBot: [] };
    existing.totalHitCount += row.hitCount;
    existing.byBot.push({ botId: row.botId, vendor: row.vendor, purpose: row.purpose, hitCount: row.hitCount });
    byBlogId.set(row.blogId, existing);
  }

  return Array.from(byBlogId.values()).sort((a, b) => b.totalHitCount - a.totalHitCount);
}

// ベンダー・用途別の集計サマリーを取得する（指定localeかつsinceDate以降）
export async function getAiAccessSummaryByVendor(
  db: D1Database,
  locale: string,
  sinceDate: string
): Promise<AiAccessSummaryByVendor[]> {
  const { results } = await db
    .prepare(
      `SELECT vendor, purpose, SUM(hit_count) as hitCount
       FROM ai_access_daily
       WHERE locale = ?1 AND access_date >= ?2
       GROUP BY vendor, purpose
       ORDER BY hitCount DESC`
    )
    .bind(locale, sinceDate)
    .all<AiAccessSummaryByVendor>();

  return results;
}

// 日別の総アクセス数トレンドを取得する（指定localeかつsinceDate以降）
export async function getAiAccessDailyTrend(
  db: D1Database,
  locale: string,
  sinceDate: string
): Promise<AiAccessDailyTrendRow[]> {
  const { results } = await db
    .prepare(
      `SELECT access_date as accessDate, SUM(hit_count) as hitCount
       FROM ai_access_daily
       WHERE locale = ?1 AND access_date >= ?2
       GROUP BY access_date
       ORDER BY access_date ASC`
    )
    .bind(locale, sinceDate)
    .all<AiAccessDailyTrendRow>();

  return results;
}
