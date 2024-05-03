import { HTMLAttributes } from "react";

type CustomBlockquoteProps = HTMLAttributes<HTMLQuoteElement>

const CustomBlockquote = ({ children, ...restProps }: CustomBlockquoteProps) => {
  return (
    <blockquote {...restProps} className="quote-gray text-red-100 border-l-4 border-gray-200 pl-2 py-1 my-2" style={{ color: "red" }}>
      {children}
    </blockquote>
  )
}
export default CustomBlockquote;