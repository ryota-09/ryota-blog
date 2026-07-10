import type { MetadataRoute } from "next";

import { baseURL } from "@/config";

// クローラー向けのrobots設定。API・管理画面はクロール対象外にする
// (旧 /{locale}/embedded 埋め込みプロキシはLinkCardのRSC化で廃止済みのため対象から削除)
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/ja/admin", "/en/admin"],
      },
    ],
    sitemap: `${baseURL}/sitemap.xml`,
    host: baseURL,
  };
}
