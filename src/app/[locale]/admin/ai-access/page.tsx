import { getCloudflareContext } from "@opennextjs/cloudflare";

import { getAllBlogListByLocale } from "@/lib/content";
import {
  getAiAccessDailyTrend,
  getAiAccessSummaryByBlog,
  getAiAccessSummaryByVendor,
} from "@/lib/ai-access/repository";
import type { ContentLocale } from "@/types/content";

// D1を毎リクエストでクエリするため静的化しない
export const dynamic = "force-dynamic";

const SUMMARY_WINDOW_DAYS = 30;

const VENDOR_LABELS: Record<string, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  perplexity: "Perplexity",
  google: "Google",
  meta: "Meta",
  apple: "Apple",
  amazon: "Amazon",
  bytedance: "ByteDance",
  common_crawl: "Common Crawl",
  mistral: "Mistral",
  duckduckgo: "DuckDuckGo",
};

const PURPOSE_LABELS: Record<string, { ja: string; en: string }> = {
  training: { ja: "学習用収集", en: "Training" },
  search_index: { ja: "検索インデックス", en: "Search index" },
  user_fetch: { ja: "オンデマンド取得", en: "On-demand fetch" },
};

// 直近days日間の開始日（YYYY-MM-DD, UTC）を算出する
function sinceDate(days: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

type AiAccessPageProps = {
  params: Promise<{ locale: string }>;
};

const Page = async ({ params }: AiAccessPageProps) => {
  const { locale } = await params;
  const isEn = locale === "en";
  const { env } = await getCloudflareContext({ async: true });

  if (!env.AI_ACCESS_DB) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-gray-700 dark:text-gray-300">
          {isEn
            ? "AI_ACCESS_DB binding is not available. Run this via `npm run preview:stg`/`preview:prd` or a deployed environment."
            : "AI_ACCESS_DB バインディングが見つかりません。npm run preview:stg / preview:prd もしくはデプロイ済み環境で確認してください。"}
        </p>
      </div>
    );
  }

  const since = sinceDate(SUMMARY_WINDOW_DAYS);
  const [byBlog, byVendor, dailyTrend] = await Promise.all([
    getAiAccessSummaryByBlog(env.AI_ACCESS_DB, locale, since),
    getAiAccessSummaryByVendor(env.AI_ACCESS_DB, locale, since),
    getAiAccessDailyTrend(env.AI_ACCESS_DB, locale, since),
  ]);
  const blogs = getAllBlogListByLocale(locale as ContentLocale);

  // NOTE: ファイルベース層(Velite)にはmicroCMSの content id 相当が無く、slugがそれに代わるキーとなる。
  // D1(ai_access)側のblogIdはmicroCMS時代のcontent id(=URLスラッグ)をそのまま記録しているため、
  // slugとの突き合わせで一致する(#242パリティ検証時に確認)。
  const titleById = new Map(blogs.map((blog) => [blog.slug, blog.title]));
  const totalHitCount = byVendor.reduce((sum, row) => sum + row.hitCount, 0);
  const topVendor = byVendor[0];
  const maxDailyHitCount = Math.max(1, ...dailyTrend.map((row) => row.hitCount));

  return (
    <div className="mx-auto w-full max-w-4xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEn ? "AI Access Analytics" : "AIアクセス解析"}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {isEn
            ? `Last ${SUMMARY_WINDOW_DAYS} days (UTC), aggregated by article and AI bot`
            : `直近${SUMMARY_WINDOW_DAYS}日間（UTC）の記事×AIボット別集計`}
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label={isEn ? "Total AI hits" : "総AIアクセス数"} value={totalHitCount.toLocaleString()} />
        <SummaryCard label={isEn ? "Articles accessed" : "アクセスされた記事数"} value={byBlog.length.toLocaleString()} />
        <SummaryCard
          label={isEn ? "Top vendor" : "最多アクセスのAIサービス"}
          value={topVendor ? (VENDOR_LABELS[topVendor.vendor] ?? topVendor.vendor) : "-"}
        />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {isEn ? "Daily trend" : "日別トレンド"}
        </h2>
        {dailyTrend.length === 0 ? (
          <EmptyState isEn={isEn} />
        ) : (
          <ul className="mt-4 space-y-1">
            {dailyTrend.map((row) => (
              <li key={row.accessDate} className="flex items-center gap-3 text-sm">
                <span className="w-24 shrink-0 text-gray-500 dark:text-gray-400">{row.accessDate}</span>
                <span
                  className="h-3 rounded bg-blue-500 dark:bg-blue-400"
                  style={{ width: `${(row.hitCount / maxDailyHitCount) * 100}%` }}
                />
                <span className="text-gray-700 dark:text-gray-300">{row.hitCount}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {isEn ? "By vendor / purpose" : "ベンダー・用途別"}
        </h2>
        {byVendor.length === 0 ? (
          <EmptyState isEn={isEn} />
        ) : (
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400">
                <th className="py-2 font-medium">{isEn ? "Vendor" : "ベンダー"}</th>
                <th className="py-2 font-medium">{isEn ? "Purpose" : "用途"}</th>
                <th className="py-2 text-right font-medium">{isEn ? "Hits" : "アクセス数"}</th>
              </tr>
            </thead>
            <tbody>
              {byVendor.map((row) => (
                <tr key={`${row.vendor}-${row.purpose}`} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 text-gray-900 dark:text-white">{VENDOR_LABELS[row.vendor] ?? row.vendor}</td>
                  <td className="py-2 text-gray-700 dark:text-gray-300">
                    {isEn ? (PURPOSE_LABELS[row.purpose]?.en ?? row.purpose) : (PURPOSE_LABELS[row.purpose]?.ja ?? row.purpose)}
                  </td>
                  <td className="py-2 text-right text-gray-900 dark:text-white">{row.hitCount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {isEn ? "By article" : "記事別ランキング"}
        </h2>
        {byBlog.length === 0 ? (
          <EmptyState isEn={isEn} />
        ) : (
          <ul className="mt-4 space-y-6">
            {byBlog.map((row) => (
              <li key={row.blogId}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="truncate font-medium text-gray-900 dark:text-white">
                    {titleById.get(row.blogId) ?? row.blogId}
                  </span>
                  <span className="shrink-0 text-sm text-gray-500 dark:text-gray-400">
                    {row.totalHitCount.toLocaleString()} {isEn ? "hits" : "件"}
                  </span>
                </div>
                <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                  {row.byBot.map((bot) => (
                    <li key={bot.botId}>
                      {VENDOR_LABELS[bot.vendor] ?? bot.vendor} ({bot.botId}): {bot.hitCount.toLocaleString()}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

const SummaryCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
  </div>
);

const EmptyState = ({ isEn }: { isEn: boolean }) => (
  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
    {isEn ? "No AI access recorded in this period." : "この期間のAIアクセスは記録されていません。"}
  </p>
);

export default Page;
