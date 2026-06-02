import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

import { AUTHOR_NAME, AUTHOR_NAME_EN } from "@/static/blogs";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Next.js 16ではparamsがPromiseになるため、awaitで解決
  const { locale } = await params;

  // Kosugi Maru フォントをGoogle Fonts CDNから取得
  // Cloudflare Workersランタイムでは fs.readFileSync が使用不可のためfetchで代替
  const fontResponse = await fetch(
    "https://fonts.gstatic.com/s/kosugimaru/v17/0nksC9PgP_wGh21A2KeqGiTq.ttf",
    { cf: { cacheTtl: 86400 } } as RequestInit,
  );
  if (!fontResponse.ok) {
    throw new Error(`フォントの取得に失敗しました: ${fontResponse.status}`);
  }
  const fontData = await fontResponse.arrayBuffer();

  // localeに基づいて作者名・ページタイトルを選択
  const authorName = locale === "en" ? AUTHOR_NAME_EN : AUTHOR_NAME;
  const t = await getTranslations({ locale, namespace: "about" });
  const title = t("pageTitle");

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          background: "white",
          color: "black",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingBottom: "80px",
          borderTop: "84px solid rgb(59 172 182)",
          borderBottom: "84px solid rgb(59 172 182)",
          borderLeft: "96px solid rgb(59 172 182)",
          borderRight: "96px solid rgb(59 172 182)",
          borderRadius: "16px",
          fontSize: "48px",
          fontWeight: "bold",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            margin: "5px",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            WebkitLineClamp: 3,
          }}
        >
          {title}
        </div>
        <div
          style={{
            position: "absolute",
            right: "20px",
            bottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.microcms-assets.io/assets/4626924a681346e9a0fcabe5478eb9fa/652ac7c701f14f858ad1cbb1ece163c6/author.png"
            width="100"
            height="100"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
            }}
            alt="Icon"
          />
          <p>{authorName}</p>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Kosugi Maru",
          data: fontData,
        },
      ],
    },
  );
}
