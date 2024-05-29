import { Link } from 'next-view-transitions';
import { type ComponentProps } from "react";

type CustomLinkProps = ComponentProps<"a">

const CustomLink = ({ href, children, ...restProps }: CustomLinkProps) => {
  return (
    <Link {...restProps} href={href ?? ""} className=" underline underline-offset-4 transition hover:text-base-color dark:hover:text-primary hover:no-underline">{children}</Link>
  )
}
export default CustomLink;