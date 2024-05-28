"use client"

import { cltw } from "@/util";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { ComponentProps, useEffect } from "react";

type TwitterCardProps = ComponentProps<"blockquote">;

const TwitterCard = ({ children, className, ...restProps }: TwitterCardProps) => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.twttr === "object") {
      window.twttr.widgets.load();
    }
  }, [pathname]);

  return (
    <>
      <blockquote {...restProps} className={cltw(className, "twitter-tweet")}>
        {children}
      </blockquote>
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
      />
    </>
  )
}
export default TwitterCard

declare global {
  interface Window {
    twttr: {
      widgets: {
        load: () => void;
      };
    };
  }
}