import type { MetadataRoute } from "next";

import { baseURL } from "@/config";

// クローラー向けのrobots設定。API・埋め込みプロキシ・ドラフトはクロール対象外にする
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/ja/embedded", "/en/embedded", "/ja/admin", "/en/admin"],
      },
    ],
    sitemap: `${baseURL}/sitemap.xml`,
    host: baseURL,
  };
}
