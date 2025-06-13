import { ImageResponse } from "next/og";

import { getBlogById } from "@/lib/microcms";
import { AUTHOR_NAME } from "@/static/blogs";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: { blogId: string };
}) {
  const blogId = params.blogId;
  const data = await getBlogById(blogId, { fields: "title" });
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.microcms-assets.io/assets/4626924a681346e9a0fcabe5478eb9fa/652ac7c701f14f858ad1cbb1ece163c6/author.png"
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