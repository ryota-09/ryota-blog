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
      <div className="dark:hidden">
        <blockquote {...restProps} data-theme="light" className={cltw(className, "twitter-tweet")}>
          {children}
        </blockquote>
      </div>
      <div className="hidden dark:block">
        <blockquote {...restProps} data-theme="dark" className={cltw(className, "twitter-tweet")}>
          {children}
        </blockquote>
      </div>
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