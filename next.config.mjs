// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    "remotePatterns": [{ protocol: "https", hostname: "images.microcms-assets.io" }]
  }
};
export default nextConfig
// module.exports = withBundleAnalyzer(nextConfig)