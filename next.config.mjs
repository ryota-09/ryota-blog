/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    "remotePatterns": [{ protocol: "https", hostname: "images.microcms-assets.io" }]
  }
};

export default nextConfig;
