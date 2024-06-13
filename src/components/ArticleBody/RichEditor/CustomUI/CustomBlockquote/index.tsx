import { type ComponentProps } from "react";

type CustomBlockquoteProps = ComponentProps<"blockquote">

const CustomBlockquote = ({ children, ...restProps }: CustomBlockquoteProps) => {
  return (
    <blockquote {...restProps} className="border-l-4 border-gray-200 pl-2 py-1 my-2 break-all">
      {children}
    </blockquote>
  )
}
export default CustomBlockquote;