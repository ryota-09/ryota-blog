import { describe, expect, it } from 'vitest';

import { classifyAiAccess } from '../classify';

describe('classifyAiAccess', () => {
  it('訓練クローラーのUAを正しく分類する', () => {
    const result = classifyAiAccess('Mozilla/5.0 AppleWebKit/537.36 (compatible; GPTBot/1.1; +https://openai.com/gptbot)');
    expect(result.isAiAccess).toBe(true);
    expect(result.bot?.botId).toBe('gptbot');
    expect(result.bot?.vendor).toBe('openai');
    expect(result.bot?.purpose).toBe('training');
  });

  it('AI検索/オンデマンド取得系のUAを正しく分類する', () => {
    const result = classifyAiAccess('Mozilla/5.0 (compatible; ChatGPT-User/1.0; +https://openai.com/bot)');
    expect(result.isAiAccess).toBe(true);
    expect(result.bot?.botId).toBe('chatgpt_user');
    expect(result.bot?.purpose).toBe('user_fetch');
  });

  it('PerplexityBotとPerplexity-Userを混同しない', () => {
    const bot = classifyAiAccess('Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/bot)');
    const user = classifyAiAccess('Mozilla/5.0 (compatible; Perplexity-User/1.0; +https://perplexity.ai/bot)');
    expect(bot.bot?.botId).toBe('perplexitybot');
    expect(bot.bot?.purpose).toBe('search_index');
    expect(user.bot?.botId).toBe('perplexity_user');
    expect(user.bot?.purpose).toBe('user_fetch');
  });

  it('通常ブラウザのUAはAIアクセスと判定しない', () => {
    const result = classifyAiAccess(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    expect(result.isAiAccess).toBe(false);
    expect(result.bot).toBeNull();
  });

  it('通常のGooglebot本体はAIアクセスと判定しない', () => {
    const result = classifyAiAccess('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
    expect(result.isAiAccess).toBe(false);
  });

  it('User-Agentがnullの場合はAIアクセスと判定しない', () => {
    const result = classifyAiAccess(null);
    expect(result.isAiAccess).toBe(false);
    expect(result.bot).toBeNull();
  });

  it('カタログ未登録のUAはAIアクセスと判定しない', () => {
    const result = classifyAiAccess('SomeNewCrawler/1.0');
    expect(result.isAiAccess).toBe(false);
    expect(result.bot).toBeNull();
  });
});
