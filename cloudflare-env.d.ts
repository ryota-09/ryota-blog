// wrangler types で生成された Env（worker-configuration.d.ts）を
// @opennextjs/cloudflare の getCloudflareContext() が返す CloudflareEnv にブリッジする。
// wrangler.*.jsonc のバインディングを変更したら `npm run cf-typegen` で worker-configuration.d.ts を再生成すること。
declare global {
  interface CloudflareEnv extends Env {
    // wrangler secret put で設定するシークレットのため wrangler types の生成対象に含まれない
    ADMIN_BASIC_AUTH_USER?: string;
    ADMIN_BASIC_AUTH_PASSWORD?: string;
  }
}

export {};
