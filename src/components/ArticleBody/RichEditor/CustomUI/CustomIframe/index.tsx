import type { ComponentProps } from "react";

type CustomIframeProps = {
  href: string
} & Omit<ComponentProps<"iframe">, "src" | "loading">;

const CustomIframe = ({ href, className, style, ...restProps }: CustomIframeProps) => {
  return (
    <iframe {...restProps} src={`/embedded?url=${href}`} className={className} style={{ ...style, overflowY: "hidden" }} loading="lazy" />
  )
}
export default CustomIframe;