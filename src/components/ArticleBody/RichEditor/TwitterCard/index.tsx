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
      <aside className="dark:hidden max-w-[80%] md:max-auto mx-auto">
        <blockquote {...restProps} data-theme="light" className={cltw(className, "twitter-tweet")}>
          {children}
        </blockquote>
      </aside>
      <aside className="hidden dark:block max-w-[80%] md:max-auto mx-auto">
        <blockquote {...restProps} data-theme="dark" className={cltw(className, "twitter-tweet")}>
          {children}
        </blockquote>
      </aside>
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