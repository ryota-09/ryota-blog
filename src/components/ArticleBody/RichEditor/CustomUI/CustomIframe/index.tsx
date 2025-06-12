'use client';

import type { ComponentProps } from "react";
import { useLocale } from 'next-intl';

type CustomIframeProps = {
  href: string
} & Omit<ComponentProps<"iframe">, "src" | "loading">;

const CustomIframe = ({ href, className, style, ...restProps }: CustomIframeProps) => {
  const locale = useLocale();
  
  return (
    <iframe {...restProps} src={`/${locale}/embedded?url=${encodeURIComponent(href)}`} className={className} style={{ ...style, overflowY: "hidden" }} loading="lazy" />
  )
}
export default CustomIframe;