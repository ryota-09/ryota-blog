import { ImageResponse } from "next/og";

import { getBlogBySlugByLocale } from "@/lib/content";
import { loadOgFont } from "@/lib/ogFont";
import { AUTHOR_ICON_DATA_URL } from "@/static/author-icon";
import { AUTHOR_NAME, AUTHOR_NAME_EN } from "@/static/blogs";
import type { ContentLocale } from "@/types/content";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; blogId: string }>;
}) {
  // Next.js 16ではparamsがPromiseになるため、awaitで解決
  const { locale, blogId } = await params;

  // Kosugi Maru フォント（モジュールスコープでメモ化済み）
  const fontData = await loadOgFont();

  // localeに基づいて作者名を選択
  const authorName = locale === 'en' ? AUTHOR_NAME_EN : AUTHOR_NAME;

  // タイトルのみ使用するため、ファイルベースのコンテンツ層から取得する
  const data = getBlogBySlugByLocale(locale as ContentLocale, blogId);

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
          {data.title}
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