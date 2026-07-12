import { ImageResponse } from "next/og";

import { getBlogBySlugByLocale } from "@/lib/content";
import { AUTHOR_ICON_DATA_URL } from "@/static/author-icon";
import { AUTHOR_NAME } from "@/static/blogs";
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

  // タイトルのみ使用するため、ファイルベースのコンテンツ層から取得する。
  // 存在しないslugでは例外になるため、500ではなく404を返す(本番検証で発見)
  let data;
  try {
    data = getBlogBySlugByLocale(locale as ContentLocale, blogId);
  } catch {
    return new Response("Not Found", { status: 404 });
  }
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
          border: "48px solid rgb(59 172 182)",
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
          <img
            src={AUTHOR_ICON_DATA_URL}
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
            }}
            alt="Icon"
          />
          <p>{AUTHOR_NAME}</p>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}