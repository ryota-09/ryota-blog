import type { ComponentProps } from "react";

type ExternalLinkProps = Omit<ComponentProps<"a">, "rel">

const ExternalLink = ({ href, target, children, ...restProps }: ExternalLinkProps) => {
  return (
    <a {...restProps} href={href} target={target || "_blank"} rel="noopener noreferrer">{children}</a>
  )
}

export default ExternalLink;