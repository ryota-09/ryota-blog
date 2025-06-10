// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    "remotePatterns": [{ protocol: "https", hostname: "images.microcms-assets.io" }],
    deviceSizes: [640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96],
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
export default nextConfig
// module.exports = withBundleAnalyzer(nextConfig)