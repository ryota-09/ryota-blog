import Link from "next/link";
import { HTMLAttributes, ReactNode } from "react";

type CustomLinkProps = { href: string, children: ReactNode } & HTMLAttributes<HTMLAnchorElement>

const CustomLink = ({ href, children, ...restProps }: CustomLinkProps) => {
  return (
    <Link {...restProps} href={href} className=" underline underline-offset-4 transition hover:text-base-color hover:no-underline">{children}</Link>
  )
}
export default CustomLink;