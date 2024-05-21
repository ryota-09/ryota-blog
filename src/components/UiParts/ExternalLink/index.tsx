import type { ComponentProps } from "react";

type ExternalLinkProps = Omit<ComponentProps<"a">, "target" | "rel">

const ExternalLink = ({ href, children, ...restProps }: ExternalLinkProps) => {
  return (
    <a {...restProps} href={href} target="_blank" rel="noopener noreferrer">{children}</a>
  )
}

export default ExternalLink;