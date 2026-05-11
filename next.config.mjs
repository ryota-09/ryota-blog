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
    "remotePatterns": [{ protocol: "https", hostname: "images.microcms-assets.io" }],
    // 一覧ページのサムネイル表示サイズに最適化（496px前後）
    deviceSizes: [640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    formats: ['image/webp'], // WebP優先で配信
    // minimumCacheTTL は Cloudflare Workers 非対応のため削除
  },
  // NOTE: RSCリクエストのContent-TypeはNext.jsが自動設定するため、
  // カスタムheaders()でのオーバーライドは不要（Cloudflare Workersでリダイレクト時に問題を引き起こすため削除）
  async redirects() {
    return [
      // HTTP で到達したリクエストを HTTPS に永続リダイレクト
      // Cloudflare → Origin 間で http のまま渡されたケースをここで弾く（Search Console の HTTPS 評価対策）
      // OpenNext (Cloudflare Workers) の path-to-regexp で :path* の 0 個マッチが
      // 展開されないため root パスは別エントリに分離
      {
        source: '/',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://ryotablog.jp/',
        permanent: true,
      },
      {
        source: '/:path+',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://ryotablog.jp/:path+',
        permanent: true,
      },
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