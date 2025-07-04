import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

import { AUTHOR_NAME, AUTHOR_NAME_EN, SITE_TITLE } from "@/static/blogs";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { locale: string } }) {
  const fontData = await fs.readFileSync(
    path.join(process.cwd(), "public/KosugiMaru-Regular.ttf"),
  );
  
  // localeに基づいて作者名を選択
  const authorName = params.locale === 'en' ? AUTHOR_NAME_EN : AUTHOR_NAME;
  
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