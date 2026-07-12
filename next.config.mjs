import createNextIntlPlugin from 'next-intl/plugin';

// Cloudflare Workersバインディングのローカル開発用初期化
// R2/DO等のバインディングをローカルで使う場合はコメントを外す
// import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
// if (process.env.NODE_ENV === "development") {
//   await initOpenNextCloudflareForDev();
// }

import withBundleAnalyzerFactory from '@next/bundle-analyzer';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// npm run analyze (ANALYZE=true) でバンドル内訳レポートを出力する。
// NOTE: webpack-bundle-analyzerベースのため、Turbopackビルド(Next 16の既定)では
// レポートが出ない。分析時は `ANALYZE=true npx next build --webpack` を使うこと
const withBundleAnalyzer = withBundleAnalyzerFactory({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // NOTE: experimental.inlineCss はA/B計測の結果、不採用(Issue #223)。
  // render-blocking監査は解消するが、日本語フォントの@font-face CSS(生90KB)が
  // 全ページのHTMLに複製されてFCPが2.4s→4.7s、Perfスコアが72→63に悪化した。
  // 外部CSSチャンク(エッジキャッシュ+ページ間再利用可能)を維持する方が速い。
  images: {
    // 記事画像・アイコン画像は全てリポジトリ内(public/)にローカルホスティングされているため、
    // 外部画像ドメインの許可(remotePatterns)は不要になった(#243)
    "remotePatterns": [],
    // 一覧ページのサムネイル表示サイズに最適化（496px前後）
    deviceSizes: [640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    formats: ['image/avif', 'image/webp'], // AVIF優先・WebPフォールバックで配信(webp比で概ね20〜30%削減)
    // minimumCacheTTL は Cloudflare Workers 非対応のため削除
  },
  // NOTE: RSCリクエストのContent-TypeはNext.jsが自動設定するため上書きしない。
  // ここでは全レスポンス共通の標準セキュリティヘッダーのみ付与する（CSPは外部埋め込みとの兼ね合いで別途検討）。
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Redirect /blogs/page to /blogs
      {
        source: '/blogs/page',
        destination: '/blogs',
        permanent: true,
      },
      // Redirect /blogs/page/1 to /blogs
      {
        source: '/blogs/page/1',
        destination: '/blogs',
        permanent: true,
      },
      // Redirect old query parameter format to new path format
      {
        source: '/blogs',
        has: [
          {
            type: 'query',
            key: 'page',
            value: '(?<page>\\d+)',
          },
        ],
        destination: '/blogs/page/:page',
        permanent: true,
      },
      // --- 旧クエリ形式の一覧URL互換リダイレクト (Issue #225) ---
      // /blogs・カテゴリページはsearchParamsを読まない静的(ISR)ページになったため、
      // 検索系クエリ付きの旧URLは動的レンダリング専用の /blogs/search へ誘導する。
      // NOTE: マッチしなかったクエリはNext.jsが自動でdestinationへ引き継ぐ
      {
        source: '/:locale/blogs',
        has: [{ type: 'query', key: 'blogType', value: 'zenn' }],
        destination: '/:locale/blogs/zenn',
        permanent: false,
      },
      // NOTE: hasのvalueは必ず指定すること。OpenNext(Cloudflare)のルーティング層は
      // value未指定を new RegExp("").test("") と評価し、クエリが無くても常にマッチしてしまう
      // (プレビュー実測で/ja/blogsが全て/blogs/searchへリダイレクトされる事故を確認)
      {
        source: '/:locale/blogs',
        has: [{ type: 'query', key: 'keyword', value: '.+' }],
        destination: '/:locale/blogs/search',
        permanent: false,
      },
      {
        source: '/:locale/blogs',
        has: [{ type: 'query', key: 'category', value: '.+' }],
        destination: '/:locale/blogs/search',
        permanent: false,
      },
      // ?page=N (N>=2) はパス形式のページネーションへ（page=1は素の/blogsで正しく表示される）
      {
        source: '/:locale/blogs',
        has: [{ type: 'query', key: 'page', value: '(?<page>[2-9]|[1-9]\\d+)' }],
        destination: '/:locale/blogs/page/:page',
        permanent: true,
      },
      // カテゴリページの旧検索URL（search/zenn/pageは予約セグメントのため除外）
      {
        source: '/:locale/blogs/:category((?!search$|zenn$|page$)[^/]+)',
        has: [{ type: 'query', key: 'keyword', value: '.+' }],
        destination: '/:locale/blogs/search?category=:category',
        permanent: false,
      },
      // カテゴリページの旧Zennタブ表示URL(?blogType=zenn)はZenn一覧へ誘導する
      {
        source: '/:locale/blogs/:category((?!search$|zenn$|page$)[^/]+)',
        has: [{ type: 'query', key: 'blogType', value: 'zenn' }],
        destination: '/:locale/blogs/zenn',
        permanent: false,
      },
      {
        source: '/:locale/blogs/:category((?!search$|zenn$|page$)[^/]+)',
        has: [{ type: 'query', key: 'page', value: '(?<page>[2-9]|[1-9]\\d+)' }],
        destination: '/:locale/blogs/:category/page/:page',
        permanent: true,
      },
    ];
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));