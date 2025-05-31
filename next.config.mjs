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
  }
};
export default nextConfig
// module.exports = withBundleAnalyzer(nextConfig)