// OG/Twitter画像生成で使う Kosugi Maru フォントの取得をモジュールスコープでメモ化する。
// Cloudflare Workersランタイムでは fs が使えないため Google Fonts CDN から取得し、
// 同一isolate内での再フェッチを避ける（エッジキャッシュ + プロセス内キャッシュの二段構え）。
const KOSUGI_MARU_URL =
  "https://fonts.gstatic.com/s/kosugimaru/v17/0nksC9PgP_wGh21A2KeqGiTq.ttf";

let cachedFontPromise: Promise<ArrayBuffer> | null = null;

export const loadOgFont = (): Promise<ArrayBuffer> => {
  if (!cachedFontPromise) {
    cachedFontPromise = (async () => {
      const res = await fetch(KOSUGI_MARU_URL, { cf: { cacheTtl: 86400 } } as RequestInit);
      if (!res.ok) {
        // 失敗時はキャッシュを残さず次回再試行できるようにする
        cachedFontPromise = null;
        throw new Error(`フォントの取得に失敗しました: ${res.status}`);
      }
      return res.arrayBuffer();
    })();
  }
  return cachedFontPromise;
};
