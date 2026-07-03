import { AI_BOT_CATALOG } from './bot-catalog';
import type { AiAccessClassification } from './types';

/**
 * User-Agent文字列からAIアクセスを判定する。
 *
 * 補足: Cloudflare Workersのrequest.cfには「verifiedBotCategory」という文字列フィールドは存在せず、
 * cf.botManagement.verifiedBot（真偽値）はEnterprise Bot Management契約時のみ設定される上、
 * AI/非AIを区別できない（Googlebot等の一般的な優良botもtrueになる）ため判定には使用しない。
 * UAは自己申告であり偽装可能な点を踏まえ、既知パターンとの部分一致による分類に留める。
 */
export function classifyAiAccess(userAgent: string | null): AiAccessClassification {
  if (!userAgent) {
    return { isAiAccess: false, bot: null };
  }

  const lowerUa = userAgent.toLowerCase();
  const matches = AI_BOT_CATALOG.filter((bot) => lowerUa.includes(bot.uaToken.toLowerCase()));

  if (matches.length === 0) {
    return { isAiAccess: false, bot: null };
  }

  // 複数マッチした場合はより特異的な（トークンが長い）定義を優先する
  const bot = matches.reduce((longest, current) =>
    current.uaToken.length > longest.uaToken.length ? current : longest
  );
  return { isAiAccess: true, bot };
}
