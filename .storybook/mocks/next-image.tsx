import React from "react";

// next/image の Storybook 用モック（Vite環境では next/image が動作しないため）
const MockImage = (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => {
  const { fill, ...rest } = props;
  // fill プロパティが指定されている場合は、親要素に合わせて表示
  const style = fill
    ? { position: "absolute" as const, width: "100%", height: "100%", objectFit: "cover" as const }
    : {};
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...rest} style={{ ...style, ...((rest.style as React.CSSProperties) || {}) }} />;
};

export default MockImage;
