import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";

// ローカル開発時はR2/DO/D1が利用不可のため、本番デプロイ時のみ有効化
const isProduction = process.env.NODE_ENV === "production";

export default defineCloudflareConfig({
  ...(isProduction && {
    // TTFB対策: 素のR2直結だとキャッシュヒットでも毎回R2往復(実測TTFB 520〜850ms)が発生する。
    // Cache API(データセンターローカル)でR2の手前をラップし、ISR/SSGエントリを
    // revalidate値までリージョン内で再利用する(long-lived)。
    // 注意: revalidateTag/revalidatePathによるオンデマンド再検証を導入する場合は
    // リージョン間の伝播遅延と既知バグ(opennextjs-cloudflare#1295)を再確認すること
    incrementalCache: withRegionalCache(r2IncrementalCache, { mode: "long-lived" }),
    queue: doQueue,
    tagCache: d1NextTagCache,
  }),
  // ISR/SSGキャッシュヒット時にNextServerの起動を丸ごとスキップして直接レスポンスを返す。
  // middleware(next-intlロケール解決・AIアクセス計測・adminのBasic認証)は
  // interceptionより必ず前に実行されるため影響なし(@opennextjs/aws routingHandlerで確認済み)
  enableCacheInterception: true,
});
