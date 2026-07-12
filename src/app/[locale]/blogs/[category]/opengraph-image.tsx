import { ImageResponse } from "next/og";

import { loadOgFont } from "@/lib/ogFont";

import { AUTHOR_ICON_DATA_URL } from "@/static/author-icon";
import { AUTHOR_NAME, AUTHOR_NAME_EN } from "@/static/blogs";
import { findCategoryBySlug } from "@/static/categories";
import { getLocalizedCategoryName } from "@/lib/i18n-utils";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ locale: string; category: string }> }) {
  // Next.js 16ではparamsがPromiseになるため、awaitで解決
  const { locale, category } = await params;

  // Kosugi Maru フォントの取得はモジュールスコープでメモ化されたloadOgFontに統一
  // (同一isolate内での再フェッチを避ける。実装は src/lib/ogFont.ts)
  const fontData = await loadOgFont();

  // localeに基づいて作者名を選択
  const authorName = locale === 'en' ? AUTHOR_NAME_EN : AUTHOR_NAME;

  const categoryEntry = findCategoryBySlug(category);
  const categoryName = categoryEntry ? getLocalizedCategoryName(categoryEntry, locale) : category;
  
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