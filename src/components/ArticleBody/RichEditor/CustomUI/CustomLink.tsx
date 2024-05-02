import Link from "next/link";
import { HTMLAttributes, ReactNode } from "react";

type CustomLinkProps = { href: string, children: ReactNode } & HTMLAttributes<HTMLAnchorElement>

const CustomLink = ({ href, children, ...restProps }: CustomLinkProps) => {
  return (
    <Link {...restProps} href={href} className=" no-underline transition hover:text-base-color hover:underline hover:underline-offset-4 hover:decoration-base-color">{children}</Link>
  )
}
export default CustomLink;