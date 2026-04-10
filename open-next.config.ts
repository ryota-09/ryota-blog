import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

// ローカル開発時はR2/DOが利用不可のため、本番デプロイ時のみ有効化
const isProduction = process.env.NODE_ENV === "production";

export default defineCloudflareConfig({
  ...(isProduction && {
    incrementalCache: r2IncrementalCache,
    queue: doQueue,
  }),
});
