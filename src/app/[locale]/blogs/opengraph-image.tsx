import { ImageResponse } from "next/og";

import { loadOgFont } from "@/lib/ogFont";

import { AUTHOR_ICON_DATA_URL } from "@/static/author-icon";
import { AUTHOR_NAME, AUTHOR_NAME_EN, SITE_TITLE } from "@/static/blogs";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  // Next.js 16ではparamsがPromiseになるため、awaitで解決
  const { locale } = await params;

  // Kosugi Maru フォントの取得はモジュールスコープでメモ化されたloadOgFontに統一
  // (同一isolate内での再フェッチを避ける。実装は src/lib/ogFont.ts)
  const fontData = await loadOgFont();

  // localeに基づいて作者名を選択
  const authorName = locale === 'en' ? AUTHOR_NAME_EN : AUTHOR_NAME;
  
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
          alignItems: "center",
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
          {SITE_TITLE}
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
          <img
            src={AUTHOR_ICON_DATA_URL}
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