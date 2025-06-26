import { Link } from '@/i18n/navigation';
import { type ComponentProps } from "react";

type CustomLinkProps = ComponentProps<"a">

const CustomLink = ({ href, children, ...restProps }: CustomLinkProps) => {
  return (
    <Link {...restProps} href={href ?? ""} className=" underline underline-offset-4 transition hover:text-base-color dark:hover:text-primary hover:no-underline break-all">{children}</Link>
  )
}
export default CustomLink;