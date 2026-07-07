import createNextIntlPlugin from 'next-intl/plugin';

// Cloudflare Workersバインディングのローカル開発用初期化
// R2/DO等のバインディングをローカルで使う場合はコメントを外す
// import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
// if (process.env.NODE_ENV === "development") {
//   await initOpenNextCloudflareForDev();
// }

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
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
    ];
  },
};

export default withNextIntl(nextConfig);
// module.exports = withBundleAnalyzer(nextConfig)