import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

import { AUTHOR_NAME, AUTHOR_NAME_EN, CATEGORY_MAPED_NAME } from "@/static/blogs";
import { getCategoryById } from "@/lib/microcms";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ locale: string; category: string }> }) {
  // Next.js 16ではparamsがPromiseになるため、awaitで解決
  const { locale, category } = await params;

  const fontData = fs.readFileSync(
    path.join(process.cwd(), "public/KosugiMaru-Regular.ttf"),
  );

  // localeに基づいて作者名を選択
  const authorName = locale === 'en' ? AUTHOR_NAME_EN : AUTHOR_NAME;

  let categoryName = category;

  try {
    const categoryData = await getCategoryById(category);
    // localeに基づいてカテゴリー名を選択
    categoryName = locale === 'en' && categoryData.name_en ? categoryData.name_en : categoryData.name;
  } catch (error) {
    // microCMSから取得できない場合は、CATEGORY_MAPED_NAMEから取得
    categoryName = CATEGORY_MAPED_NAME[category] || category;
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
          alignItems: "center",
          paddingBottom: "80px",
          borderTop: "84px solid rgb(59, 172, 182)",
          borderBottom: "84px solid rgb(59, 172, 182)",
          borderLeft: "96px solid rgb(59, 172, 182)",
          borderRight: "96px solid rgb(59, 172, 182)",
          borderRadius: "16px",
          fontSize: "48px",
          fontWeight: "bold",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "40px",
            top: "40px",
            fontSize: "32px",
            // color: "rgb(59 172 182)",
            fontWeight: "bold",
          }}
        >
          {locale === 'en' ? 'Category' : 'カテゴリー'}
        </div>
        <div
          style={{
            background: "linear-gradient(135deg, rgb(59, 172, 182) 0%, rgb(20, 184, 166) 100%)",
            color: "white",
            padding: "32px 80px",
            borderRadius: "16px",
            fontSize: "104px",
            boxShadow: "0 20px 40px rgba(59, 172, 182, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2) inset",
            textAlign: "center",
            letterSpacing: "2px",
            transform: "translateY(-8px) rotate(-3deg)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {categoryName}
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