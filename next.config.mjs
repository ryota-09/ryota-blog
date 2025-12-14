import createNextIntlPlugin from 'next-intl/plugin';

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
    minimumCacheTTL: 31536000, // 1年間のキャッシュ
  },
  async headers() {
    return [
      {
        // RSCリクエストの識別（_rscクエリパラメータ）
        source: '/:path*',
        has: [
          {
            type: 'query',
            key: '_rsc',
          },
        ],
        headers: [
          {
            key: 'Content-Type',
            value: 'text/x-component; charset=utf-8'
          },
          {
            key: 'Cache-Control',
            value: 'no-store'
          }
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