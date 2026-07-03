import type { AiBotDefinition } from './types';

// 2026年7月時点のAIボットUser-Agent一覧
// 出典: 各社公式クローラードキュメント（OpenAI/Anthropic/Perplexity/Google/Meta/Amazon/Apple/Mistral/DuckDuckGo）、
//       Cloudflare AI Crawl Control Bot Reference (https://developers.cloudflare.com/ai-crawl-control/reference/bots/)
//
// 注意: Google-Extended / Applebot-Extended は robots.txt 上のオプトアウト専用トークンで、
//       実際のクロールは Googlebot / Applebot 本体の UA で行われるため実行時 UA 判定には含めない。
//       Googlebot / Bingbot 本体は通常検索インデックス用途であり AI 専用ではないため対象外とする。
export const AI_BOT_CATALOG: readonly AiBotDefinition[] = [
  // --- 訓練クローラー(training): モデル学習用データ収集 ---
  { botId: 'gptbot', vendor: 'openai', purpose: 'training', uaToken: 'GPTBot' },
  { botId: 'claudebot', vendor: 'anthropic', purpose: 'training', uaToken: 'ClaudeBot' },
  { botId: 'ccbot', vendor: 'common_crawl', purpose: 'training', uaToken: 'CCBot' },
  { botId: 'bytespider', vendor: 'bytedance', purpose: 'training', uaToken: 'Bytespider' },
  { botId: 'meta_externalagent', vendor: 'meta', purpose: 'training', uaToken: 'meta-externalagent' },

  // --- AI検索/オンデマンド取得(search_index / user_fetch): ユーザーの質問に答えるための取得 ---
  { botId: 'oai_searchbot', vendor: 'openai', purpose: 'search_index', uaToken: 'OAI-SearchBot' },
  { botId: 'chatgpt_user', vendor: 'openai', purpose: 'user_fetch', uaToken: 'ChatGPT-User' },
  { botId: 'oai_adsbot', vendor: 'openai', purpose: 'search_index', uaToken: 'OAI-AdsBot' },
  { botId: 'claude_searchbot', vendor: 'anthropic', purpose: 'search_index', uaToken: 'Claude-SearchBot' },
  { botId: 'claude_user', vendor: 'anthropic', purpose: 'user_fetch', uaToken: 'Claude-User' },
  { botId: 'perplexitybot', vendor: 'perplexity', purpose: 'search_index', uaToken: 'PerplexityBot' },
  { botId: 'perplexity_user', vendor: 'perplexity', purpose: 'user_fetch', uaToken: 'Perplexity-User' },
  { botId: 'google_cloudvertexbot', vendor: 'google', purpose: 'search_index', uaToken: 'Google-CloudVertexBot' },
  { botId: 'meta_externalfetcher', vendor: 'meta', purpose: 'user_fetch', uaToken: 'meta-externalfetcher' },
  { botId: 'amazonbot', vendor: 'amazon', purpose: 'search_index', uaToken: 'Amazonbot' },
  { botId: 'mistralai_user', vendor: 'mistral', purpose: 'user_fetch', uaToken: 'MistralAI-User' },
  { botId: 'duckassistbot', vendor: 'duckduckgo', purpose: 'search_index', uaToken: 'DuckAssistBot' },
  { botId: 'applebot', vendor: 'apple', purpose: 'search_index', uaToken: 'Applebot' },
] as const;
